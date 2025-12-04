import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CarpoolService } from './carpool.service';
import { CreateCarpoolDto, UpdateCarpoolStatusDto } from './carpool.dto';

@UseGuards(JwtAuthGuard)
@Controller('carpools')
export class CarpoolController {
  constructor(private readonly carpoolService: CarpoolService) {}

 @Post()
async createCarpool(@Body() dto: CreateCarpoolDto, @Req() req) {
  const driver_id = req.user.sub;

  return this.carpoolService.createCarpool({ ...dto, driver_id });
}

@Get('check-permission')
async isValide(@Req() req){
  const driver_id = req.user.sub;
  const verification = await this.carpoolService.isDriverVerified(driver_id);
  return { allowed: verification };
}

  // ✅ Récupérer tous les trajets disponibles
  @Get()
  async getAvailableCarpools() {
    return this.carpoolService.findAvailableCarpools();
  }

  // ✅ Mettre à jour le statut (par le conducteur)
  @Post('status')
  async updateStatus(
    @Body() dto: UpdateCarpoolStatusDto,
    @Req() req,
  ) {
    const driver_id = req.user.sub;
    return this.carpoolService.updateStatus( dto.status, driver_id);
  }

  @Post('demande')
  async createRideRequest(@Body() body, @Req() req) {
    const user_id = req.user.sub;
    return this.carpoolService.createRideRequest(body.carpool_id, user_id);
  }
  // ✅ Supprimer un trajet (optionnel)
  @Delete('id')
  async deleteCarpool(@Body() id: number, @Req() req) {
    const driver_id = req.user.sub;
    return this.carpoolService.deleteCarpool(id, driver_id);
  }
}
