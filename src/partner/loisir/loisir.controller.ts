import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoisirService } from './loisir.service';
import {
  CreateLoisirActivityDto,
  DeleteLoisirActivityDto,
  LoisirDTO,
  UpdateLoisirActivityDto,
} from './loisir.dto';
import { LoisirActivity } from './loisir.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('loisir')
export class LoisirController {
  constructor(private readonly loisirService: LoisirService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addActivities(
    @Req() req,
    @Body() activities: CreateLoisirActivityDto[],
  ): Promise<LoisirActivity[]> {
    const partnerId = req.user.partner_id; // Récupérer l'ID du partenaire à partir du token JWT
    return await this.loisirService.addActivitiesToPartner(
      partnerId,
      activities,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getActivities(@Req() req): Promise<LoisirActivity[]> {
    const partnerId = req.user.partner_id;
    return await this.loisirService.getActivitiesByPartner(partnerId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-boutik')
  async updateBoutikActivities(
    @Req() req,
    @Body() loisir: LoisirDTO,
  ): Promise<any> {
    const partnerId = req.user.partner_id; // Récupérer l'ID du partenaire à partir du token JWT
    return await this.loisirService.updateBoutik(partnerId, loisir);
  }
  // 🔹 Mettre à jour une activité
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateActivity(
    @Req() req,
    @Body() dto: UpdateLoisirActivityDto,
  ): Promise<LoisirActivity> {
    const partnerId = req.user.partner_id;
    return this.loisirService.updateActivity(partnerId, dto);
  }
  
  // 🔹 Supprimer une ou plusieurs activités
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteActivity(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const partnerId = req.user.partner_id;
    return this.loisirService.deleteActivities(partnerId, id);
  }
}
