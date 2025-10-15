import { IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MealDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(['breakfast', 'lunch'])
  meal_type: 'breakfast' | 'lunch';
}
export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsEnum(['breakfast','lunch'])
  meal_type?: 'breakfast' | 'lunch';

  @IsOptional()
  @IsEnum(['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'])
  day?: string;

  @IsOptional()
  @IsDateString()
  valid_from?: string;

  @IsOptional()
  @IsDateString()
  valid_to?: string;
}
export class DayMenuDto {
  @IsEnum(['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'])
  day: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealDto)
  breakfast: MealDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealDto)
  lunch: MealDto[];
}

export class CreateMultiMenuDto {
  @IsNumber()
  partner_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayMenuDto) // ✅ Ici on précise DayMenuDto
  menus: DayMenuDto[];
}
