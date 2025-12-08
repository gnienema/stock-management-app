// stock-api/src/emplacement/emplacement.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmplacementService } from './emplacement.service';
import { EmplacementController } from './emplacement.controller';
import { Emplacement } from './entities/emplacement.entity'; // ASSUREZ-VOUS QUE CE CHEMIN EST CORRECT

@Module({
  // CECI EST CRITIQUE : Enregistre l'Entité Emplacement pour TypeORM
  imports: [TypeOrmModule.forFeature([Emplacement])], 
  controllers: [EmplacementController],
  providers: [EmplacementService],
  exports: [EmplacementService] 
})
export class EmplacementModule {}