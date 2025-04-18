import User from "@/models/user";
import { IUser } from "@/models/user";
// If you're using TypeScript types

/**
 * Fetch a user by email address
 * @param email - user email
 * @returns IUser | null
 */
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const user = await User.findOne({ email }).exec();
    return user;
  } catch (error) {
    console.error('❌ Error fetching user by email:', error);
    return null;
  }
};
