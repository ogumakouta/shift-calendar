import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create_user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  // ユーザー新規登録
  @Post('/create')
  create(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}