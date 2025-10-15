import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';

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

  
}
