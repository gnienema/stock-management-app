import { Module } from '@nestjs/common';
import { FournisseurService } from './fournisseur.service';
import { FournisseurController } from './fournisseur.controller';
// import { DbModule } from '../db/db.module';

@Module({
  imports: [],
  controllers: [FournisseurController],
  providers: [FournisseurService],
})
export class FournisseurModule { }