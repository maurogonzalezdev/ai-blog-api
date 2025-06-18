import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { exceptionHandler } from '@api/helpers';
import { hashPassword, comparePassword } from '@api/libs';
import { UserLogin } from '@api/auth/types';
import { UserLoginDto, UserSignupDto } from '@api/auth/dto';
import { PrismaService } from '@api/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly _prismaService: PrismaService) {}

  public async userLogin({
    email,
    password,
  }: UserLoginDto): Promise<Omit<UserLogin, 'passwordHash'>> {
    try {
      const user: UserLogin | null = await this._prismaService.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
          isActive: true,
          passwordHash: true,
        },
      });

      if (!user) throw new NotFoundException('User not found');

      if (!user.isActive)
        throw new BadRequestException('User account is inactive');

      if (await comparePassword(password, user.passwordHash)) {
        throw new BadRequestException('Wrong password');
      }

      await this._prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastLogin: new Date(),
        },
      });

      return {
        id: user.id,
        isActive: user.isActive,
      };
    } catch (error: unknown) {
      return exceptionHandler(error);
    }
  }

  // * TODO: User signup func
  public async userSignup({ email, password }: UserSignupDto) {}

  // * TODO: Atomize func
  private async _updateLastLogin() {}
  private async _validateUser() {}
  private userReturn() {}
}
