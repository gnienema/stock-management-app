// stock-api/src/produit/produit.entity.ts

import { Emplacement } from '../../emplacement/entities/emplacement.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Produit {
  // ... autres colonnes
   @PrimaryGeneratedColumn()
  id: number; // La clé primaire (ID) du produit.

  @Column({ length: 100 })
  nom: string;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number;

  @Column({ type: 'int', default: 0 }) 
  quantite: number;

  // Relation ManyToOne avec Emplacement (C'est la propriété 'emplacement' qui manquait)
  @ManyToOne(() => Emplacement, (emplacement) => emplacement.produits)
  @JoinColumn({ name: 'emplacementId' }) // Assurez-vous que la colonne de clé étrangère est nommée 'emplacementId'
  emplacement: Emplacement;

  @Column({ nullable: true })
  emplacementId: number; // Clé étrangère
}