import { Body, Controller, Delete, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LoisirService } from './loisir.service';
import { CreateLoisirActivityDto, DeleteLoisirActivityDto, UpdateLoisirActivityDto } from './loisir.dto';
import { LoisirActivity } from './loisir.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('loisir')
export class LoisirController {
    constructor(private readonly loisirService: LoisirService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
  async addActivities(@Req() req,@Body() activities: CreateLoisirActivityDto[]): Promise<LoisirActivity[]> {
    const partnerId = req.user.partner_id; // Récupérer l'ID du partenaire à partir du token JWT
    return await this.loisirService.addActivitiesToPartner(partnerId, activities);
  }

  // 🔹 Mettre à jour une activité
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateActivity(@Req() req, @Body() dto: UpdateLoisirActivityDto): Promise<LoisirActivity> {
    const partnerId = req.user.partner_id;
    return this.loisirService.updateActivity(partnerId, dto);
  }

  // 🔹 Supprimer une ou plusieurs activités
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteActivities(@Req() req, @Body() dto: DeleteLoisirActivityDto): Promise<{ deleted: number }> {
    const partnerId = req.user.partner_id;
    return this.loisirService.deleteActivities(partnerId, dto.ids);
  }
}
