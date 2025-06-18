import { Module } from '@nestjs/common';

import { AuthService } from '@api/auth/auth.service';
import { AuthController } from '@api/auth/auth.controller';
import { PrismaModule } from '@api/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
