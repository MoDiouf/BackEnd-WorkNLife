import { IsDateString, IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

// partner.dto.ts
export class CreatePartnerDto {
  email: string;           // email du partenaire
  password: string;        // mot de passe
  full_name: string;       // nom complet
  phone?: string;          // téléphone
  partner_name: string;    // nom du partenaire
  partner_type: 'restaurant' | 'loisir' | 'healthy' | 'admin';
  address?: string;
  description?: string;
  logo_url?: string;
  @IsString()
  @IsNotEmpty()
  admin_key: string;
}
export class UpdatePartnerSettingsDto {
  service: string;
  name_partner?: string;
  numero?: string;
  email?: string;
}

