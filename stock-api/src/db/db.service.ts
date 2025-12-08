import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import 'dotenv/config';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    // Si on a une URL complète (Cloud), on active SSL.
    // Si l'URL commence par 'postgres://' mais qu'on est en local via les variables DB_,
    // on désactive SSL manuellement dans le 'else'.
    
    // Pour simplifier en dev local avec Docker, utilisons les variables séparées
    if (process.env.DB_HOST === 'localhost' || !connectionString) {
       // MODE LOCAL (DOCKER) - PAS DE SSL
       this.pool = new Pool({
        user: process.env.DB_USER || 'user',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'stock_db',
        password: process.env.DB_PASSWORD || 'password',
        port: parseInt(process.env.DB_PORT || '5432'),
      });
    } else {
      // MODE CLOUD (RENDER) - AVEC SSL
      this.pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }, 
      });
    }
  }

  async onModuleInit() {
    console.log('[DB] Tentative de connexion...');
    try {
      await this.pool.query('SELECT 1');
      console.log('[DB] Connexion PostgreSQL réussie.');
    } catch (e) {
      console.error('[DB] Erreur:', e);
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  query(text: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }
}