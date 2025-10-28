import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { PartnerProfile } from '../partner.entity';

@Entity('LoisirActivity')
export class LoisirActivity {
  @PrimaryGeneratedColumn()
  id_activity: number;

  @Column()
  partner_id: number;

  @ManyToOne(() => PartnerProfile, (partner) => partner.id_partner, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'partner_id' })
  partner: PartnerProfile;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ type: 'tinyint', default: 1 })
  available: boolean;

  @Column({
    type: 'enum',
    enum: ['jeux_video', 'parc_attraction', 'cinema', 'bowling', 'escape_game', 'autre'],
  })
  category: 'jeux_video' | 'parc_attraction' | 'cinema' | 'bowling' | 'escape_game' | 'autre';

  @Column({
    type: 'enum',
    enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
    nullable: true,
  })
  day?: string;

  @Column({ type: 'time', nullable: true })
  open_time?: string;

  @Column({ type: 'time', nullable: true })
  close_time?: string;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 6 })
  updated_at: Date;
}
