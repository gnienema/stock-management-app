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



// stock-api/src/app.module.ts

TypeOrmModule.forRoot({
      type: 'postgres',
      
      // 1. PRIORITÉ : Utiliser l'URL fournie par Render si elle existe
      url: process.env.DATABASE_URL, 

      // 2. FALLBACK : Si pas d'URL (en local), utiliser les paramètres classiques
      host: process.env.DATABASE_URL ? undefined : 'localhost',
      port: process.env.DATABASE_URL ? undefined : 5433, 
      username: process.env.DATABASE_URL ? undefined : 'postgres',
      password: process.env.DATABASE_URL ? undefined : 'votre_mot_de_passe_local',
      database: process.env.DATABASE_URL ? undefined : 'stock_db',

      // 3. OBLIGATOIRE POUR RENDER : Le SSL
      // Si on est en ligne (DATABASE_URL existe), on active le SSL, sinon non.
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,

      entities: [Client, Produit, Fournisseur, Emplacement, /*... vos autres entités*/], 
      autoLoadEntities: true,
      synchronize: true, // Garder à true pour l'instant pour créer les tables
    }),