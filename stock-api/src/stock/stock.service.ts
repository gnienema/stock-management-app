import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { RavitaillementLotDto } from './dto/create-stock.dto';
@Injectable()
export class StockService {
  constructor(private db: DbService) {}

  async findOneByProduit(idProduit: number) {
    const result = await this.db.query(
      `SELECT s.id, s.qte, p.libelle FROM stock s JOIN produit p ON s.id_produit = p.id WHERE s.id_produit = $1`,
      [idProduit],
    );
    return result.rows[0] || { qte: 0 };
  }

// stock-api/src/stock/stock.service.ts

// ... dans la méthode ravitailler
async ravitailler(idProduit: number, ravitaillementDto: RavitaillementLotDto) {
    
    // --- NOUVEAU : LOGIQUE D'INCRÉMENTATION AUTOMATIQUE ---
    if (!ravitaillementDto.referenceLot || ravitaillementDto.referenceLot.trim() === '') {
        // Format: LOT-20251207-IDPROD-UNIQUE (Ex: LOT-20251207-5-123)
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomPart = Math.floor(Math.random() * 900) + 100; // 3 chiffres aléatoires
        ravitaillementDto.referenceLot = `LOT-${datePart}-${idProduit}-${randomPart}`;
    }
    // --- FIN LOGIQUE D'INCRÉMENTATION ---
    
    // Si datePeremption n'est pas fourni (undefined), on force null pour SQL
    const datePeremptionValue = ravitaillementDto.datePeremption || null;    // **ASSURER LA CONVERSION NUMÉRIQUE** // On force la conversion du prix, juste avant l'insertion.
    const prixAchatValue = parseFloat(String(ravitaillementDto.prixAchat)); 

    // Les autres champs sont déjà présents dans le DTO

    const result = await this.db.query(
      `INSERT INTO stock_lot (
         id_produit, id_fournisseur, qte_actuelle, reference_lot, 
         prix_achat, date_peremption, date_reception
       ) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, qte_actuelle`,
      [idProduit, ravitaillementDto.idFournisseur, ravitaillementDto.qte, ravitaillementDto.referenceLot, prixAchatValue, datePeremptionValue],
    );
    return result.rows[0];
 }
}