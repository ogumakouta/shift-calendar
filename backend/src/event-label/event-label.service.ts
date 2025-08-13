import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLabelDto } from './dto/update_label.dto';

@Injectable()
export class EventLavelService {
  constructor(private prisma: PrismaService) {}

  // 予定のラベルの取得
  async getLabels(user_id: number) {
    return this.prisma.eventLabel.findMany({
      where: {
        OR: [
          { user_id: user_id },
          { common: true },
        ],
      },
    });
  }

  // 予定のラベルの更新
  async updateLabel(updateLabelDto: UpdateLabelDto, userId: number, labelId: number) {
    try {
      return this.prisma.eventLabel.update({
        where: {
          id: labelId,
          user_id: userId,
        },
        data: updateLabelDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`ID：${labelId}の種類は見つかりません`);
      }
      throw error;
    }
  }

  // 予定ラベルの削除
  async deleteEventLabel(user_id: number, label_id: number) {
    return this.prisma.eventLabel.delete({
      where: {
        id: label_id,
        user_id: user_id,
      },
    });
  }
}
