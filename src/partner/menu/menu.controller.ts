import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  BadRequestException,
  Put,
  Param,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMultiMenuDto, UpdateMenuDto } from './menu.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(JwtAuthGuard)
  @Post('weekly')
  async createWeekly(@Body() dto: CreateMultiMenuDto) {
    return this.menuService.createWeeklyMenus(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('partner')
  async getMenusByPartner(@Req() req) {
    const partner_id = req.user.partner_id; // Récupérer l'ID du partenaire à partir du token JWT
    if (!partner_id) throw new BadRequestException('partner_id requis');
    return this.menuService.getMenusByPartner(partner_id);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateMenu(@Param('id') id: number, @Body() dto: UpdateMenuDto, @Req() req) {
    const partner_id = req.user.partner_id;
    if (!partner_id) throw new BadRequestException('partner_id requis');

    return this.menuService.updateMenu(partner_id, id, dto);
  }
}
