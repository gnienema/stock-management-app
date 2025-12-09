import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class CommandeService {
  constructor(private dataSource: DataSource) { }

  async create(dto: CreateCommandeDto) {
    const { idClient, lignes } = dto;
    let prixTotal = 0;

    // Typer le tableau explicitement
    const lignesPretes: {
      idProduit: number;
      qte: number;
      libelle: string;
      pu: number;
      totalLigne: number;
    }[] = [];

    // 1. Vérification Stock & Calcul
    for (const l of lignes) {
      // FIX: Utilisation de stock_lot au lieu de stock (table n'existe plus ou logique changée)
      // On somme les qte_actuelle pour avoir le stock total du produit
      const prodRes = await this.dataSource.query(
        `SELECT p.prix_unitaire as pu, p.libelle, 
         (SELECT COALESCE(SUM(sl.qte_actuelle), 0) FROM stock_lot sl WHERE sl.id_produit = p.id) as stock 
         FROM produit p WHERE p.id = $1`,
        [l.idProduit]
      );

      const prod = prodRes[0];

      if (!prod) throw new BadRequestException(`Produit ${l.idProduit} inconnu`);
      if (parseInt(prod.stock) < l.qte) throw new BadRequestException(`Stock insuffisant pour ${prod.libelle} (Dispo: ${prod.stock})`);

      const totalLigne = prod.pu * l.qte;
      prixTotal += totalLigne;
      lignesPretes.push({ ...l, ...prod, totalLigne });
    }

    // 2. Création Commande (Transaction implicite souhaitée mais ici séquentielle pour respecter l'existant)
    const cmdRes = await this.dataSource.query(
      `INSERT INTO commande (id_client, prix_total, date_commande) VALUES ($1, $2, NOW()) RETURNING id`,
      [idClient, prixTotal]
    );
    const idCmd = cmdRes[0].id;

    // 3. Lignes & Mise à jour Stock (FIFO)
    for (const item of lignesPretes) {
      await this.dataSource.query(
        `INSERT INTO ligne_commande (id_commande, id_produit, qte, total_ligne, prix_unitaire_achat, libelle_produit) VALUES ($1, $2, $3, $4, $5, $6)`,
        [idCmd, item.idProduit, item.qte, item.totalLigne, item.pu, item.libelle]
      );

      // LOGIQUE FIFO : On récupère les lots avec du stock positif, du plus ancien au plus récent
      let qteRestanteAprelever = item.qte;

      const lots = await this.dataSource.query(
        `SELECT id, qte_actuelle FROM stock_lot 
         WHERE id_produit = $1 AND qte_actuelle > 0 
         ORDER BY date_reception ASC`, // FIFO
        [item.idProduit]
      );

      for (const lot of lots) {
        if (qteRestanteAprelever <= 0) break;

        const aPrelever = Math.min(lot.qte_actuelle, qteRestanteAprelever);

        // Mise à jour du lot en base
        await this.dataSource.query(
          `UPDATE stock_lot SET qte_actuelle = qte_actuelle - $1 WHERE id = $2`,
          [aPrelever, lot.id]
        );

        qteRestanteAprelever -= aPrelever;
      }

      if (qteRestanteAprelever > 0) {
        // Cas théoriquement impossible car on a vérifié le stock total au début (étape 1),
        // sauf si le stock a changé entre temps (race condition).
        console.warn(`[Stock Incohérent] Il reste ${qteRestanteAprelever} produits non déstockés pour le produit ${item.idProduit}`);
      }
    }

    return { id: idCmd, message: "Commande validée" };
  }

  async findAll() {
    return await this.dataSource.query(`SELECT * FROM commande ORDER BY id DESC`);
  }
}