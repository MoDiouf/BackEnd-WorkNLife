import { PaymentController } from './../payment/payment.controller';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { User } from 'src/users/users.entity';
import { PartnerPortalTemplate, PartnerProfile } from 'src/partner/partner.entity';
import { CreateReservationDto } from './reservation.dto';


@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(PartnerProfile)
    private partnerRepo: Repository<PartnerProfile>,
    @InjectRepository(PartnerPortalTemplate)
    private partnerTemplateRepo: Repository<PartnerPortalTemplate>,
  ) {}

async createReservation(dto: CreateReservationDto) {
    const user = await this.userRepo.findOne({ where: { id_user: dto.user_id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const partner = await this.partnerRepo.findOne({
      where: { id_partner: dto.partner_id },
      relations: ['partner_type'], // 🔹 charger la relation
    });
    if (!partner) throw new NotFoundException('Partenaire introuvable');

    // Vérifie que le type de réservation correspond au type de partenaire
    if (!partner.partner_type || partner.partner_type.partner_type !== dto.reservation_type) {
      throw new NotFoundException('Type de partenaire invalide pour cette réservation');
    }

    const reservation = this.reservationRepo.create({
      user,
      partner,
      reservation_type: dto.reservation_type,
      reservation_price: dto.reservation_price || undefined,
      status: 'en_attente',
    });
    //Initialiser le paiement ici apres.


    return await this.reservationRepo.save(reservation);
  }


  async getPartnerReservations(partner_id: number) {
    const partner = await this.partnerRepo.findOne({
      where: { id_partner: partner_id },
      relations: ['reservations'], // 🔹 récupère toutes les réservations liées
    });

    if (!partner) throw new NotFoundException('Partenaire introuvable');

    return partner.reservations;
  }

  async updateReservationStatus(reservation_id: number, status: 'en_attente' | 'confirme' | 'annule') {
    const reservation = await this.reservationRepo.findOne({ where: { id_reservation: reservation_id } });

    if (!reservation) throw new NotFoundException('Réservation introuvable');

    reservation.status = status;
    return await this.reservationRepo.save(reservation);
  }
}


