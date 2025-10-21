// src/carpool/dto/create-carpool.dto.ts
import { IsString, IsNumber, IsDate, IsOptional, IsEnum } from 'class-validator';

export class CreateCarpoolDto {
  @IsString()
  start_point: string;

  @IsString()
  end_point: string;

  @IsDate()
  departure_time: Date;

  @IsNumber()
  availaavailable_seatsble_seats: number;

  @IsNumber()
  price_per_seat: number;

  @IsEnum(['planifie', 'en_cours', 'termine', 'annule'])
  status: 'planifie' | 'en_cours' | 'termine' | 'annule';
}
export class UpdateCarpoolStatusDto {
  @IsEnum(['planifie', 'en_cours', 'termine', 'annule'])
  status: 'planifie' | 'en_cours' | 'termine' | 'annule';
}