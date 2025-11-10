// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerProfile } from 'src/partner/partner.entity';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(PartnerProfile)
    private readonly partnerRepo: Repository<PartnerProfile>,
  ) {}

  // 🔑 Validation utilisateur classique
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    return user;
  }

  // 🧾 Connexion standard (mobile, etc.)
  async login(user: any) {
    const payload = { email: user.email, sub: user.id_user, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 🧾 Connexion pour le portail partenaire
  async loginPartner(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Compte partenaire introuvable.');
    }
    
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Mot de passe incorrect.');
    }

    const partner = await this.partnerRepo.findOne({
      where: { user: { id_user: user.id_user } },
      relations: ['partner_type'],
    });

    if (!partner) {
      throw new UnauthorizedException("Ce compte n'est lié à aucun profil partenaire.");
    }

    const payload = {
      sub: user.id_user,
      email: user.email,
      role: 'partner',
      partner_id: partner.id_partner,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id_user: user.id_user,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
      partner: {
        id_partner: partner.id_partner,
        partner_name: partner.partner_name,
        partner_type: partner.partner_type.partner_type,
        logo_url: partner.logo_url,
        address: partner.address,
        description: partner.description,
        service: partner.service,
      },
    };
  }
}
