import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { WorkplaceService } from './workplace.service';
import { CreateWorkplaceDto } from './dto/create_workplace.dto';
import { UpdateWorkplaceDto } from './dto/update_workplace.dto';

@Controller('workplace')
export class WorkplaceController {
  constructor(private readonly workplaceService: WorkplaceService) {}

  // 勤務先作成
  @Post('create')
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createWorkplaceDto: CreateWorkplaceDto,
  ) {
    return this.workplaceService.create(createWorkplaceDto);
  }

  // 勤務先取得
  @Get('getWorkplace/:userId')
  getLabels(@Param('userId', ParseIntPipe) userId: number) {
    return this.workplaceService.getWorkplaces(userId);
  }

  // 勤務先の時給取得
  @Get('getWorkplaceWage/:workplaceId')
  getWorkplaceWage(@Param('workplaceId', ParseIntPipe) workplaceId: number) {
    return this.workplaceService.getWorkplaceWage(workplaceId);
  }

  // 勤務先の更新
  @Put('/updateWorkplace/:userId/:workplaceId')
  updateWorkplace(@Param('userId', ParseIntPipe) userId: number, @Param('workplaceId', ParseIntPipe) workplaceId: number, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateWorkplaceDto: UpdateWorkplaceDto) {
    return this.workplaceService.updateWorkplace(updateWorkplaceDto, userId, workplaceId);
  }

  // 勤務先の削除
  @Delete('/deleteWorkplace/:userId/:workplace_id')
  deleteWorkplace(@Param('userId', ParseIntPipe) userId: number, @Param('workplace_id', ParseIntPipe) workplace_id: number) {
    return this.workplaceService.deleteWorkplace(userId, workplace_id);
  }
}
