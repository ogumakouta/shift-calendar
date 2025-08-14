import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { WorkplaceService } from './workplace.service';
import { CreateWorkplaceDto } from './dto/create_workplace.dto';
import { UpdateWorkplaceDto } from './dto/update_workplace.dto';

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

  // バイト先の時給取得
  @Get('getWorkplaceWage/:workplaceId')
  getWorkplaceWage(@Param('workplaceId', ParseIntPipe) workplaceId: number) {
    return this.workplaceService.getWorkplaceWage(workplaceId);
  }

  // バイト先の更新
  @Put('/updateWorkplace/:userId/:workplaceId')
  updateWorkplace(@Param('userId', ParseIntPipe) userId: number, @Param('workplaceId', ParseIntPipe) workplaceId: number, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateWorkplaceDto: UpdateWorkplaceDto) {
    return this.workplaceService.updateWorkplace(updateWorkplaceDto, userId, workplaceId);
  }
}
