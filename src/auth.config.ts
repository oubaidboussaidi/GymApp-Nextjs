import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to signIn page (/)
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      // Initial sign in - store user data in token
      if (user) {
        token.role = user.role;
        token.id = user.id as string;
        token.image = user.image;
        token.physicalStats = (user as any).physicalStats;
      }
      
      // Handle session update trigger - refetch user data from database
      if (trigger === 'update') {
        try {
          // Dynamically import to avoid edge runtime issues
          const dbConnect = (await import('./lib/db')).default;
          const User = (await import('./models/User')).default;
          
          await dbConnect();
          const updatedUser = await User.findById(token.id).lean();
          
          if (updatedUser) {
            token.name = updatedUser.name;
            token.image = updatedUser.image;
            token.physicalStats = updatedUser.physicalStats;
          }
        } catch (error) {
          console.error('Error refreshing user data in JWT:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.image = token.image as string | null;
        (session.user as any).physicalStats = token.physicalStats;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
