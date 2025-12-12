import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CarpoolService } from './carpool.service';
import {  CreateCarpoolDto, UpdateCarpoolStatusDto } from './carpool.dto';
import { log } from 'console';
import { CarpoolStatus } from './carpool.entity';

@UseGuards(JwtAuthGuard)
@Controller('carpools')
export class CarpoolController {
  constructor(private readonly carpoolService: CarpoolService) {}

 @Post()
async createCarpool(@Body() dto: CreateCarpoolDto, @Req() req) {
  const driver_id = req.user.sub;
  //console.log("Called")
  return this.carpoolService.createCarpool({
    driver_id,
    start_point: dto.start_point,
    end_point: dto.end_point,
    departure_time: dto.departure_time, // ✅ String, pas Date
    available_seats: dto.available_seats,
    price_per_seat: dto.price_per_seat,
    key_points: dto.key_points || [], // ✅ Tableau vide par défaut
    status: dto.status,
  });
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
    console.log("Mise à jour du statut par le conducteur ID:", driver_id);
    return this.carpoolService.updateStatus( dto, driver_id);
  }
@Get('requests')
getDriverRequests(@Req() req) {
  return this.carpoolService.getPendingRequestsForDriver(req.user.sub);
}

  @Post('demande')
  async createRideRequest(@Body() body, @Req() req) {
    const user_id = req.user.sub;
    return this.carpoolService.createRideRequest(body.idCarpool,body.pickup_point, user_id);
  }
  // ✅ Supprimer un trajet (optionnel)
  @Delete(':id')
async deleteCarpool(@Param('id') id: string, @Req() req) {

  const driver_id = req.user.sub;
  return this.carpoolService.deleteCarpool(+id, driver_id);
}
@Patch('status')
  async updateStatusCarpool(
    @Body() body: { id_carpool: number; status: CarpoolStatus },
    @Req() req
  ) {
    const driver_id = req.user.sub; // l'utilisateur connecté
    return this.carpoolService.updateCarpoolStatus(
      body.id_carpool,
      driver_id,
      body.status
    );
  }

}
