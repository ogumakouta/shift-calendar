import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventDto } from './dto/event.dto';
@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  // 予定作成
  async create(eventDto: EventDto) {
    const {
      user_id,
      event_label_id,
      title,
      workplace_id,
      is_allday,
      start_time,
      finish_time,
      break_minutes,
      location,
      memo,
    } = eventDto;

    try {
      const event = await this.prisma.event.create({
        data: {
          user_id,
          event_label_id,
          title,
          workplace_id: workplace_id ? Number(workplace_id) : null,
          is_allday,
          start_time,
          finish_time,
          break_minutes: break_minutes ? Number(break_minutes) : null,
          location: location ? String(location) : null,
          memo: memo ? String(memo) : null,
        },
        select: {
          user_id: true,
          event_label_id: true,
          title: true,
          workplace_id: true,
          is_allday: true,
          start_time: true,
          finish_time: true,
          break_minutes: true,
          location: true,
          memo: true,
        },
      });

      return event;
    } catch {
      throw new InternalServerErrorException('予定の登録に失敗しました');
    }
  }

  // ユーザIDごとの予定の取得
  async getEvents(user_id: number) {
    try {
      return this.prisma.event.findMany({
        where: {
          user_id: user_id
        },
        select: {
          id: true,
          // event_label_id: true,
          title: true,
          is_allday: true,
          start_time: true,
          finish_time: true,
          break_minutes: true,
          location: true,
          memo: true,
          workplace: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`ユーザID：${user_id}の予定が見つかりません`);
      }
      throw error;
    }
  }

  // 予定を削除
  async deleteEvent(user_id: number, id: number) {
    try {
      return this.prisma.event.delete({
        where: {
          id: id,
          user_id: user_id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`予定ID：${id}の予定が見つかりません`);
      }
      throw error;
    }
  }
}
