import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

}
export class DeleteUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class CreateDriverVerificationDto{
  document_url:string
}

