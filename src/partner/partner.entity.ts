import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Commande } from './commandes/commandes.entity';
import { Menu } from './menu/menu.entity';

// ===============================
// 🧩 PartnerPortalTemplate
// ===============================
@Entity('PartnerPortalTemplate')
export class PartnerPortalTemplate {
  @PrimaryGeneratedColumn()
  id_template: number;

  @Column({
    type: 'enum',
    enum: ['restaurant', 'loisir', 'healthy', 'admin'],
    unique: true,
  })
  partner_type: 'restaurant' | 'loisir' | 'healthy' | 'admin';

  @Column({ type: 'varchar', length: 255, nullable: true })
  template_url: string;

  // Relation inverse avec PartnerProfile
  @OneToMany(() => PartnerProfile, (profile) => profile.partner_type)
  profiles: PartnerProfile[];
}

// ===============================
// 🧩 PartnerProfile
// ===============================
@Entity('PartnerProfile')
export class PartnerProfile {
  @PrimaryGeneratedColumn()
  id_partner: number;

 @ManyToOne(() => User, (user) => user.partnerProfiles, {
  onDelete: 'CASCADE',
  nullable: true,
})
@JoinColumn({ name: 'user_id' })
user: User;

  @OneToMany(() => Commande, (commande) => commande.partner)
commandes: Commande[];

  @Column({ nullable: true })
  user_id: number;

  // 🏢 Nom du partenaire
  @Column({ type: 'varchar', length: 100, nullable: true })
  partner_name: string;

  // 🔗 Type de partenaire (clé étrangère vers PartnerPortalTemplate)
  @ManyToOne(() => PartnerPortalTemplate, (template) => template.profiles, {
    eager: true,
    nullable: true,
  })


  @JoinColumn({ name: 'partner_type_id' })
  partner_type: PartnerPortalTemplate;

  @Column({ nullable: true })
  partner_type_id: number;

  // 📍 Adresse
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  // 📝 Description
  @Column({ type: 'text', nullable: true })
  description: string;

  // 🖼️ Logo
  @Column({ type: 'varchar', length: 255, nullable: true })
  logo_url: string;

  // 🕓 Date de création
  @CreateDateColumn({ type: 'datetime', nullable: true })
  created_at: Date;
}
