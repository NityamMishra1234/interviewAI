import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extending Session and User
declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      email: string;
      username?: string;
      isVerified?: boolean;
      company?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    _id: string;
    username?: string;
    isVerified?: boolean;
    company?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    email: string;
    username?: string;
    isVerified?: boolean;
    company?: string;
  }
}
