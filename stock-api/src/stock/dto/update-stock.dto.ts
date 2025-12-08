// stock-api/src/stock/dto/update-stock.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { RavitaillementLotDto } from './create-stock.dto'; // <== CORRECTION DE L'IMPORT

// Nous utilisons RavitaillementLotDto comme base, car il contient tous les champs de lot
export class UpdateStockDto extends PartialType(RavitaillementLotDto) {}