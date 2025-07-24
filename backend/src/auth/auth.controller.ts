import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login_user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body(new ValidationPipe()) loginUserDto: LoginUserDto) {
    // パスワード照合
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      // 認証失敗
      throw new UnauthorizedException(
        'メールまたはパスワードが間違っています。',
      );
    }

    // 認証成功、JWTを生成
    return this.authService.login(user);
  }
}
