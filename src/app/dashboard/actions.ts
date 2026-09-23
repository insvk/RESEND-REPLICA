'use server';

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export async function createApiKey() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { projects: true }
  });

  if (!user || user.projects.length === 0) {
    throw new Error('User has no active projects.');
  }

  const projectId = user.projects[0].id; // For now, defaulting to the first project

  // Generate 24 random bytes (32 base64url characters)
  const rawToken = crypto.randomBytes(24).toString('base64url');
  const apiKeyRaw = `re_${rawToken}`;
  
  // Hash the token for database storage
  const hash = crypto.createHash('sha256').update(apiKeyRaw).digest('hex');
  
  // Store the hash in DB
  await prisma.apiKey.create({
    data: {
      name: 'Production Key',
      hash,
      prefix: 're_', // For UI display reference
      projectId
    }
  });

  // Revalidate the api-keys page to refresh the table
  revalidatePath('/dashboard/api-keys');

  // We return the RAW key ONLY ONCE. The client must save it immediately.
  return { apiKey: apiKeyRaw };
}

export async function createDomain(domainName: string) {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error('Not authenticated');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { projects: true }
  });

  if (!user || user.projects.length === 0) throw new Error('No active projects');
  const projectId = user.projects[0].id;

  await prisma.domain.create({
    data: {
      name: domainName,
      projectId,
      status: 'UNVERIFIED',
      verifications: {
        create: [
          { type: 'TXT', record: `resend-replica._domainkey.${domainName}`, status: 'UNVERIFIED' },
          { type: 'CNAME', record: `bounce.${domainName}`, status: 'UNVERIFIED' }
        ]
      }
    }
  });

  revalidatePath('/dashboard/domains');
}
