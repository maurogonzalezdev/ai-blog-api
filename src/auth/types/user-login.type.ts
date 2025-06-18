import { Role } from 'generated/prisma';

export type UserLogin = {
  id: string;
  username: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
};
