import { PickType } from '@nestjs/mapped-types';

import { UserSignupDto } from '@api/auth/dto';

export class UserLoginDto extends PickType(UserSignupDto, [
  'email',
  'password',
] as const) {}
