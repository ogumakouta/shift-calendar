import { Module } from '@nestjs/common';
import { EventLavelService } from './event-lavel.service';
import { EventLavelController } from './event-lavel.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EventLavelController],
  providers: [EventLavelService, PrismaService],
})
export class EventLavelModule {}
