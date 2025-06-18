import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { AuthService } from '@api/auth/auth.service';
import { UserLoginDto, UserSignupDto } from '@api/auth/dto';
import { UserLogin } from '@api/auth/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() userLoginDto: UserLoginDto) {
    const user: Omit<UserLogin, 'passwordHash'> =
      await this._authService.userLogin(userLoginDto);

    console.log(user);
  }

  @Post('signup')
  public async signup(@Body() userSignupDto: UserSignupDto) {}
}
