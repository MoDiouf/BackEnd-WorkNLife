import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Carpool, RideRequest } from './carpool.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IdentityVerification } from 'src/users/users.entity';

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

  async createCarpool(data: Partial<Carpool>) {
    const carpool = this.carpoolRepo.create(data);
    return this.carpoolRepo.save(carpool);
  }
  async findAvailableCarpools() {
    return this.carpoolRepo.find({
      where: { status: 'planifie' },
      order: { departure_time: 'ASC' },
    });
  }

  
  async updateStatus( status: string, id_driver: number) {
    const carpool = await this.carpoolRepo.findOne({ where: { driver_id: id_driver } });
    if (!carpool) throw new NotFoundException('Trajet introuvable');
    if (carpool.driver_id !== id_driver)
      throw new ForbiddenException('Vous ne pouvez modifier que vos trajets');

    carpool.status = status;
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
