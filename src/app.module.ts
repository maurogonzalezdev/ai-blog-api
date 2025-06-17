import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AppController } from '@api/app.controller';
import { AppService } from '@api/app.service';
import { UsersModule } from '@api/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
