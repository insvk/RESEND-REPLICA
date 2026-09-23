import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { enqueueEmailJob } from '@/lib/queue';
import { generateIdempotencyFingerprint } from '@/lib/crypto';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const auth = await authenticateApiRequest(request);
    if (!auth.isAuthenticated) {
      return NextResponse.json({
        error: { type: 'auth_error', message: auth.error, code: 'unauthorized' }
      }, { status: 401 });
    }

    const projectId = auth.projectId!;

    // 2. Payload Validation
    let payload;
    try {
      payload = await request.json();
    } catch (e) {
      return NextResponse.json({
        error: { type: 'validation_error', message: 'Invalid JSON payload', code: 'invalid_json' }
      }, { status: 400 });
    }

    const { from, to, subject, html, text } = payload;
    
    if (!from || !to || !subject) {
      return NextResponse.json({
        error: { type: 'validation_error', message: 'Missing required fields: from, to, subject', code: 'missing_fields' }
      }, { status: 422 });
    }

    const recipients = Array.isArray(to) ? to : [to];

    // 3. Idempotency Check
    const idempotencyKey = request.headers.get('idempotency-key');
    if (idempotencyKey) {
      const fingerprint = generateIdempotencyFingerprint(projectId, idempotencyKey);
      
      const existingEmail = await prisma.email.findFirst({
        where: { projectId, idempotencyKey: fingerprint }
      });

      if (existingEmail) {
        return NextResponse.json({
          id: existingEmail.id,
          object: 'email',
          status: existingEmail.status,
          created_at: existingEmail.createdAt.toISOString()
        }, { status: 200 }); // 200 OK for idempotent replay
      }
    }

    // 4. Rate Limiting Check
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { Ratelimit } = await import('@upstash/ratelimit');
      const { Redis } = await import('@upstash/redis');
      
      const redis = Redis.fromEnv();
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds per project
        analytics: true,
      });

      const { success, limit, remaining, reset } = await ratelimit.limit(`ratelimit_emails_${projectId}`);
      if (!success) {
        return NextResponse.json({
          error: { type: 'rate_limit', message: 'Too many requests', code: 'too_many_requests' }
        }, { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        });
      }
    }

    // 5. Database Insertion (QUEUED)
    const emailRecord = await prisma.email.create({
      data: {
        projectId,
        from,
        to: recipients,
        subject,
        html,
        text,
        status: 'QUEUED',
        idempotencyKey: idempotencyKey ? generateIdempotencyFingerprint(projectId, idempotencyKey) : null,
      }
    });

    // Write initial event
    await prisma.emailEvent.create({
      data: {
        emailId: emailRecord.id,
        status: 'QUEUED'
      }
    });

    // 6. Enqueue for background processing
    await enqueueEmailJob({
      emailId: emailRecord.id,
      projectId
    });

    // 7. Response
    return NextResponse.json({
      id: emailRecord.id,
      object: 'email',
      status: 'queued',
      created_at: emailRecord.createdAt.toISOString()
    }, { status: 202 }); // 202 Accepted

  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json({
      error: { type: 'server_error', message: 'Internal Server Error', code: 'internal_error' }
    }, { status: 500 });
  }
}
