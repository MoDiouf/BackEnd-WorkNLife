import { Module } from '@nestjs/common';
import { HealtyService } from './healty.service';

@Module({
  providers: [HealtyService]
})
export class HealtyModule {}
