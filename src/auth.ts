import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import dbConnect from './lib/db';
import User from './models/User';
import bcrypt from 'bcryptjs';

async function getUser(email: string) {
  await dbConnect();
  try {
    const user = await User.findOne({ email }).select('+password');
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          
          const passwordsMatch = await bcrypt.compare(password, user.password as string);
          if (passwordsMatch) {
             // Return user object with role and id. 
             // Note: _id is an ObjectId, so we convert to string.
             return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
             };
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
