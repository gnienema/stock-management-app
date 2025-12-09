import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('commande')
export class Commande {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'id_client' })
    idClient: number;

    @Column('decimal', { name: 'prix_total', precision: 10, scale: 2 })
    prixTotal: number;

    @CreateDateColumn({ name: 'date_commande' })
    dateCommande: Date;
}
