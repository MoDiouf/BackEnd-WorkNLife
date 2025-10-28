import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerController } from './partner.controller';


import { IdentityVerification, User } from 'src/users/users.entity';
import { PartnerPortalTemplate, PartnerProfile } from './partner.entity';
import { PartnersService } from './partner.service';
import { MenuController } from './menu/menu.controller';
import { MenuModule } from './menu/menu.module';
import { CommandesModule } from './commandes/commandes.module';
import { Menu } from './menu/menu.entity';
import { LoisirController } from './loisir/loisir.controller';
import { LoisirModule } from './loisir/loisir.module';
import { HealtyController } from './healty/healty.controller';
import { HealtyModule } from './healty/healty.module';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerProfile, PartnerPortalTemplate, User, IdentityVerification]), MenuModule, CommandesModule, LoisirModule, HealtyModule],
  controllers: [PartnerController, MenuController, LoisirController, HealtyController],
  providers: [PartnersService],
  exports: [PartnersService, TypeOrmModule],
})
export class PartnerModule {}
