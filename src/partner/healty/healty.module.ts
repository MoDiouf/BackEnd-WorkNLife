import { Module } from '@nestjs/common';
import { HealtyService } from './healty.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthyActivity } from './healty.entity';
import { PartnerPortalTemplate, PartnerProfile } from '../partner.entity';
import { HealtyController } from './healty.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HealthyActivity,PartnerPortalTemplate,PartnerProfile])],
  providers: [HealtyService],
  controllers: [HealtyController],
  exports: [HealtyService],
})
export class HealtyModule {}
