import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './dto/event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/create')
  create(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) eventDto: EventDto) {
    return this.eventService.create(eventDto);
  }
}
