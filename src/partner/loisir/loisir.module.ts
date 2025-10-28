import { LoisirController } from './loisir.controller';
import { Module } from '@nestjs/common';
import { LoisirService } from './loisir.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoisirActivity } from './loisir.entity';
import { PartnerProfile } from '../partner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoisirActivity, PartnerProfile])],
  controllers: [LoisirController],
  providers: [LoisirService],
  exports: [LoisirService],
})
export class LoisirModule {}
