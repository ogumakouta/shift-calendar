import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/authDto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    // ユーザ取得
    async getUser(data: AuthDto): Promise<User | null> {
        return await this.prisma.user.findUnique ({
            where: {email: data.email},
        });
    }
    //新規登録
    async createSecureServer(data: AuthDto): Promise<User> {
        const { user_id, name, email, birthday, password } = data;
        const hashPassword = await bcrypt.hash(password, 12);
        return await this.prisma.user.create ({
            data: { user_id, name, email, birthday, password_hash: hashPassword },
        });
    }
}
