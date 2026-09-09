import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnDosen = nextUrl.pathname.startsWith('/dosen');
      const isOnMahasiswa = nextUrl.pathname.startsWith('/mahasiswa');
      const isOnLogin = nextUrl.pathname.startsWith('/auth/login');
      
      if (isOnAdmin || isOnDosen || isOnMahasiswa) {
        if (isLoggedIn) {
          const role = auth.user.role as string;
          // Protect routes based on role
          if (isOnAdmin && role !== 'admin') return Response.redirect(new URL(`/${role}/dashboard`, nextUrl));
          if (isOnDosen && role !== 'dosen') return Response.redirect(new URL(`/${role}/dashboard`, nextUrl));
          if (isOnMahasiswa && role !== 'mahasiswa') return Response.redirect(new URL(`/${role}/dashboard`, nextUrl));
          
          return true; // Authorized
        }
        return false; // Redirect to login
      } else if (isLoggedIn && isOnLogin) {
        // Redirect authenticated users away from login page
        return Response.redirect(new URL(`/${auth.user.role}/dashboard`, nextUrl));
      }
      
      return true;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      if (token?.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
