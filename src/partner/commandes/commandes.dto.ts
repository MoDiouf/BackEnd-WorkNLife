import { IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateCommandeDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  partner_id: number;

  @IsNumber()
  menu_id: number;

  @IsNumber()
  quantity: number;
}

export class UpdateCommandeStatusDto {
  @IsEnum(['en_attente', 'en_cours', 'en_cours_livraison', 'livre', 'annule'])
  status: string;
}
