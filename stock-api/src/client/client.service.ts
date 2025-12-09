import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(private dataSource: DataSource) { }

  async create(createClientDto: CreateClientDto) {
    const { nom, prenoms, email, telephone, adresse } = createClientDto;
    const result = await this.dataSource.query(
      `INSERT INTO client (nom, prenoms, email, telephone, adresse, date_creation) 
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [nom, prenoms, email, telephone, adresse],
    );
    return result[0];
  }

  async findAll() {
    const result = await this.dataSource.query(`SELECT * FROM client ORDER BY id DESC`);
    return result;
  }

  async findOne(id: number) {
    const result = await this.dataSource.query(`SELECT * FROM client WHERE id = $1`, [id]);
    return result[0];
  }

  // 4. UPDATE (Modifier un client)
  async update(id: number, updateClientDto: UpdateClientDto) {
    const values = Object.values(updateClientDto);

    // Si aucune donnée n'est envoyée, on ne fait rien
    if (values.length === 0) {
      return this.findOne(id);
    }

    // Construction dynamique de la requête : "nom" = $2, "email" = $3...
    // On commence l'index à 2 car $1 est réservé pour l'ID
    const fields = Object.keys(updateClientDto).map((key, index) => `"${key}" = $${index + 2}`).join(', ');

    // Requête SQL
    const result = await this.dataSource.query(
      `UPDATE client SET ${fields} WHERE id = $1 RETURNING *`,
      [id, ...values],
    );

    if (result.length === 0) {
      // (Optionnel) Gérer le cas où le client n'existe pas
      return null;
    }
    return result[0];
  }

  async remove(id: number) {
    await this.dataSource.query(`DELETE FROM client WHERE id = $1`, [id]);
    return { message: `Client ${id} supprimé` };
  }
}