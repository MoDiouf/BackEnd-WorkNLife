// auth.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  // 🔐 Connexion portail partenaire
  @Post('login-partner')
  async loginPartner(@Body() loginDto: LoginDto) {
    return this.authService.loginPartner(loginDto.email, loginDto.password);
  }
}
