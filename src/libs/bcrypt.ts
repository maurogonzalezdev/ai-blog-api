import { hash, compare } from 'bcrypt';

export const hashPassword = async (
  plainTextPassword: string,
  salt: number = 10,
): Promise<string> => {
  return await hash(plainTextPassword, salt);
};

export const comparePassword = async (
  plainTextPassword: string,
  hash: string,
): Promise<boolean> => {
  return await compare(plainTextPassword, hash);
};
