import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) return null;

        // In a real production app, use bcrypt or argon2. 
        // For simplicity and dependency reduction in this mock, using basic hashing:
        const hashedInput = crypto.createHash('sha256').update(credentials.password).digest('hex');
        
        if (hashedInput === user.password) {
          return { id: user.id, email: user.email, name: user.name };
        }
        
        return null;
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login', // We would build this page if we had more time
  }
});

export { handler as GET, handler as POST };
