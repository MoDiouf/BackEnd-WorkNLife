import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Commande } from './commandes/commandes.entity';
import { Reservation } from 'src/reservation/reservation.entity';
import { HealthyActivity } from './healty/healty.entity';

// ===============================
// PartnerPortalTemplate
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
// PartnerProfile
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

  @OneToMany(() => HealthyActivity, (activity) => activity.partner)
  healthyActivities: HealthyActivity[];

  @Column({ nullable: true })
  user_id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  partner_name: string;

  // 🔗 Relation vers PartnerPortalTemplate
  @ManyToOne(() => PartnerPortalTemplate, (template) => template.profiles, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'partner_type_id' })
  partner_type: PartnerPortalTemplate;

  @Column({ nullable: true })
  partner_type_id: number;

  // Relation inverse avec Reservation
  @OneToMany(() => Reservation, (reservation) => reservation.partner)
  reservations: Reservation[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo_url: string;

  @CreateDateColumn({ type: 'datetime', nullable: true })
  created_at: Date;

    // PartnerProfile.entity.ts
@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
price_per_session: number;

@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
price_per_month: number;

@Column({ type: 'text', nullable: true })
service : string
}
