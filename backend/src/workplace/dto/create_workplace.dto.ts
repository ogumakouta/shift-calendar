import { IsNotEmpty, IsInt, IsString, IsEnum, IsOptional } from "class-validator";

export enum Payment_month {
  crrent = 'current',
  next = 'next', 
  after_next = 'after_next',
}

export class CreateWorkplaceDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsInt()
  @IsNotEmpty()
  closing_day: number;

  @IsEnum(Payment_month)
  payment_month: Payment_month;

  @IsInt()
  @IsNotEmpty()
  payment_day: number;
  
  @IsInt()
  @IsNotEmpty()
  hourly_wage: number;
}