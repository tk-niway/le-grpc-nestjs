import { Body, Controller, Post } from '@nestjs/common';
import { CreateItemDto } from './items.dto';

@Controller('items')
export class ItemsController {
  @Post()
  createItem(@Body() createItemDto: CreateItemDto): boolean {
    console.log({createItemDto});
    return true;
  }
}
