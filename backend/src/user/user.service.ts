import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create_user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // ユーザー新規登録
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, tel, birthday } = createUserDto;

    // パスワードをハッシュ化
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      // データベースにユーザーを作成
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password_hash: hashedPassword,
          birthday: birthday ? new Date(birthday) : null, // birthdayが指定されていればDateオブジェクトに変換
        },
        // レスポンスとして返す
        select: {
          id: true,
          name: true,
          email: true,
          birthday: true,
        },
      });

      return user;
    } catch (error) {
      // Prismaのエラーコードをチェック (P2002はユニーク制約違反)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
      ) {
        // emailが既に存在する場合
        throw new ConflictException('メールアドレスは既に使われてます');
      }
      // その他のデータベースエラー
      throw new InternalServerErrorException('登録に失敗しました');
    }
  }

  // ログイン
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
