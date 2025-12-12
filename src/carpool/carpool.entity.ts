import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,  } from "typeorm";

export enum CarpoolStatus {
  PLANIFIE = 'planifie',
  EN_COURS = 'en_cours',
  TERMINE = 'termine',
  ANNULE = 'annule',
}

@Entity('Carpool')
export class Carpool {
  @PrimaryGeneratedColumn()
  id_carpool: number;

  @Column()
  driver_id: number; // ✅ Garder le même nom que la table

  @ManyToOne(() => User)
@JoinColumn({ name: 'driver_id' })
driver: User;

  @Column()
  start_point: string;

  @Column()
  end_point: string;

  @Column({ type: 'json', nullable: true })
  key_points: string[]; // ✅ Défini correctement

  @Column({ type: 'datetime' })
  departure_time: Date; // ✅ Type Date pour TypeORM

  @Column()
  available_seats: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_per_seat: number;

  @Column({
    type: 'enum',
    enum: CarpoolStatus,
    default: CarpoolStatus.PLANIFIE,
  })
  status: CarpoolStatus;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @OneToMany(() => RideRequest, (ride) => ride.carpool)
requests: RideRequest[];


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
  @Column({ type: 'varchar', length: 255, name: 'pickup_point', nullable: true })
  pickup_point: string;

 @ManyToOne(() => Carpool, (carpool) => carpool.requests, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'carpool_id' })
carpool: Carpool;

@ManyToOne(() => User, (user) => user.rideRequests, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'user_id' })
user: User;

  
}
