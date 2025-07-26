import { Body, Controller, Get, Param, ParseIntPipe, Post, ValidationPipe } from '@nestjs/common';
import { WorkplaceService } from './workplace.service';
import { CreateWorkplaceDto } from './dto/create_workplace.dto';

@Controller('workplace')
export class WorkplaceController {
  constructor(private readonly workplaceService: WorkplaceService) {}

  // バイト先作成
  @Post('create')
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createWorkplaceDto: CreateWorkplaceDto,
  ) {
    return this.workplaceService.create(createWorkplaceDto);
  }

  // バイト先取得
  @Get('getWorkplace/:userId')
  getLabels(@Param('userId', ParseIntPipe) userId: number) {
    return this.workplaceService.getWorkplaces(userId);
  }
}
