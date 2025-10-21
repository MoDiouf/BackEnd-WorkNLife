import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,  } from "typeorm";

@Entity()
export class Carpool {
  @PrimaryGeneratedColumn()
  id_carpool: number;

  @Column()
  driver_id: number;

  @Column({ length: 255 })
  start_point: string;

  @Column({ length: 255 })
  end_point: string;

  @Column({ type: 'datetime' })
  departure_time: Date;

  @Column()
  available_seats: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_per_seat: number;

  @Column({
    type: 'enum',
    enum: ['planifie', 'en_cours', 'termine', 'annule'],
    default: 'planifie',
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('RideRequest') // correspond au nom exact de ta table
export class RideRequest {
  @PrimaryGeneratedColumn({ name: 'id_request' })
  id_request: number;

  @Column({ name: 'carpool_id', nullable: true })
  carpool_id: number;

  @Column({ name: 'user_id', nullable: true })
  user_id: number;

  @Column({
    type: 'enum',
    enum: ['en_attente', 'accepte', 'refuse'],
    nullable: true,
  })
  status: 'en_attente' | 'accepte' | 'refuse';

  @Column({ type: 'datetime', name: 'requested_at', nullable: true })
  requested_at: Date;

  // ⚡ Relations (optionnelles)
  @ManyToOne(() => Carpool, (carpool) => carpool.id_carpool, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carpool_id' })
  carpool: Carpool;

  @ManyToOne(() => User, (user) => user.id_user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
