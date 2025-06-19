import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLogInDto {
  @ApiProperty({
    description: 'User email',
    type: 'string',
    example: 'mail@chile.cl',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    minLength: 8,
    type: 'string',
    example: 'Abc@._123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
