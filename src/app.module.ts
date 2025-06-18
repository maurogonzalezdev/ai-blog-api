import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AppController } from '@api/app.controller';
import { AppService } from '@api/app.service';
import { AuthModule } from '@api/auth/auth.module';
import { PrismaModule } from '@api/prisma/prisma.module';
import { UsersModule } from '@api/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
