import bcrypt from 'bcryptjs';

export const verifyPassword = async (inputPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};
