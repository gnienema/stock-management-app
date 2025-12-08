import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFournisseurDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nom: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  contactEmail: string; // <--- C'est la clé ! Il doit s'appeler contactEmail

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  adresse?: string;
}