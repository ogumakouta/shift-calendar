import {
  IsInt,
  IsString,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class EventDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  event_label_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsOptional()
  workplace_id?: number;

  @IsBoolean()
  @IsNotEmpty()
  is_allday: boolean;

  @IsDateString()
  @IsNotEmpty()
  start_time: string;

  @IsDateString()
  @IsNotEmpty()
  finish_time: string;

  @IsInt()
  @IsOptional()
  break_minutes?: number;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  memo: string;
}
