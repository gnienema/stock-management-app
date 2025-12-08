// stock-api/src/statistique/statistique.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importez toutes les entités pour lesquelles vous voulez des statistiques
import { Client } from '../client/entities/client.entity';
import { Produit } from '../produit/entities/produit.entity';
import { Emplacement } from '../emplacement/entities/emplacement.entity';
// import { Fournisseur } from '../fournisseur/entities/fournisseur.entity'; // Décommentez si vous en avez besoin

@Injectable()
export class StatistiqueService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Produit)
    private produitRepository: Repository<Produit>,
    @InjectRepository(Emplacement)
    private emplacementRepository: Repository<Emplacement>,
    // @InjectRepository(Fournisseur)
    // private fournisseurRepository: Repository<Fournisseur>,
  ) {}

  async getDashboardStats() {
    // 1. Compter les entités
    const totalClients = await this.clientRepository.count();
    const totalProduits = await this.produitRepository.count();
    const totalEmplacements = await this.emplacementRepository.count();
    
    // 2. Calculer la valeur totale du stock (somme de (prix * quantite))
    let valeurStock = 0;
    
    try {
        const result = await this.produitRepository
          .createQueryBuilder('produit')
          .select('SUM(produit.prix * produit.quantite)', 'valeurTotale') // Vérifie 'produit.quantite' et 'produit.prix'
          .getRawOne();
        
        valeurStock = parseFloat(result.valeurTotale) || 0;

    } catch (e) {
        console.error("Erreur lors du calcul de la valeur du stock:", e.message);
        // Cela peut arriver si la colonne 'quantite' ou 'prix' n'est pas trouvée
    }


    return {
      totalClients,
      totalProduits,
      totalEmplacements,
      valeurStock: parseFloat(valeurStock.toFixed(2)),
      // Ajoutez d'autres statistiques ici
    };
  }
}