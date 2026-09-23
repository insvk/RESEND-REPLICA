import { Client as QStashClient } from '@upstash/qstash';
import { prisma } from './prisma';
import { generateIdempotencyFingerprint } from './crypto';

const qstashClient = new QStashClient({
  token: process.env.QSTASH_TOKEN || 'mock_token',
});

export interface EnqueueEmailPayload {
  emailId: string;
  projectId: string;
}

/**
 * Enqueues an email for background processing.
 */
export async function enqueueEmailJob(payload: EnqueueEmailPayload) {
  if (!process.env.QSTASH_TOKEN) {
    console.log(`[Queue] No QSTASH_TOKEN found. Processing email synchronously.`);
    // WARNING: On Vercel, this blocks the API response until the SMTP server replies.
    // If the SMTP server is slow, this could cause Vercel 504 Timeout errors.
    try {
      await processEmailJob(payload);
    } catch (e) {
      console.error('Synchronous processor error:', e);
    }
    return;
  }

  // Publish to QStash
  await qstashClient.publishJSON({
    url: `${process.env.APP_URL}/api/webhooks/qstash`,
    body: payload,
    // Add delays, retries, etc. if needed via upstash options
  });
}

/**
 * The actual job processor logic.
 */
export async function processEmailJob(payload: EnqueueEmailPayload) {
  await prisma.email.update({
    where: { id: payload.emailId },
    data: { status: 'PROCESSING' }
  });

  const { getEmailProvider } = await import('./providers/mockProvider');
  const provider = await getEmailProvider();

  // Load the email record
  const email = await prisma.email.findUnique({ where: { id: payload.emailId }});
  if (!email) return;

  try {
    const result = await provider.sendEmail({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.html ?? undefined,
      text: email.text ?? undefined,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    // Success -> update DB
    await prisma.$transaction([
      prisma.email.update({
        where: { id: payload.emailId },
        data: { 
          status: 'SENT', 
          providerId: result.providerId 
        }
      }),
      prisma.emailEvent.create({
        data: {
          emailId: payload.emailId,
          status: 'SENT',
          providerEventId: result.providerId
        }
      })
    ]);

  } catch (error: any) {
    // Failure -> update DB
    await prisma.$transaction([
      prisma.email.update({
        where: { id: payload.emailId },
        data: { status: 'FAILED' }
      }),
      prisma.emailEvent.create({
        data: {
          emailId: payload.emailId,
          status: 'FAILED'
        }
      })
    ]);
  }
}
