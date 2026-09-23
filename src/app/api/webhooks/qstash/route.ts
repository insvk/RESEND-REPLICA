import { NextRequest, NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs';
import { processEmailJob, EnqueueEmailPayload } from '@/lib/queue';

async function handler(request: NextRequest) {
  try {
    const payload: EnqueueEmailPayload = await request.json();
    
    // Process the email job
    await processEmailJob(payload);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[QStash Webhook] Error processing job:', error);
    // Returning 500 will cause QStash to automatically retry with exponential backoff
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Ensure the request is actually coming from QStash using cryptographic signature
export const POST = verifySignatureAppRouter(handler, {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || 'mock_current_key',
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || 'mock_next_key',
});
