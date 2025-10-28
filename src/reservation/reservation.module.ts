import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { PartnerPortalTemplate, PartnerProfile } from 'src/partner/partner.entity';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, PartnerProfile, User, PartnerPortalTemplate])],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
