import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserController],
  // providersにUserServiceとPrismaServiceを登録
  providers: [UserService, PrismaService],
})
export class UserModule {}