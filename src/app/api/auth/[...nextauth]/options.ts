import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/user';
import bcrypt from 'bcryptjs';

export interface CredentialsType {
  identifire: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifire: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) throw new Error('Missing credentials');

        await connectDB();
        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifire },
            { username: credentials.identifire },
          ],
        });

        if (!user) throw new Error('User not found');
        if (!user.isVerified) throw new Error('Please verify your account first');

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) throw new Error('Incorrect password');

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username, // required by NextAuth
          // optionally pass anything else with token
        } as unknown as User;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id as string;
        token.username = user.name as string;
        token.isVerified = true;
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id;
      session.user.username = token.username;
      session.user.isVerified = token.isVerified;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    verifyRequest: '/auth/verify',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
