import { Controller, Post, Body } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMultiMenuDto } from './menu.dto';
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('weekly')
  async createWeekly(@Body() dto: CreateMultiMenuDto) {
    return this.menuService.createWeeklyMenus(dto);
  }
}
