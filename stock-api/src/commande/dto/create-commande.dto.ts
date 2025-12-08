import { IsArray, IsNotEmpty, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class LigneCommandeDto {
  @IsNotEmpty()
  @IsNumber()
  idProduit: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  qte: number;
}

export class CreateCommandeDto {
  @IsNotEmpty()
  @IsNumber()
  idClient: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LigneCommandeDto)
  lignes: LigneCommandeDto[];
}