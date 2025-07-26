import { Controller, ParseIntPipe, Get, Param } from '@nestjs/common';
import { EventLavelService } from './event-label.service';

@Controller('event-label')
export class EventLavelController {
  constructor(private readonly eventLavelService: EventLavelService) {}

  @Get('/getLabels/:userId')
  getLabels(@Param('userId', ParseIntPipe) userId: number) {
    return this.eventLavelService.getLabels(userId);
  }
}
