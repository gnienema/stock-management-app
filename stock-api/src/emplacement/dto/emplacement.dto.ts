// stock-api/src/emplacement/dto/emplacement.dto.ts

export class CreateEmplacementDto {
  libelle: string;
  description?: string;
}

export class UpdateEmplacementDto {
  libelle?: string;
  description?: string;
}