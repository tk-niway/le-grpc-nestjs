import { IsIn, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class HeroUnaryCallDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsIn([1, 2])
  id: number;
}
