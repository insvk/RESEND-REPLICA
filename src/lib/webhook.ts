import crypto from 'crypto';
import { prisma } from './prisma';

export interface WebhookPayload {
  type: string;
  created_at: string;
  data: Record<string, any>;
}

/**
 * Dispatches an event to all configured webhooks for a project.
 */
export async function dispatchWebhookEvent(projectId: string, eventType: string, data: Record<string, any>) {
  const webhooks = await prisma.webhook.findMany({
    where: {
      projectId,
      enabled: true,
      // In a real app we might filter by the `events` array here using Postgres JSONB or Array operators
    }
  });

  const webhooksToTrigger = webhooks.filter((w: any) => w.events.includes(eventType) || w.events.includes('*'));

  const payload: WebhookPayload = {
    type: eventType,
    created_at: new Date().toISOString(),
    data
  };

  const payloadString = JSON.stringify(payload);

  // Fire and forget dispatches.
  // In production, this should be sent to Upstash QStash to handle retries.
  for (const webhook of webhooksToTrigger) {
    try {
      const timestamp = Date.now().toString();
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(`${timestamp}.${payloadString}`)
        .digest('hex');

      // Async fetch without awaiting directly in loop to prevent slow endpoints from blocking
      fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'webhook-id': webhook.id,
          'webhook-timestamp': timestamp,
          'webhook-signature': `v1,${signature}`
        },
        body: payloadString
      }).catch(err => {
        console.error(`Webhook delivery failed for ${webhook.id}:`, err);
      });
      
    } catch (e) {
      console.error(`Error constructing webhook for ${webhook.id}`, e);
    }
  }
}
