import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class StatsService {
  constructor(private db: DbService) {}

// stock-api/src/stats/stats.service.ts

async getStats() {
    // 1. Valeur Totale du Stock (TEMPORAIREMENT DÉSACTIVÉE POUR ISOLER LE BUG)
    // Nous remplaçons la requête complexe par une requête simple qui renvoie 0.
    const stockValueQuery = await this.db.query(
        `SELECT 0 AS "stockValue"` 
    ); 

    // 2. Compter les produits en Seuil Bas (Gardée intacte)
    const lowStockQuery = await this.db.query(
        `SELECT COUNT(p.id) AS "lowStockCount"
         FROM produit p
         WHERE (
            SELECT COALESCE(SUM(sl.qte_actuelle), 0)
            FROM stock_lot sl
            WHERE sl.id_produit = p.id
         ) <= p.seuil_min_stock
         AND p.seuil_min_stock > 0`
    );

    // 3. Nombre de Clients (Gardée intacte)
    const clientCountQuery = await this.db.query(`SELECT COUNT(*) AS "clientCount" FROM client`);

    // 4. Nombre de Commandes (Gardée intacte)
    const orderCountQuery = await this.db.query(`SELECT COUNT(*) AS "orderCount" FROM commande`);

    return {
        stockValue: parseFloat(stockValueQuery.rows[0].stockValue),
        clientCount: parseInt(clientCountQuery.rows[0].clientCount),
        orderCount: parseInt(orderCountQuery.rows[0].orderCount),
        lowStockCount: parseInt(lowStockQuery.rows[0].lowStockCount),
    };
  }
}