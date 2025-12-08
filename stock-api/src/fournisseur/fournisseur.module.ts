import { Module } from '@nestjs/common';
import { FournisseurService } from './fournisseur.service';
import { FournisseurController } from './fournisseur.controller';
import { DbModule } from '../db/db.module'; // <== CORRECTION : Chemin relatif (..)

@Module({
  imports: [DbModule], 
  controllers: [FournisseurController],
  providers: [FournisseurService],
})
export class FournisseurModule {}