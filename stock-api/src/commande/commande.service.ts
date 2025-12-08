import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class CommandeService {
  constructor(private db: DbService) {}

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
      const prodRes = await this.db.query(
        `SELECT p.prix_unitaire as pu, p.libelle, COALESCE(s.qte, 0) as stock FROM produit p LEFT JOIN stock s ON p.id = s.id_produit WHERE p.id = $1`,
        [l.idProduit]
      );
      const prod = prodRes.rows[0];
      
      if (prod.stock < l.qte) throw new BadRequestException(`Stock insuffisant pour ${prod.libelle}`);
      
      const totalLigne = prod.pu * l.qte;
      prixTotal += totalLigne;
      lignesPretes.push({ ...l, ...prod, totalLigne });
    }

    // 2. Création Commande
    const cmdRes = await this.db.query(
      `INSERT INTO commande (id_client, prix_total, date_commande) VALUES ($1, $2, NOW()) RETURNING id`,
      [idClient, prixTotal]
    );
    const idCmd = cmdRes.rows[0].id;

    // 3. Lignes & Mise à jour Stock
    for (const item of lignesPretes) {
      await this.db.query(
        `INSERT INTO ligne_commande (id_commande, id_produit, qte, total_ligne, prix_unitaire_achat, libelle_produit) VALUES ($1, $2, $3, $4, $5, $6)`,
        [idCmd, item.idProduit, item.qte, item.totalLigne, item.pu, item.libelle]
      );
      await this.db.query(`UPDATE stock SET qte = qte - $1 WHERE id_produit = $2`, [item.qte, item.idProduit]);
    }

    return { id: idCmd, message: "Commande validée" };
  }

  async findAll() {
    return (await this.db.query(`SELECT * FROM commande ORDER BY id DESC`)).rows;
  }
}