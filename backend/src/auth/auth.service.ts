import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService,) {}

  // ユーザ認証
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      // bcrypt.compareで平文パスワードとハッシュ値を比較
      const isMatch = await bcrypt.compare(pass, user.password_hash);
      if (isMatch) {
        // パスワードが一致した場合、パスワードハッシュを除いたユーザー情報を返す
        const { password_hash, ...result } = user;
        return result;
      }
    }
    // ユーザが見つからなかったら
    return null;
  }

  // ログインしてJWTトークンを返す
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}