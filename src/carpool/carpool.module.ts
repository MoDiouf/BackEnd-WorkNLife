import { Module } from '@nestjs/common';
import { CarpoolService } from './carpool.service';
import { Type } from 'class-transformer';
import { Carpool, RideRequest } from './carpool.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarpoolController } from './carpool.controller';
import { IdentityVerification, User } from 'src/users/users.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CarpoolGateway } from './carpool.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Carpool, IdentityVerification, User, RideRequest])],
  controllers: [CarpoolController],
  providers: [CarpoolService,FirebaseService, CarpoolGateway],
  exports: [CarpoolService],
})
export class CarpoolModule {}
