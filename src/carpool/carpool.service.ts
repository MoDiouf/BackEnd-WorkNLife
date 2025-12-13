import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Carpool, RideRequest, CarpoolStatus } from './carpool.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IdentityVerification, User } from 'src/users/users.entity';
import { CarpoolGateway } from './carpool.gateway';
import { UpdateCarpoolStatusDto } from './carpool.dto';
import { log } from 'console';


@Injectable()
export class CarpoolService {
  constructor(
    @InjectRepository(Carpool)
    private readonly carpoolRepo: Repository<Carpool>,
    @InjectRepository(IdentityVerification)
    private readonly verificationRepo: Repository<IdentityVerification>,
    @InjectRepository(RideRequest)
    private readonly rideRequestRepo: Repository<RideRequest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly carpoolGateway: CarpoolGateway,
  ) {}

  async isDriverVerified(user_id: number): Promise<boolean> {
    const verification = await this.verificationRepo.findOne({
    where: {
      user: { id_user: user_id }, 
      role: 'driver',
      status: 'valide',
    },
    relations: ['user'], 
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
  const CarpoolSaved = await this.carpoolRepo.save(carpool);
  console.log("Nouveau carpool créé avec ID:", CarpoolSaved.id_carpool);
  return CarpoolSaved;
}
  async findAvailableCarpools() {
  return this.carpoolRepo.find({
    where: {status: In([CarpoolStatus.PLANIFIE, CarpoolStatus.EN_COURS]), },
    relations:['driver'], // ✅ Utilisez l'enum
    order: { departure_time: 'ASC' },
  });
}

  
  async updateStatus(dto: UpdateCarpoolStatusDto, driver_id: number) {
    console.log(driver_id);
    
  const request = await this.rideRequestRepo.findOne({
    where: { id_request: dto.request_id },
    relations: ['carpool'],
  });
  console.log(request);
  
  if (!request) throw new NotFoundException('Demande introuvable');

  // ✅ Vérification que seul le chauffeur du trajet peut répondre
  if (request.carpool.driver_id !== driver_id) {
    throw new ForbiddenException("Vous n'êtes pas autorisé");
  }

  // ✅ Mettre à jour le status de la demande
  request.status = dto.status;
  const updatedRequest = await this.rideRequestRepo.save(request);

  // ✅ Si la demande est acceptée, mettre à jour le nombre de places
  if (dto.status === 'accepte') {
    const carpool = request.carpool;

    if (carpool.available_seats <= 0) {
      throw new ForbiddenException('Plus de places disponibles');
    }

    carpool.available_seats -= 1;

    await this.carpoolRepo.save(carpool);
  }

  // ✅ Notifier uniquement le demandeur
  this.carpoolGateway.notifyUser(
    request.user_id,
    'rideRequestResponse',
    {
      status: dto.status,
      carpool_id: request.carpool_id,
      request_id: request.id_request,
      remaining_seats: request.carpool.available_seats - (dto.status === 'accepte' ? 1 : 0),
    }
  );

  return updatedRequest;
}


  async createRideRequest(carpool_id: number,pickup_point:string, user_id: number) {
  const carpool = await this.carpoolRepo.findOne({ where: { id_carpool: carpool_id } });
  if (!carpool) throw new NotFoundException('Trajet introuvable');

  if (carpool.status !== 'planifie') {
    throw new ForbiddenException('Ce trajet n’est pas disponible pour une demande');
  }
  
  const rideRequest = this.rideRequestRepo.create({
    carpool_id:carpool_id,
    user_id:user_id,
    status: 'en_attente',
    pickup_point: pickup_point,
    requested_at: new Date(),
  });
  console.log(rideRequest);
  
  const savedRequest = await this.rideRequestRepo.save(rideRequest);

  const user = await this.userRepo.findOne({ where: { id_user: user_id } });
  if (!user) throw new NotFoundException('Utilisateur introuvable');


  this.carpoolGateway.notifyUser(
    carpool.driver_id,
    'newRideRequest',
    {
      rideRequestId: savedRequest.id_request,
      carpool_id,
      user:{ id: user.id_user, email: user.email, phone: user.phone, pickup_point:pickup_point,heure:"17:00" },
    }
  );
  console.log("Notification envoyée au conducteur");
  return savedRequest;
}
async getPendingRequestsForDriver(driver_id: number) {
  return this.rideRequestRepo.find({
    where: {
      status: 'en_attente',
      carpool: {
        driver_id: driver_id,   // IMPORTANT !
      }
    },
    relations: ['carpool', 'user'],
  });
}


  async deleteCarpool(id: number, driver_id: number) {
    const carpool = await this.carpoolRepo.findOne({ where: { id_carpool: id } });
    if (!carpool) throw new NotFoundException('Trajet introuvable');
    if (carpool.driver_id !== driver_id)
      throw new ForbiddenException('Suppression non autorisée');

    return this.carpoolRepo.remove(carpool);
  }
  async updateCarpoolStatus(
    id_carpool: number,
    driver_id: number,
    status: CarpoolStatus
  ): Promise<Carpool> {
    const carpool = await this.carpoolRepo.findOne({
      where: { id_carpool },
    });

    if (!carpool) {
      throw new NotFoundException('Carpool introuvable');
    }

    if (carpool.driver_id !== driver_id) {
      throw new ForbiddenException('Vous ne pouvez pas modifier ce trajet');
    }

    carpool.status = status; // "en_cours", "terminé", "annulé", etc.
    if (status == 'en_cours') {
      //Envoie de notification via Notification PUsh ou SMS
    }
    return this.carpoolRepo.save(carpool);
  }
  async getAcceptedRequests(carpoolId: number) {
    const requests = await this.rideRequestRepo.find({
      where: {
        carpool: { id_carpool: carpoolId },
        status: 'accepte',
      },
      relations: ['user'],
      order: { requested_at: 'ASC' },
    });

    return requests.map((r) => ({
      id: r.id_request,
      pickupPoint: r.pickup_point,
      user: {
        id: r.user.id_user,
        name: r.user.full_name,
        phone: r.user.phone,
        email: r.user.email,
      },
    }));
  }
}
