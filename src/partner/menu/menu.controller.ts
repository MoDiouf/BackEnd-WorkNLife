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
  Delete,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMultiMenuDto, UpdateMenuDto } from './menu.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(JwtAuthGuard)
  @Post('weekly')
  async createWeekly(@Body() dto: CreateMultiMenuDto,@Req() req) {
    const partner_id = req.user.partner_id; // Récupérer l'ID du partenaire à partir du token JWT
    dto.partner_id = partner_id;
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMenu(@Param('id') id: number, @Req() req) {
    const partner_id = req.user.partner_id;
    if (!partner_id) throw new BadRequestException('partner_id requis');

    return this.menuService.deleteMenu(partner_id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('allmenus')
  async getAllMenus(@Req() req) {
    const partner_id = req.user.sub;
    if (!partner_id) throw new BadRequestException('partner_id requis');
    return this.menuService.getAllMenus();
  }
}
