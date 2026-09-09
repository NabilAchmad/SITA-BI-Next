import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            mahasiswa: true,
            dosen: true
          }
        });

        if (!user) {
          return null;
        }

        // Check password (SITA-BI uses Laravel's bcrypt)
        // Note: Laravel bcrypt hashing is compatible with bcryptjs
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordsMatch) return null;

        // Determine role
        let role = 'admin';
        if (user.mahasiswa) role = 'mahasiswa';
        else if (user.dosen) role = 'dosen';

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: role,
        };
      },
    }),
  ],
});
