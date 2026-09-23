import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash the password securely for DB storage
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Create the user AND their default project atomically
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        projects: {
          create: {
            name: `${name || 'My'} Production API`,
          }
        }
      }
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
