// stock-api/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importation des modules nécessaires
import { ClientModule } from './client/client.module'; // Doit exister
import { ProduitModule } from './produit/produit.module'; // Doit exister
import { FournisseurModule } from './fournisseur/fournisseur.module'; // Doit exister
import { EmplacementModule } from './emplacement/emplacement.module'; // Le module que nous corrigeons
import { StatistiqueModule } from './statistique/statistique.module'; // Pour le Dashboard

// Importation des entités pour TypeORM (à adapter si elles sont dans un sous-dossier 'entities')
import { Client } from './client/entities/client.entity';
import { Produit } from './produit/entities/produit.entity';
import { Fournisseur } from './fournisseur/entities/fournisseur.entity';
import { Emplacement } from './emplacement/entities/emplacement.entity';
//import { StatistiqueModule } from './statistique/statistique.module';



@Module({
  imports: [
    // 1. Configuration de la Connexion à la Base de Données (CRITIQUE)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres', // <--- CORRECTION CRITIQUE ICI
      password: '0779679736', // <--- CORRECTION CRITIQUE ICI
      database: 'stock_db',
          
      // Liste de toutes les entités du projet (ajustez les chemins si nécessaire)
      entities: [Client, Produit, Fournisseur, Emplacement], 
      
      synchronize: true, // DEV ONLY! NE PAS UTILISER EN PRODUCTION
    }),
    
    // 2. Importation des Modules Applicatifs
    ClientModule,
    ProduitModule,
    FournisseurModule,
    EmplacementModule,
    StatistiqueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}