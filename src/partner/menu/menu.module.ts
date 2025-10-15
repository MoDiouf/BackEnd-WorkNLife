import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu } from './menu.entity';
import { PartnerProfile } from '../partner.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Menu, PartnerProfile])],
  controllers: [MenuController],
  providers: [MenuService],
  exports:[MenuService]
})
export class MenuModule {}
