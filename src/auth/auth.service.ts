import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { exceptionHandler, usernamePrefix } from '@api/helpers';
import { hashPassword, comparePassword, shortUniqueId } from '@api/libs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@api/prisma/prisma.service';
import { UserLogIn, JwtPayload } from '@api/auth/types';
import { UserLogInDto, UserSignUpDto } from '@api/auth/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _jwtService: JwtService,
  ) {}

  private async _findUser(email: string): Promise<UserLogIn | null> {
    return this._prismaService.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        username: true,
        passwordHash: true,
        role: true,
        isActive: true,
      },
    });
  }

  private _userAccountStatus(user: UserLogIn): void {
    if (!user.isActive) {
      throw new BadRequestException(
        'User account is inactive, please contact site admin',
      );
    }

    return;
  }

  private _validateUser(user: UserLogIn | null): void {
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return;
  }

  private _createUserName(
    usernamePrefix: () => string,
    shortUniqueId: () => string,
  ): string {
    return `${usernamePrefix()}-${shortUniqueId()}`;
  }

  public async jwtSignAsync(jwtPayload: JwtPayload): Promise<string> {
    try {
      const jwt: string = await this._jwtService.signAsync(jwtPayload);
      return jwt;
    } catch (error: unknown) {
      throw exceptionHandler(error);
    }
  }

  public async userLogIn({
    email,
    password,
  }: UserLogInDto): Promise<Omit<UserLogIn, 'passwordHash'>> {
    try {
      const user: UserLogIn | null = await this._findUser(email);

      this._validateUser(user);

      this._userAccountStatus(user!);

      if (!(await comparePassword(password, user!.passwordHash))) {
        throw new BadRequestException('Wrong password');
      }

      await this._prismaService.user.update({
        where: {
          id: user!.id,
        },
        data: {
          lastLogin: new Date(),
        },
      });

      return {
        id: user!.id,
        username: user!.username,
        role: user!.role,
        isActive: user!.isActive,
      };
    } catch (error: unknown) {
      throw exceptionHandler(error);
    }
  }

  public async userSignUp({
    email,
    password,
  }: UserSignUpDto): Promise<Omit<UserLogIn, 'passwordHash'>> {
    try {
      const userFound: UserLogIn | null = await this._findUser(email);

      if (userFound) {
        this._userAccountStatus(userFound);

        throw new BadRequestException('User account already exists');
      }

      const username: string = this._createUserName(
        usernamePrefix,
        shortUniqueId,
      );

      const newUser: Omit<UserLogIn, 'passwordHash'> =
        await this._prismaService.user.create({
          data: {
            email,
            passwordHash: await hashPassword(password),
            username,
          },
          select: {
            id: true,
            username: true,
            role: true,
            isActive: true,
          },
        });

      return newUser;
    } catch (error: unknown) {
      throw exceptionHandler(error);
    }
  }
}
