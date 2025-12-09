import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProduitDto } from './dto/create-produit.dto';
import { UpdateProduitDto } from './dto/update-produit.dto';
import { DataSource } from 'typeorm';
// import { Emplacement } from '../emplacement/entities/emplacement.entity';

const PRODUCT_FIELD_MAPPING = {
  libelle: 'libelle',
  reference: 'reference',
  pu: 'prix_unitaire',
  description: 'description',
  seuilMinStock: 'seuil_min_stock',
};

@Injectable()
export class ProduitService {
  constructor(private dataSource: DataSource) { }

  // 1. CREATE (Avec Auto-Incrémentation et Logs)
  async create(createProduitDto: CreateProduitDto) {
    console.log('--- DÉBUT CRÉATION PRODUIT ---');
    console.log('Données reçues:', createProduitDto);

    const { libelle, pu, seuilMinStock } = createProduitDto;

    // On extrait la référence (qui peut être modifiée)
    let { reference } = createProduitDto;

    // CORRECTION ICI : On crée une constante pour la description qui accepte null
    // Si la description est vide ou undefined, on met null pour la BDD
    const descriptionValue = createProduitDto.description || null;

    // GÉNÉRATION AUTOMATIQUE DE LA RÉFÉRENCE
    if (!reference || reference.trim() === '') {
      console.log('Calcul de la référence automatique...');

      // On cherche le dernier ID
      const lastIdResult = await this.dataSource.query(`SELECT id FROM produit ORDER BY id DESC LIMIT 1`);
      // Note: TypeORM raw query returns an array of objects directly
      const lastId = lastIdResult.length > 0 ? lastIdResult[0].id : 0;
      const nextId = lastId + 1;

      // On formate : PROD-00001
      reference = `PROD-${nextId.toString().padStart(5, '0')}`;
      console.log('Nouvelle référence générée:', reference);
    }

    try {
      const result = await this.dataSource.query(
        `INSERT INTO produit (libelle, reference, prix_unitaire, description, seuil_min_stock) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, libelle, reference, prix_unitaire AS pu, seuil_min_stock AS "seuilMinStock"`,
        // On utilise descriptionValue ici
        [libelle, reference, pu, descriptionValue, seuilMinStock],
      );

      console.log('Succès SQL:', result[0]);
      return result[0];

    } catch (error) {
      console.error('ERREUR SQL CRITIQUE:', error);
      throw error;
    }
  }


  async findAll() {
    // CORRECTION SQL : On remplace le LEFT JOIN sur 'stock' par une sous-requête
    // qui fait la somme (SUM) des quantités actives dans la nouvelle table 'stock_lot'.
    const result = await this.dataSource.query(
      `SELECT p.id, p.libelle, p.reference, p.description, 
              p.prix_unitaire AS pu, 
              p.seuil_min_stock AS "seuilMinStock",
              -- Nouvelle formule pour calculer qte : SOMME de tous les lots
              (SELECT COALESCE(SUM(qte_actuelle), 0) FROM stock_lot WHERE id_produit = p.id) AS qte
       FROM produit p
       ORDER BY p.id DESC`,
    );
    return result;
  }

  // ... (Gardez les autres méthodes: findOne, update, remove, etc.)

  async findOne(id: number) {
    const result = await this.dataSource.query(
      `SELECT id, libelle, reference, description, 
              prix_unitaire AS pu, 
              seuil_min_stock AS "seuilMinStock", 
              date_creation AS "dateCreation" 
       FROM produit WHERE id = $1`,
      [id],
    );
    if (result.length === 0) throw new NotFoundException(`Produit introuvable`);
    return result[0];
  }

  async update(id: number, updateProduitDto: UpdateProduitDto) {
    const values = Object.values(updateProduitDto);
    if (values.length === 0) return this.findOne(id);

    const fields = Object.keys(updateProduitDto)
      .map((key, index) => `${PRODUCT_FIELD_MAPPING[key]} = $${index + 2}`)
      .join(', ');

    const result = await this.dataSource.query(
      `UPDATE produit SET ${fields} WHERE id = $1 RETURNING id`,
      [id, ...values],
    );
    return result[0];
  }

  async remove(id: number) {
    await this.dataSource.query(`DELETE FROM produit WHERE id = $1`, [id]);
    return { message: "Produit supprimé" };
  }
}