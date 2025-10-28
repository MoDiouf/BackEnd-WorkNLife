// users/users.entity.ts
import { Commande } from 'src/partner/commandes/commandes.entity';
import { PartnerProfile } from 'src/partner/partner.entity';
import { Reservation } from 'src/reservation/reservation.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column()
  full_name: string;

  @OneToMany(() => Commande, (commande) => commande.user)
commandes: Commande[];

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  // Le rôle principal qu’il possède
  @Column({ type: 'enum', enum: ['standard', 'driver'], default: 'standard' })
  role: 'standard' | 'driver';

  // Le rôle actuellement actif
  @Column({ type: 'enum', enum: ['standard', 'driver'], default: 'standard' })
  active_role: 'standard'  | 'driver';

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  created_at: Date;
   
   // 🔹 Relation OneToMany vers PartnerProfile
  @OneToMany(() => PartnerProfile, (profile) => profile.user)
  partnerProfiles: PartnerProfile[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
reservations: Reservation[];
}

@Entity('IdentityVerification')
export class IdentityVerification {
  @PrimaryGeneratedColumn()
  id_verif: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ['driver', 'standard'] })
  role: 'driver' | 'standard';

  @Column({ nullable: true })
  document_url: string;

  @Column({ type: 'enum', enum: ['en_attente', 'valide', 'rejete'], default: 'en_attente' })
  status: 'en_attente' | 'valide' | 'rejete';

  @Column({ nullable: true })
  verified_at: Date;
}