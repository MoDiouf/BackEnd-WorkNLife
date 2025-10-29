
import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { HealtyService } from './healty.service';
import { CreateHealthyActivityDto, UpdateHealthyShopPriceDto } from './healty.dto';

@Controller('healthy')
export class HealtyController {
    constructor(private readonly healthyService: HealtyService) {}
    
    // healty.controller.ts
    @Put('shop/:id/price')
    updateShopPrice(
      @Param('id') id: number,
      @Body() dto: UpdateHealthyShopPriceDto,
    ) {
      return this.healthyService.updateShopPrice(id, dto);
    }

    @Post('shop/:id/activities')
    addActivity(
    @Param('id') partnerId: number,
    @Body() dto: CreateHealthyActivityDto,
  ) {
    return this.healthyService.addActivity(partnerId, dto);
  }
}