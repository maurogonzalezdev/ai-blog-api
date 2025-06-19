import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { ApiResponseDto } from '@api/shared/dto';
import { AuthResponse } from '@api/auth/interfaces';
import { AuthService } from '@api/auth/auth.service';
import { UserLogIn } from '@api/auth/types';
import { UserLogInDto, UserSignUpDto } from '@api/auth/dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in to an existing user account' })
  @ApiResponse({
    status: 200,
    type: ApiResponseDto<AuthResponse>,
    example: {
      success: true,
      statusCode: 200,
      message: 'User session successfully logged in',
      timestamp: '2025-06-19T21:19:18.689Z',
      data: {
        user: { id: 'abc123', username: 'user', role: 'USER', isActive: true },
      },
      token: 'jwtSample',
    },
  })
  @Post('log-in')
  public async userLogIn(
    @Body() userLogInDto: UserLogInDto,
  ): Promise<ApiResponseDto<AuthResponse>> {
    const user: Omit<UserLogIn, 'passwordHash'> =
      await this._authService.userLogIn(userLogInDto);
    const jwt: string = await this._authService.jwtSignAsync({
      sub: user.id,
      username: user.username,
    });

    return {
      success: true,
      statusCode: 200,
      message: 'User logged in successfully',
      timestamp: new Date().toISOString(),
      data: {
        user,
      },
      token: jwt,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a new user account' })
  @ApiResponse({
    status: 201,
    type: ApiResponseDto<AuthResponse>,
    example: {
      success: true,
      statusCode: 201,
      message: 'User session successfully logged in',
      timestamp: '2025-06-19T21:19:18.689Z',
      data: {
        user: { id: 'abc123', username: 'user', role: 'USER', isActive: true },
      },
      token: 'jwtSample',
    },
  })
  @Post('sign-up')
  public async userSignUp(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<ApiResponseDto<AuthResponse>> {
    const newUser: Omit<UserLogIn, 'passwordHash'> =
      await this._authService.userSignUp(userSignUpDto);
    const jwt: string = await this._authService.jwtSignAsync({
      sub: newUser.id,
      username: newUser.username,
    });

    return {
      success: true,
      statusCode: 201,
      message: 'User account created successfully',
      timestamp: new Date().toISOString(),
      data: {
        user: {
          ...newUser,
        },
      },
      token: jwt,
    };
  }
}
