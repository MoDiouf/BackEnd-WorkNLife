
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { HealtyService } from './healty.service';
import { CreateHealthyActivityDto, UpdateHealthyActivityDto, UpdateHealthyBoutikDto, UpdateHealthyShopPriceDto } from './healty.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { HealthyActivity } from './healty.entity';
import { PartnerProfile } from '../partner.entity';
import { log } from 'console';

@Controller('healthy')
export class HealtyController {
    constructor(private readonly healthyService: HealtyService) {}
    
    // healty.controller.ts
    @UseGuards(JwtAuthGuard)
    @Put('shop/:id/price')
    updateShopPrice(
      @Param('id') id: number,
      @Body() dto: UpdateHealthyShopPriceDto,
    ) {
      return this.healthyService.updateShopPrice(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('activity/:id')
    addActivity(
    @Param('id') partnerId: number,
    @Body() dto: CreateHealthyActivityDto,
  ) {
    return this.healthyService.addActivity(partnerId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateHealthyBoutik(
    @Req() req,
    @Body() dto: UpdateHealthyBoutikDto,
  ): Promise<PartnerProfile> {
    const partnerId = req.user.partner_id;
    return this.healthyService.updateHealthyBoutik(partnerId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('activities/:id')
  async getActivitiesByPartner(
    @Param('id') partnerId: number,
  ): Promise<HealthyActivity[]> {
    return this.healthyService.getActivitiesByPartner(partnerId);
  }
  @UseGuards(JwtAuthGuard)
  @Put('activities/update/:id')
  async updateActivity(
    @Param('id') activityId: number,
    @Body() dto: UpdateHealthyActivityDto,
    @Req() req,
  ): Promise<HealthyActivity> {
    const partnerId = req.user.partner_id;
    return this.healthyService.updateActivity(activityId, dto, partnerId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('activity/delete/:id')
  async deleteActivity(@Param('id') activityId: number, @Req() req): Promise<{ message: string }> {
    const partnerId = req.user.partner_id;
    return this.healthyService.deleteActivity(activityId, partnerId);
  }
  
}