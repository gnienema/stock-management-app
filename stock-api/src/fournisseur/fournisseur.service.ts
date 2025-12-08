import { Injectable, NotFoundException } from '@nestjs/common'; // <== CORRECTION ICI
import { CreateFournisseurDto } from './dto/create-fournisseur.dto';
import { UpdateFournisseurDto } from './dto/update-fournisseur.dto';
import { DbService } from 'src/db/db.service'; 

@Injectable()
export class FournisseurService {
  constructor(private db: DbService) {}

  // 1. CREATE
  async create(createFournisseurDto: CreateFournisseurDto) {
    const { nom, contactEmail, telephone, adresse } = createFournisseurDto;

    const result = await this.db.query(
      `INSERT INTO fournisseur (nom, contact_email, telephone, adresse, date_creation) 
       VALUES ($1, $2, $3, $4, $5, NOW()) 
       RETURNING id, nom, contact_email AS "contactEmail", telephone, adresse`, 
      [nom, contactEmail, telephone, adresse],
    );
    return result.rows[0];
  }

  // 2. READ ALL (Avec renommage pour le Frontend)
  async findAll() {
    const result = await this.db.query(
      `SELECT id, nom, 
              contact_email AS "contactEmail", 
              telephone, adresse, date_creation 
       FROM fournisseur ORDER BY id DESC`,
    );
    return result.rows;
  }

  // 3. READ ONE
  async findOne(id: number) {
    const result = await this.db.query(
      `SELECT id, nom, 
              contact_email AS "contactEmail", 
              telephone, adresse 
       FROM fournisseur WHERE id = $1`, 
       [id]
    );
    
    if (result.rowCount === 0) {
        throw new NotFoundException(`Fournisseur with ID ${id} not found`);
    }

    return result.rows[0];
  }

  // 4. UPDATE
  async update(id: number, updateFournisseurDto: UpdateFournisseurDto) {
    const values = Object.values(updateFournisseurDto);
    
    if (values.length === 0) {
        return this.findOne(id);
    }
    
    // Note: Pour une mise à jour parfaite, il faudrait aussi mapper les champs comme pour ProduitService
    // Ici on fait simple pour l'instant
    const fields = Object.keys(updateFournisseurDto).map((key, index) => {
        if (key === 'contactEmail') return `"contact_email" = $${index + 2}`; // Mapping manuel
        return `"${key}" = $${index + 2}`;
    }).join(', ');

    const result = await this.db.query(
      `UPDATE fournisseur SET ${fields} WHERE id = $1 
       RETURNING id, nom, contact_email AS "contactEmail"`, 
      [id, ...values],
    );

    if (result.rowCount === 0) {
        throw new NotFoundException(`Fournisseur with ID ${id} not found`);
    }
    return result.rows[0];
  }

  // 5. DELETE
  async remove(id: number) {
    const result = await this.db.query(`DELETE FROM fournisseur WHERE id = $1 RETURNING id`, [id]);
    
    if (result.rowCount === 0) {
        throw new NotFoundException(`Fournisseur with ID ${id} not found`);
    }

    return { id, message: `Fournisseur with ID ${id} successfully deleted` };
  }
}