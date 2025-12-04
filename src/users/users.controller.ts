// users/users.controller.ts
import { Controller, Post, Body, UseGuards, Request, ForbiddenException, Get, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateDriverVerificationDto, CreateUserDto, DeleteUserDTO } from './users.dto';
import { User } from './users.entity';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
    @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log("Recu", createUserDto)
    return await this.usersService.createUser(createUserDto);
  }

  @Post('delete')
  async deleteUser(@Body() DeleteUserDTO : DeleteUserDTO){
    return await this.usersService.deleteUser(DeleteUserDTO)
  }

  @UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('file'))
@Post('request-driver')
async requestDriver(
  @Req() req,
  @Body() dto: CreateDriverVerificationDto,
  @UploadedFile() file: Express.Multer.File
) {
  console.log("Called")
  const userId = req.user.sub;

  if (!file) {
    throw new BadRequestException('Aucun fichier envoyé');
  }

  return this.usersService.requestDriverVerification(userId, dto, file);
}

  @UseGuards(JwtAuthGuard)
  @Post('switch-role')
  async switchRole(@Request() req, @Body('role') role: 'standard' | 'driver') {
    const user = await this.usersService.findById(req.user.sub);

    if (!user) throw new ForbiddenException('Utilisateur introuvable.');

    if (role === 'driver' && !user.is_verified) {
      throw new ForbiddenException("Tu ne peux pas devenir conducteur sans vérification.");
    }

    user.active_role = role;
    await this.usersService.save(user);

    return { message: `Ton rôle actif est maintenant ${role}` };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

}
