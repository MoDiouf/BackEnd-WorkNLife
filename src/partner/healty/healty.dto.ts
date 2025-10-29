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
