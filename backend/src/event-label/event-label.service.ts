import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLabelDto } from './dto/update_label.dto';
import { CreateLabelDto } from './dto/create_label.dto';

@Injectable()
export class EventLavelService {
  constructor(private prisma: PrismaService) {}

  // 予定のラベルの取得
  async getLabels(user_id: number) {
    try {
      return this.prisma.eventLabel.findMany({
        where: {
          OR: [
            { user_id: user_id },
            { common: true },
          ],
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`ユーザID：${user_id}の予定ラベルが見つかりません`);
      }
      throw error;
    }
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
        throw new NotFoundException(`ラベルID：${labelId}の種類は見つかりません`);
      }
      throw error;
    }
  }

  // 予定ラベルの削除
  async deleteEventLabel(user_id: number, label_id: number) {
    try {
      return this.prisma.eventLabel.delete({
        where: {
          id: label_id,
          user_id: user_id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`ID：${label_id}の予定ラベルが見つかりません`);
      }
      throw error;
    }
  }

  // 予定ラベルの追加
  async createLabel(createLabelDto: CreateLabelDto, ) {
    const {
      name,
      user_id,
    } = createLabelDto;

    try {
      const eventLabel = await this.prisma.eventLabel.create({
        data: {
          name,
          user_id,
        },
        select: {
          id: true,
          name: true,
          user_id: true,
          common: true,
        },
      });

      return eventLabel;
    } catch {
      throw new InternalServerErrorException('予定の種類の登録に失敗しました');
    }
  }
}
