import { Controller, Post, Body, Get, Query, Req, UseGuards, Put } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CreateCommandeDto, UpdateCommandeStatusDto } from './commandes.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('commandes')
export class CommandesController {
  constructor(private readonly commandesService: CommandesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateCommandeDto,@Req() req) {
    const user_id = req.user.sub;
    return this.commandesService.createCommande({ ...dto, user_id });
  }
  @UseGuards(JwtAuthGuard)
  @Get('partner')
  async getByPartner(@Req() req) {
    return this.commandesService.getCommandesByPartner(req.user.partner_id);
  }

@UseGuards(JwtAuthGuard)
@Post('update')
async updateCommandeStatus(
  @Body() dto: UpdateCommandeStatusDto,
  @Body('id_commande') id_commande: number,
  @Req() req
) {
  const partner_id = req.user.partner_id ?? req.user.sub;
  return this.commandesService.updateCommandeStatus(
    id_commande,
    dto.status as 'en_attente' | 'en_cours' | 'en_cours_livraison' | 'livre' | 'annule',
    partner_id,
  );
}


}
