// stock-api/src/emplacement/emplacement.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produit } from '../../produit/entities/produit.entity';
@Entity()
export class Emplacement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  libelle: string;

  @Column({ nullable: true })
  description: string;

 @OneToMany(() => Produit, (produit: Produit) => produit.emplacement)
produits: Produit[];
}