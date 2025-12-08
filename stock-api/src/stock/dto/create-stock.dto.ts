

import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, Min } from 'class-validator';

export class RavitaillementLotDto { 
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  qte: number;

  @IsNotEmpty()
  @IsNumber()
  idFournisseur: number;

  @IsOptional()
  @IsString()
  referenceLot?: string; 

  // CORRECTION CLÉ : Gère la chaîne vide '' ou null
  @IsOptional()
  @IsDateString() 
  datePeremption?: string; // DLC

  @IsNotEmpty()
  @IsNumber()
  prixAchat: number; 
}