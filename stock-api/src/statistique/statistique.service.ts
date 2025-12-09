// stock-api/src/statistique/statistique.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importez toutes les entités pour lesquelles vous voulez des statistiques
import { Client } from '../client/entities/client.entity';
import { Produit } from '../produit/entities/produit.entity';
import { Emplacement } from '../emplacement/entities/emplacement.entity';
// import { Fournisseur } from '../fournisseur/entities/fournisseur.entity'; // Décommentez si vous en avez besoin

import { Commande } from '../commande/entities/commande.entity';

@Injectable()
export class StatistiqueService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Produit)
    private produitRepository: Repository<Produit>,
    @InjectRepository(Emplacement)
    private emplacementRepository: Repository<Emplacement>,
    @InjectRepository(Commande)
    private commandeRepository: Repository<Commande>,
  ) { }

  async getDashboardStats() {
    // 1. Compte de base
    const clientCount = await this.clientRepository.count();
    const orderCount = await this.commandeRepository.count();

    // 2. Valeur Stock
    let stockValue = 0;
    try {
      const result = await this.produitRepository
        .createQueryBuilder('produit')
        // Note: On utilise 'prix_unitaire' (mappé via entity) * 'quantite'
        .select('SUM(produit.prixUnitaire * produit.quantite)', 'valeurTotale')
        .getRawOne();
      stockValue = parseFloat(result.valeurTotale) || 0;
    } catch (e) {
      console.error("Erreur calcul stock:", e.message);
    }

    // 3. Low Stock & Products
    // On doit calculer le stock réel (somme des lots) pour filtrer
    const lowStockProductsRaw = await this.produitRepository
      .createQueryBuilder('p')
      .select([
        'p.id AS id',
        'p.libelle AS libelle',
        'p.seuilMinStock AS "seuilMinStock"'
      ])
      .addSelect(subQuery => {
        return subQuery
          .select("COALESCE(SUM(sl.qte_actuelle), 0)", "total")
          .from("stock_lot", "sl")
          .where("sl.id_produit = p.id");
      }, "qte")
      .where('(SELECT COALESCE(SUM(sl.qte_actuelle), 0) FROM stock_lot sl WHERE sl.id_produit = p.id) <= p.seuilMinStock')
      .getRawMany();

    const lowStockCount = lowStockProductsRaw.length;

    // Retourne l'objet EXACT attendu par le Frontend (interface StatsData)
    return {
      stockValue: parseFloat(stockValue.toFixed(2)),
      clientCount,
      orderCount,
      lowStockCount,
      lowStockProducts: lowStockProductsRaw.map(p => ({
        id: p.id,
        libelle: p.libelle,
        qte: parseInt(p.qte), // La valeur brute calculée
        seuilMinStock: p.seuilMinStock
      }))
    };
  }
}