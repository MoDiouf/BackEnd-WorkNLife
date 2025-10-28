import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './reservation.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';


@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReservation(@Body() dto: CreateReservationDto,@Req() req) {
    dto.user_id = req.user.sub;
    return this.reservationService.createReservation(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('forpartner')
  async getPartnerReservations(@Req() req) {
    const partner_id = req.user.partner_id;
    return this.reservationService.getPartnerReservations(partner_id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: 'en_attente' | 'confirme' | 'annule',
  ) {
    return this.reservationService.updateReservationStatus(id, status);
  }
}
