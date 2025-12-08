import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { User } from 'src/users/users.entity';
import { CarpoolStatus } from './carpool.entity';

export class CreateCarpoolDto {
  @IsString()
  start_point: string;

  @IsString()
  end_point: string;

  // ✅ Retirez Column() - ce n'est pas pour les DTOs
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  key_points?: string[];

  // ✅ Le frontend envoie une string ISO
  @IsDateString()
  departure_time: string; // String reçue du frontend

  @IsNumber()
  available_seats: number;

  @IsNumber()
  price_per_seat: number;

  @IsEnum(CarpoolStatus)
  @IsOptional()
  status?: CarpoolStatus; // Optionnel, car valeur par défaut
}
export enum CarpoolStatuss {
  en_attente = 'en_attente',
  accepte = 'accepte',
  refuse = 'refuse',
}
export class UpdateCarpoolStatusDto {
  @IsEnum(CarpoolStatuss)
  status: CarpoolStatuss;

  @IsNumber()
  request_id: number;
}