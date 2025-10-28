import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  partner_id: number;

  @IsEnum(['loisir', 'healty'])
  reservation_type: 'loisir' | 'healty';

  @IsOptional()
  @IsNumber()
  @IsPositive()
  reservation_price?: number;
}
