import { IsNotEmpty, IsString } from 'class-validator';

export interface CreateItem {
  title: string;
  body: string;
  deletePassword: string;
}

export class CreateItemDto implements CreateItem {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsString()
  deletePassword: string;
}
