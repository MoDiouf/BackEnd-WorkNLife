// create-loisir-activity.dto.ts
import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsArray, ArrayNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class CreateLoisirActivityDto {
  @IsNumber()
  partner_id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsEnum(['jeux_video', 'parc_attraction', 'cinema', 'bowling', 'escape_game', 'autre'])
  category: 'jeux_video' | 'parc_attraction' | 'cinema' | 'bowling' | 'escape_game' | 'autre';

  @IsOptional()
  @IsEnum(['tous_les_jours', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'])
  day?: string;

  @IsOptional()
  @IsString() // on peut valider un format HH:mm si nécessaire
  open_time?: string;

  @IsOptional()
  @IsString()
  close_time?: string;
}
export class UpdateLoisirActivityDto extends PartialType(CreateLoisirActivityDto) {
  @IsNumber()
  id_activity: number; // on doit savoir quelle activité modifier
}
export class DeleteLoisirActivityDto {
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  ids: number; // pour supprimer une ou plusieurs activités par id
}
export class LoisirDTO{
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  adresse?: string;
}
