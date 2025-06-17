import { Module } from '@nestjs/common';

import { UsersService } from '@api/users/users.service';
import { UsersController } from '@api/users/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
