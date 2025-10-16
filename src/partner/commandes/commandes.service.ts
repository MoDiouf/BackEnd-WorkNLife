import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commande } from './commandes.entity';
import { CreateCommandeDto } from './commandes.dto';
import { Menu } from 'src/partner/menu/menu.entity';

@Injectable()
export class CommandesService {
  constructor(
    @InjectRepository(Commande)
    private commandeRepo: Repository<Commande>,

    @InjectRepository(Menu)
    private menuRepo: Repository<Menu>,
  ) {}

  async createCommande(dto: CreateCommandeDto) {
    const { user_id, partner_id, menu_id, quantity } = dto;

    const menu = await this.menuRepo.findOne({ where: { id_menu: menu_id } });
    if (!menu) throw new BadRequestException('Menu introuvable');

    const total_amount = Number(menu.price) * quantity;
const partner_idd = menu.partner_id;
    const commande = this.commandeRepo.create({
      user_id,
      partner_id: partner_idd,
      menu_id,
      quantity,
      total_amount,
      status: 'en_attente',
    });

    await this.commandeRepo.save(commande);
    return { message: 'Commande créée avec succès ✅', commande };
  }

  async getCommandesByPartner(partner_id: number) {
    return this.commandeRepo.find({
      where: { partner_id },
      relations: ['menu', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  async getCommandesByUser(user_id: number) {
    return this.commandeRepo.find({
      where: { user_id },
      relations: ['menu', 'partner'],
      order: { created_at: 'DESC' },
    });
  }

  async updateCommandeStatus(id_commande: number, statut: 'en_attente' | 'en_cours' | 'en_cours_livraison' | 'livre' | 'annule', partner_id: number) {
  const commande = await this.commandeRepo.findOne({
    where: { id_commande },
    relations: ['partner'], // si tu as la relation
  });
  if (statut == 'en_cours') {
    //this.sendNotificationToUser(commande.user_id, 'Votre commande est en cours de préparation.');
    //this.gtDeliveryPersonForCommande(commande.id_commande, lieux);
  }else if (statut == 'livre') {
    //this.sendNotificationToUser(commande.user_id, 'Votre commande a été livrée.');
  }else if (statut == 'annule') {
    //this.sendNotificationToUser(commande.user_id, 'Votre commande a été annulée.');
  }else if (statut == 'en_cours_livraison') {
    //this.sendNotificationToUser(commande.user_id, 'Votre commande est en cours de livraison.');
  }
  if (!commande) {
    throw new NotFoundException('Commande introuvable');
  }

  // Vérifie que la commande appartient bien au partenaire connecté
  if (commande.partner_id !== partner_id) {
    throw new ForbiddenException('Vous ne pouvez modifier que vos propres commandes');
  }
  
  commande.status = statut;

  return this.commandeRepo.save(commande);
}

}
