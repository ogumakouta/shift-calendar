import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, ValidationPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './dto/event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/create')
  create(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) eventDto: EventDto) {
    return this.eventService.create(eventDto);
  }

  @Get('/getEvents/:userId')
  getLabels(@Param('userId', ParseIntPipe) userId: number) {
    return this.eventService.getEvents(userId);
  }

  @Delete('/deleteEvent/:userId/:id')
  deleteEvent(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.eventService.deleteEvent(userId, id);
  }
}
