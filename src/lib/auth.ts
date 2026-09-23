import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { hashApiKey } from './crypto';

export interface AuthResult {
  isAuthenticated: boolean;
  projectId?: string;
  error?: string;
}

export async function authenticateApiRequest(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isAuthenticated: false, error: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('re_')) {
    return { isAuthenticated: false, error: 'Invalid API key format' };
  }

  const hashedKey = hashApiKey(token);

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { hash: hashedKey },
      select: { projectId: true, id: true }
    });

    if (!apiKey) {
      return { isAuthenticated: false, error: 'Invalid API key' };
    }

    // Fire and forget update last used
    prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsed: new Date() }
    }).catch(console.error);

    return { isAuthenticated: true, projectId: apiKey.projectId };
  } catch (error) {
    console.error('API Key DB Validation Error:', error);
    return { isAuthenticated: false, error: 'Internal Server Error during validation' };
  }
}
