import { Module } from '@nestjs/common';
import { EventLavelService } from './event-label.service';
import { EventLavelController } from './event-label.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EventLavelController],
  providers: [EventLavelService, PrismaService],
})
export class EventLavelModule {}
