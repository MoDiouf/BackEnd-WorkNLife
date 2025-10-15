// ride/ride.controller.ts
import { Controller, Get, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('rides')
export class RideController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('create')
  async createRide(@Req() req) {
    const user = await this.usersService.findById(req.user.sub);

    if (!user) {
      throw new ForbiddenException('Utilisateur introuvable.');
    }

    if (user.active_role !== 'driver') {
      throw new ForbiddenException('Tu dois être en mode conducteur pour créer un covoiturage.');
    }

    return { message: 'OK, tu peux créer un covoiturage.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async listRides(@Req() req) {
    const user = await this.usersService.findById(req.user.sub);

    if (!user) {
      throw new ForbiddenException('Utilisateur introuvable.');
    }

    if (user.active_role !== 'standard') {
      throw new ForbiddenException('Seuls les utilisateurs standard peuvent voir la liste.');
    }

    return { message: 'Liste des trajets accessibles aux passagers.' };
  }
}
