import { Controller, ParseIntPipe, Get, Param } from '@nestjs/common';
import { EventLavelService } from './event-lavel.service';

@Controller('event-lavel')
export class EventLavelController {
  constructor(private readonly eventLavelService: EventLavelService) {}

  @Get('/getLabels/:userId')
  getLabels (
    @Param('userId', ParseIntPipe) userId: number
  ) {
    return this.eventLavelService.getLabels(userId)
  }
}
