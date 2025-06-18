import { Role } from 'generated/prisma';

export type UserLogIn = {
  id: string;
  username: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
};
