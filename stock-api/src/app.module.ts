import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// --- IMPORTATION DES MODULES ---
import { ClientModule } from './client/client.module';
import { ProduitModule } from './produit/produit.module';
import { FournisseurModule } from './fournisseur/fournisseur.module';
import { EmplacementModule } from './emplacement/emplacement.module';
import { CommandeModule } from './commande/commande.module';
import { StatistiqueModule } from './statistique/statistique.module';

// --- IMPORTATION DES ENTITÉS ---
import { Client } from './client/entities/client.entity';
import { Produit } from './produit/entities/produit.entity';
import { Fournisseur } from './fournisseur/entities/fournisseur.entity';
import { Emplacement } from './emplacement/entities/emplacement.entity';
import { Commande } from './commande/entities/commande.entity';

@Module({
  imports: [
    // 1. Configuration de la Base de Données (Compatible Render & Local)
    TypeOrmModule.forRoot({
      type: 'postgres',

      // OPTION 1 : Connexion via URL (Utilisé par Render)
      url: process.env.DATABASE_URL,

      // OPTION 2 : Connexion classique (Fallback pour Localhost)
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'stock_db',

      // SSL (Obligatoire pour Render, désactivé en local)
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,

      // Chargement des entités
      entities: [Client, Produit, Fournisseur, Emplacement, Commande],
      autoLoadEntities: true,
      synchronize: true, // Utile pour le développement (crée les tables auto)
    }),

    // 2. Chargement des Modules de l'Application
    ClientModule,
    ProduitModule,
    FournisseurModule,
    EmplacementModule,
    CommandeModule,
    StatistiqueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }