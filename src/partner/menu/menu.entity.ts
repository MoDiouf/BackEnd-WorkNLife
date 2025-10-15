import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PartnerProfile } from '../partner.entity';


@Entity('Menu')
export class Menu {
  @PrimaryGeneratedColumn()
  id_menu: number;

  @Column()
  partner_id: number;

  @ManyToOne(() => PartnerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'partner_id' })
  partner: PartnerProfile;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'tinyint', default: 1 })
  available: boolean;

  @Column({ type: 'enum', enum: ['breakfast', 'lunch'] })
  meal_type: 'breakfast' | 'lunch';

  @Column({ type: 'date', nullable: true })
  valid_from: Date;

  @Column({ type: 'date', nullable: true })
  valid_to: Date;

  @Column({ type: 'enum', enum: ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'], nullable: false })
  day: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
