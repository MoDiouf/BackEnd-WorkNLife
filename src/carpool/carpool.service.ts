import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Carpool, RideRequest, CarpoolStatus } from './carpool.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IdentityVerification, User } from 'src/users/users.entity';


@Injectable()
export class CarpoolService {
  constructor(
    @InjectRepository(Carpool)
    private readonly carpoolRepo: Repository<Carpool>,
    @InjectRepository(IdentityVerification)
    private readonly verificationRepo: Repository<IdentityVerification>,
    @InjectRepository(RideRequest)
    private readonly rideRequestRepo: Repository<RideRequest>,
  ) {}

  async isDriverVerified(user_id: number): Promise<boolean> {
    const verification = await this.verificationRepo.findOne({
      where: {
        user: user_id,
        role: 'driver',
        status: 'valide',
      } as any,
    });
    return !!verification;
  }

async createCarpool(data: {
  driver_id: number;
  start_point: string;
  end_point: string;
  departure_time: string; // String reçue
  available_seats: number;
  price_per_seat: number;
  key_points: string[];
  status?: CarpoolStatus;
}) {
  // Création directe
  const carpool = new Carpool();
  carpool.driver_id = data.driver_id; // ✅ driver_id (avec underscore)
  carpool.start_point = data.start_point;
  carpool.end_point = data.end_point;
  carpool.departure_time = new Date(data.departure_time); // ✅ Conversion ici
  carpool.available_seats = data.available_seats;
  carpool.price_per_seat = data.price_per_seat;
  carpool.key_points = data.key_points; // ✅ key_points (avec underscore)
  carpool.status = data.status || CarpoolStatus.PLANIFIE;
  carpool.created_at = new Date();

  return this.carpoolRepo.save(carpool);
}
  async findAvailableCarpools() {
  return this.carpoolRepo.find({
    where: { status: CarpoolStatus.PLANIFIE },
    relations:['driver'], // ✅ Utilisez l'enum
    order: { departure_time: 'ASC' },
  });
}

  
  async updateStatus(status: CarpoolStatus, id_driver: number) { // ✅ Typez avec CarpoolStatus
  const carpool = await this.carpoolRepo.findOne({ 
    where: { driver_id: id_driver } 
  });
  
  if (!carpool) throw new NotFoundException('Trajet introuvable');
  if (carpool.driver_id !== id_driver)
    throw new ForbiddenException('Vous ne pouvez modifier que vos trajets');

  carpool.status = status; // ✅ Maintenant TypeScript est content
  return this.carpoolRepo.save(carpool);
}

  async createRideRequest(carpool_id: number, user_id: number) {
    const carpool = await this.carpoolRepo.findOne({ where: { id_carpool: carpool_id } });
    if (!carpool) throw new NotFoundException('Trajet introuvable');

    if (carpool.status !== 'planifie') {
      throw new ForbiddenException('Ce trajet n’est pas disponible pour une demande');
    }

    const rideRequest = this.rideRequestRepo.create({
      carpool_id,
      user_id,
      status: 'en_attente',
      requested_at: new Date(),
    });
    //this.sendNotificationToDriver(carpool.driver_id, user_id, carpool_id);
    return this.rideRequestRepo.save(rideRequest);
  }
  async deleteCarpool(id: number, driver_id: number) {
    const carpool = await this.carpoolRepo.findOne({ where: { id_carpool: id } });
    if (!carpool) throw new NotFoundException('Trajet introuvable');
    if (carpool.driver_id !== driver_id)
      throw new ForbiddenException('Suppression non autorisée');

    return this.carpoolRepo.remove(carpool);
  }
}
