import { PartnerProfile } from 'src/partner/partner.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';


@Entity('Reservation')
export class Reservation {
  @PrimaryGeneratedColumn()
  id_reservation: number;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PartnerProfile, (partner) => partner.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'partner_id' })
  partner: PartnerProfile;

  @Column({
    type: 'enum',
    enum: ['loisir', 'healty'],
    nullable: false,
  })
  reservation_type: 'loisir' | 'healty';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  reservation_price: number;

  @Column({
    type: 'enum',
    enum: ['en_attente', 'confirme',  'annule'],
    default: 'en_attente',
  })
  status: 'en_attente' | 'confirme' | 'annule';

  @CreateDateColumn()
  created_at: Date;
}
