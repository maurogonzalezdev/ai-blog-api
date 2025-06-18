import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { AuthService } from '@api/auth/auth.service';
import { UserLogIn } from '@api/auth/types';
import { UserLogInDto, UserSignUpDto } from '@api/auth/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  public async userLogIn(
    @Body() userLogInDto: UserLogInDto,
  ): Promise<Record<string, any>> {
    const user: Omit<UserLogIn, 'passwordHash'> =
      await this._authService.userLogIn(userLogInDto);
    const jwt: string = await this._authService.jwtSignAsync({
      sub: user.id,
      username: user.username,
    });

    return {
      user: {
        ...user,
      },
      token: jwt,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  public async userSignUp(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<Record<string, any>> {
    const newUser: Omit<UserLogIn, 'passwordHash'> =
      await this._authService.userSignUp(userSignUpDto);
    const jwt: string = await this._authService.jwtSignAsync({
      sub: newUser.id,
      username: newUser.username,
    });

    return {
      user: {
        ...newUser,
      },
      token: jwt,
    };
  }
}
