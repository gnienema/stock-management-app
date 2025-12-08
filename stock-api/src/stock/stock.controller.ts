// stock-api/src/stock/stock.controller.ts

import { Controller, Post, Body, Param } from '@nestjs/common';
import { StockService } from './stock.service';
import { RavitaillementLotDto } from './dto/create-stock.dto'; // <== VÉRIFIEZ L'IMPORT

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post(':idProduit/ravitailler')
  ravitailler(
    @Param('idProduit') idProduit: string,
    @Body() ravitaillementDto: RavitaillementLotDto, // <== VÉRIFIEZ L'USAGE DU BON DTO
  ) {
    // Le service va maintenant insérer dans stock_lot
    return this.stockService.ravitailler(+idProduit, ravitaillementDto);
  }
}