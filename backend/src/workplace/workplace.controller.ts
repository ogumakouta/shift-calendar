import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
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
}
