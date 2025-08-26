import { Controller, Post, Body, ValidationPipe, Put, ParseIntPipe, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create_user.dto';
import { GetUserDto } from './dto/get_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  // ユーザー新規登録
  @Post('/create')
  create(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // ユーザ情報を取得
  @Post('/getUser')
  getUser(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) getUserDto: GetUserDto) {
    return this.usersService.getUser(getUserDto);
  }

  @Put('/updateUser/:userId')
  updateUser(@Param('userId', ParseIntPipe) userId: number, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto, userId);
  }
}