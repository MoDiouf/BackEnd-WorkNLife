import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

// update-healthy-shop-price.dto.ts
export class UpdateHealthyShopPriceDto {
  price_per_session?: number;
  price_per_month?: number;
}
export class CreateHealthyActivityDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsEnum(['cardio', 'musculation', 'yoga', 'crossfit', 'autre'])
  category: string;

  @IsOptional()
  available?: boolean;
}
export class UpdateHealthyBoutikDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  adresse?: string;

  price_per_session?: number;
  price_per_month?: number;
}
export class UpdateHealthyActivityDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsEnum(['cardio', 'musculation', 'yoga', 'crossfit', 'autre'])
  @IsOptional()
  category?: string;

  @IsOptional()
  available?: boolean;
}
