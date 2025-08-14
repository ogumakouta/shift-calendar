import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkplaceDto } from './dto/create_workplace.dto';
import { UpdateWorkplaceDto } from './dto/update_workplace.dto';

@Injectable()
export class WorkplaceService {
  constructor(private prisma: PrismaService) {}

  // バイト先作成
  async create(createWorkplaceDto: CreateWorkplaceDto) {
    const { user_id, name, location, closing_day, payment_day, hourly_wage } =
      createWorkplaceDto;

    try {
      const workplace = await this.prisma.workplace.create({
        data: {
          user_id,
          name,
          location: location ? String(location) : null,
          closing_day,
          payment_day,
          hourly_wage,
        },
        select: {
          user_id: true,
          name: true,
          location: true,
          closing_day: true,
          payment_day: true,
          hourly_wage: true,
        },
      });

      return workplace;
    } catch {
      throw new InternalServerErrorException('バイト先の登録に失敗しました');
    }
  }

  // バイト先取得
  async getWorkplaces(user_id: number) {
    return this.prisma.workplace.findMany({
      where: { user_id: user_id },
    });
  }

  // バイト先の時給取得
  async getWorkplaceWage(workplace_id: number) {
    return this.prisma.workplace.findFirst({
      where: {id: workplace_id},
      select: {
        id: true,
        name: true,
        hourly_wage: true,
      }
    });
  }

  // バイト先の更新
  async updateWorkplace(updateWorkplaceDto: UpdateWorkplaceDto, userId: number, workplaceId: number) {
    try {
      return this.prisma.workplace.update({
        where: {
          id: workplaceId,
          user_id: userId,
        },
        data: updateWorkplaceDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`ID：${workplaceId}の勤務先は見つかりません`);
      }
      throw error;
    }
  }
}
