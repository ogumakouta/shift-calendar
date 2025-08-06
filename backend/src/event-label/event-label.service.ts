import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
