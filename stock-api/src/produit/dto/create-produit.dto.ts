import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateProduitDto {
  @IsNotEmpty()
  @IsString()
  libelle: string;

  // IMPORTANT : Le point d'interrogation (?) et @IsOptional()
  @IsOptional() 
  @IsString()
  reference?: string; 

  @IsNotEmpty()
  @IsNumber()
  pu: number;

  @IsNotEmpty()
  @IsNumber()
  seuilMinStock: number;

  @IsOptional()
  @IsString()
  description?: string;
}