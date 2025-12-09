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
      // Si DATABASE_URL n'existe pas, on utilise ces valeurs :
      host: process.env.DATABASE_URL ? undefined : 'localhost',
      port: process.env.DATABASE_URL ? undefined : 5432, // Port standard Postgres
      username: process.env.DATABASE_URL ? undefined : 'postgres', // REMPLACEZ PAR VOTRE USER LOCAL SI BESOIN
      password: process.env.DATABASE_URL ? undefined : 'votre_mot_de_passe_local', // REMPLACEZ PAR VOTRE PASS LOCAL
      database: process.env.DATABASE_URL ? undefined : 'stock_db',

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
export class AppModule {}