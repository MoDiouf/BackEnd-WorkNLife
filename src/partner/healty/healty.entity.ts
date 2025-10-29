import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { PartnerProfile } from 'src/partner/partner.entity';

@Entity('HealthyActivity')
export class HealthyActivity {
  @PrimaryGeneratedColumn()
  id_activity: number;

  @ManyToOne(() => PartnerProfile, (partner) => partner.id_partner, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'partner_id' })
  partner: PartnerProfile;

  @Column()
  partner_id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price_per_session?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  suggested_monthly_price?: number;

  @Column({ type: 'tinyint', width: 1, default: 1 })
  available: boolean;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 6 })
  updated_at: Date;
}
