import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Max,
    MaxLength,
    MinLength,
    IsDate
} from 'class-validator';

export class AuthDto {
    @IsString()
    @MaxLength(20)
    user_id: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    email: string;

    @IsDate()
    brithday: Date;

    @MinLength(8)
    password: string;
}