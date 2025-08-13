import {
  IsInt,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
