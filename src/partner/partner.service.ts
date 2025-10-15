import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerProfile, PartnerPortalTemplate } from './partner.entity';
import { User } from 'src/users/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(PartnerProfile)
    private partnerRepo: Repository<PartnerProfile>,

    @InjectRepository(PartnerPortalTemplate)
    private templateRepo: Repository<PartnerPortalTemplate>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createPartner(dto: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    partner_name: string;
    partner_type: 'restaurant' | 'loisir' | 'healthy' | 'admin';
    address?: string;
    description?: string;
    logo_url?: string;
  }) {
    // Vérifie si email existe
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email déjà utilisé');
    }

    // Crée le user
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email: dto.email,
      password: hashedPassword,
      full_name: dto.full_name,
      phone: dto.phone || undefined,
      role: 'standard',       // rôle interne pour partenaire = standard
      active_role: 'standard',
      is_verified: true,      // partenaire est toujours vérifié
    });
    await this.usersRepo.save(user);

    // Récupère le template
    const template = await this.templateRepo.findOne({ where: { partner_type: dto.partner_type } });

    // Crée le profile partenaire
    const partnerProfile = this.partnerRepo.create({
      user, // associe le User
      partner_name: dto.partner_name,
      partner_type: template || undefined,
      address: dto.address,
      description: dto.description,
      logo_url: dto.logo_url,
    });
    await this.partnerRepo.save(partnerProfile);

    return { user, partnerProfile };
  }

  async getCommands() {
    return this.partnerRepo.find();
  }
}
