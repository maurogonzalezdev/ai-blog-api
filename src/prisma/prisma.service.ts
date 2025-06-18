import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { exceptionHandler } from '@api/helpers';

import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error: unknown) {
      return exceptionHandler(error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error: unknown) {
      return exceptionHandler(error);
    }
  }
}
