import { Module } from '@nestjs/common';
import { CommandesController } from './commandes.controller';
import { CommandesService } from './commandes.service';
import { Menu } from '../menu/menu.entity';
import { Commande } from './commandes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Commande, Menu])],
  controllers: [CommandesController],
  providers: [CommandesService]
})
export class CommandesModule {}
