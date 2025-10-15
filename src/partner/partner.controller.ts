import { Controller, Post, Get, Body, Query } from '@nestjs/common';

import { CreatePartnerDto } from './partner.dto';
import { PartnersService } from './partner.service';

@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnersService) {}

  @Post()
  async createPartner(@Body() dto: CreatePartnerDto) {
    return this.partnerService.createPartner(dto);
  }
}
