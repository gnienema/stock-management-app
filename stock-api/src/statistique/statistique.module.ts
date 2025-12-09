// stock-api/src/statistique/statistique.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatistiqueService } from './statistique.service';
import { StatistiqueController } from './statistique.controller';

// Importation des entités dont le service aura besoin
import { Client } from '../client/entities/client.entity';
import { Produit } from '../produit/entities/produit.entity';
import { Emplacement } from '../emplacement/entities/emplacement.entity';
import { Commande } from '../commande/entities/commande.entity';
// import { Fournisseur } from '../fournisseur/entities/fournisseur.entity'; // Décommentez si nécessaire

@Module({
  imports: [
    // CRITIQUE : Enregistre les entités pour créer les Repositories (InjectRepository)
    TypeOrmModule.forFeature([
      Client,
      Produit,
      Emplacement,
      Commande,
      // Fournisseur
    ]),
  ],
  controllers: [StatistiqueController],
  providers: [StatistiqueService],
  // Le service Statistique n'a pas besoin d'être exporté car il est seulement utilisé par le contrôleur de ce module.
})
export class StatistiqueModule { }