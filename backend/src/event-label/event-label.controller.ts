import { Controller, ParseIntPipe, Get, Param, Put, Body, ValidationPipe, Delete } from '@nestjs/common';
import { EventLavelService } from './event-label.service';
import { UpdateLabelDto } from './dto/update_label.dto';

@Controller('event-label')
export class EventLavelController {
  constructor(private readonly eventLavelService: EventLavelService) {}

  @Get('/getLabels/:userId')
  getLabels(@Param('userId', ParseIntPipe) userId: number) {
    return this.eventLavelService.getLabels(userId);
  }

  // 予定の種類を更新
  @Put('/updateLabel/:userId/:labelId')
  updateUser(@Param('userId', ParseIntPipe) userId: number, @Param('labelId', ParseIntPipe) labelId: number, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateLabelDto: UpdateLabelDto) {
    return this.eventLavelService.updateLabel(updateLabelDto, userId, labelId);
  }

  // 予定の種類を削除
  @Delete('/deleteEventLabel/:userId/:label_id')
  deleteEventLabel(@Param('userId', ParseIntPipe) userId: number, @Param('label_id', ParseIntPipe) label_id: number) {
    return this.eventLavelService.deleteEventLabel(userId, label_id);
  }
}
