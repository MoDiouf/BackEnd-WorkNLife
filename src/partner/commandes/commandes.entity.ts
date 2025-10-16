import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { PartnerProfile } from 'src/partner/partner.entity';
import { Menu } from 'src/partner/menu/menu.entity';

@Entity('Commande')
export class Commande {
  @PrimaryGeneratedColumn()
  id_commande: number;

  // 🔗 Relation avec l'utilisateur
  @ManyToOne(() => User, (user) => user.commandes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  user_id: number;

  // 🔗 Relation avec le partenaire
  @ManyToOne(() => PartnerProfile, (partner) => partner.commandes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'partner_id' })
  partner: PartnerProfile;

  @Column({ nullable: true })
  partner_id: number;

  // 🔗 Relation avec le menu
  @ManyToOne(() => Menu, (menu) => menu.commandes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @Column({ nullable: true })
  menu_id: number;

  // 🍽️ Quantité du plat
  @Column({ type: 'int', nullable: true })
  quantity: number;

  // 💰 Montant total
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_amount: number;

  // 📦 Statut de la commande
  @Column({
    type: 'enum',
    enum: ['en_attente', 'en_cours', 'en_cours_livraison', 'livre', 'annule'],
    default: 'en_attente',
  })
  status: 'en_attente' | 'en_cours' | 'en_cours_livraison' | 'livre' | 'annule';

  // 🕓 Date de création
  @CreateDateColumn({ type: 'datetime', nullable: true })
  created_at: Date;
}
