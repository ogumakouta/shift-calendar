import { IsNotEmpty, IsInt, IsString, IsOptional } from "class-validator";

export class UpdateWorkplaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsInt()
  @IsNotEmpty()
  closing_day: number;

  @IsInt()
  @IsNotEmpty()
  payment_day: number;
  
  @IsInt()
  @IsNotEmpty()
  hourly_wage: number;
}