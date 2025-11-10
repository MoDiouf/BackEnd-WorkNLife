import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerProfile, PartnerPortalTemplate } from './partner.entity';
import { IdentityVerification, User } from 'src/users/users.entity';
import * as bcrypt from 'bcrypt';
import { Menu } from './menu/menu.entity';
import { UpdatePartnerSettingsDto } from './partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(PartnerProfile)
    private partnerRepo: Repository<PartnerProfile>,

    @InjectRepository(PartnerPortalTemplate)
    private templateRepo: Repository<PartnerPortalTemplate>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(IdentityVerification)
    private verificationRepo: Repository<IdentityVerification>,

    
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
    admin_key?: string;
  }) {
    const ADMIN_SECRET = process.env.ADMIN_CREATION_KEY || 'MHD-SECRET-KEY';
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Email déjà utilisé');
    }

    if (dto.partner_type === 'admin') {
      if (dto.admin_key !== '@dminWorkNL1fe!23') {
        throw new ForbiddenException(
          'Clé admin invalide ❌. Vous ne pouvez pas créer un administrateur via cette fonction.',
        );
      } else {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const admin = this.usersRepo.create({
          email: dto.email,
          password: hashedPassword,
          full_name: dto.full_name,
          phone: dto.phone || undefined,
          role: 'standard', // rôle interne pour partenaire = standard
          active_role: 'standard',
          is_verified: false, // partenaire est toujours vérifié
        });
        await this.usersRepo.save(admin);
        const template = await this.templateRepo.findOne({
          where: { partner_type: dto.partner_type },
        });

        
        // Crée le profile partenaire
        const partnerProfile = this.partnerRepo.create({
          user: admin, // associe le User
          partner_name: dto.partner_name,
          partner_type: template || undefined,
          address: dto.address,
          description: dto.description,
          logo_url: dto.logo_url,
        });
        await this.partnerRepo.save(partnerProfile);

        return {
          message: 'Administrateur créé avec succès ✅',
          partnerProfile
        };
      }
    }

    // Crée le user
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email: dto.email,
      password: hashedPassword,
      full_name: dto.full_name,
      phone: dto.phone || undefined,
      role: 'standard', // rôle interne pour partenaire = standard
      active_role: 'standard',
      is_verified: false, // partenaire est toujours vérifié
    });
    await this.usersRepo.save(user);

    // Récupère le template
    const template = await this.templateRepo.findOne({
      where: { partner_type: dto.partner_type },
    });
    console.log(template);

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

    return {
      message: 'Partenaire créé avec succès ✅',
      user,
      partnerProfile,
    };
  }

  async getAllUsers(id_partner: number) {
  // 🔹 Étape 1 : Récupère le partenaire et son type
  const partner = await this.partnerRepo.findOne({
    where: { id_partner },
    relations: ['partner_type'], // jointure avec PartnerPortalTemplate
  });

  if (!partner) {
    throw new NotFoundException(`Partenaire avec l'id ${id_partner} introuvable ❌`);
  }

  // 🔹 Étape 2 : Vérifie s'il est de type admin
  if (partner.partner_type.partner_type !== 'admin') {
    throw new ForbiddenException("Accès refusé ❌ — réservé aux administrateurs.");
  }

  // 🔹 Étape 3 : Si c'est un admin, renvoie tous les utilisateurs
  const users = await this.usersRepo.find({
    relations: ['partnerProfiles'], // si tu veux inclure les partenaires liés
    order: { id_user: 'DESC' },
  });

  return {
    message: `✅ Accès autorisé — ${users.length} utilisateur(s) trouvé(s)`,
    users,
  };
}
  async getDriverVerificationRequests(id_partner: number) {
  // 🔹 Vérifier que l'utilisateur est admin
  const partner = await this.partnerRepo.findOne({
    where: { id_partner },
    relations: ['partner_type'], // jointure avec PartnerPortalTemplate
  });

  if (!partner || partner.partner_type.partner_type !== 'admin') {
    throw new ForbiddenException("Accès refusé ❌ — réservé aux administrateurs.");
  }

  // 🔹 Récupérer les demandes de vérification driver
  const requests = await this.verificationRepo.find({
    where: { role: 'driver', status: 'en_attente' },
    relations: ['user'],
    order: { id_verif: 'DESC' },
  });

  return {
    message: `✅ ${requests.length} demande(s) de vérification en attente pour les drivers`,
    requests,
  };
}

  async updateDriverVerificationStatus(id_partner: number, id_verif: number, action: 'accept' | 'reject') {
  // 🔹 Vérifier que l'utilisateur est admin
  const partner = await this.partnerRepo.findOne({
    where: { id_partner },
    relations: ['partner_type'], // jointure avec PartnerPortalTemplate
  });
  if (!partner || partner.partner_type.partner_type !== 'admin') {
    throw new ForbiddenException("Accès refusé ❌ — réservé aux administrateurs.");
  }

  // 🔹 Récupérer la demande de vérification
  const request = await this.verificationRepo.findOne({
    where: { id_verif },
    relations: ['user'],
  });

  if (!request) {
    throw new NotFoundException(`Demande de vérification avec id ${id_verif} introuvable ❌`);
  }

  if (request.role !== 'driver') {
    throw new BadRequestException("Cette demande n'est pas pour devenir driver");
  }

  // 🔹 Mettre à jour le status
  if (action === 'accept') {
    request.status = 'valide';
  } else if (action === 'reject') {
    request.status = 'rejete';
  } else {
    throw new BadRequestException("Action invalide. Utilisez 'accept' ou 'reject'");
  }

  request.verified_at = new Date();

  await this.verificationRepo.save(request);

  return {
    message: `✅ Demande de vérification ${action === 'accept' ? 'acceptée' : 'rejetée'} avec succès`,
    request,
  };
}

  async updatePartnerSettings(partner_id: number, settings: UpdatePartnerSettingsDto) {
  const partner = await this.partnerRepo.findOne({
    where: { id_partner: partner_id },
    relations: ['user'],
  });
  if (!partner) {
    throw new NotFoundException(`Partenaire avec l'id ${partner_id} introuvable ❌`);
  }

  // Mise à jour des champs partenaire
  if (settings.service !== undefined) partner.service = settings.service;
  if (settings.name_partner !== undefined) partner.partner_name = settings.name_partner;

  // Mise à jour des champs user
  if (partner.user) {
    if (settings.numero !== undefined) partner.user.phone = settings.numero;
    if (settings.email !== undefined) partner.user.email = settings.email;
    await this.usersRepo.save(partner.user);
  }

  await this.partnerRepo.save(partner);

  return {
    message: 'Paramètres du partenaire mis à jour avec succès ✅',
    partner,
  };
}

}