import { Controller, Post, Get, Body, Query, UseGuards, Req } from '@nestjs/common';

import { CreatePartnerDto } from './partner.dto';
import { PartnersService } from './partner.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnersService) {}

  @Post('create')
  async createPartner(@Body() dto: CreatePartnerDto) {
    return this.partnerService.createPartner(dto);
  }

  // 🔐 Récupérer tous les utilisateurs endpoint ADMIN
  @UseGuards(JwtAuthGuard)
  @Get("allusers")
  async getAllUsers(@Req() req) {
    return this.partnerService.getAllUsers(req.user.partner_id);
  }

  // 🔐 Récupérer les demandes de vérification des drivers endpoint ADMIN
  @Get('driver-verification-requests')
@UseGuards(JwtAuthGuard)
  async getDriverVerificationRequests(@Req() req) {
    const adminUserId = req.user.partner_id; // récupère l'ID de l'utilisateur depuis le JWT
    return this.partnerService.getDriverVerificationRequests(adminUserId);
  }
  // 🔐 Gérer les demandes de vérification des drivers endpoint ADMIN
  @Post('driver-verification')
@UseGuards(JwtAuthGuard)
async handleDriverVerification(@Req() req,@Body() body: { id_verif: number; action: 'accept' | 'reject' }
) {
  const adminUserId = req.user.partner_id;
  return this.partnerService.updateDriverVerificationStatus(adminUserId, body.id_verif, body.action);
}

}
