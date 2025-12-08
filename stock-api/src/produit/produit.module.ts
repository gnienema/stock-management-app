import { Module } from '@nestjs/common';
import { ProduitService } from './produit.service';
import { ProduitController } from './produit.controller';
import { Emplacement } from '../emplacement/entities/emplacement.entity';

@Module({
  controllers: [ProduitController],
  providers: [ProduitService],
})
export class ProduitModule {}
