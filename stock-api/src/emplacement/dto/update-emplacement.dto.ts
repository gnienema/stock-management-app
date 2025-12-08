import { PartialType } from '@nestjs/mapped-types';
import { CreateEmplacementDto } from './create-emplacement.dto';

// PartialType rend toutes les propriétés de CreateEmplacementDto optionnelles
export class UpdateEmplacementDto extends PartialType(CreateEmplacementDto) {}