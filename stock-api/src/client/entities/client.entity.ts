// stock-api/src/client/entities/client.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('clients') // Le nom de la table dans la base de données
export class Client {
  
  @PrimaryGeneratedColumn()
  id: number; // Clé primaire auto-générée (CRITIQUE pour TypeORM)

  @Column({ length: 100 })
  nom: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  telephone: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}