import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // アプリ開始時にデータベースに接続します。
    await this.$connect();
  }

  async onModuleDestroy() {
    // アプリ終了時にデータベースから切断
    await this.$disconnect();
  }
}
