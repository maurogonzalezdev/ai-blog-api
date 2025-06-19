import { UserLogIn } from '@api/auth/types';

export interface AuthResponse {
  user: Omit<UserLogIn, 'passwordHash'>;
}
