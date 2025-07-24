import {
    IsString,
    IsEmail,
    IsNotEmpty,
    MinLength,
    IsOptional,
    IsDateString,
    } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'パスワードは8文字以上で入力してください' })
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    tel?: string;

    @IsDateString()
    @IsOptional()
    birthday?: string;
}