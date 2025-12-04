import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { PartnerProfile } from '../partner.entity';
import { CreateMultiMenuDto, UpdateMenuDto } from './menu.dto';


@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepo: Repository<Menu>,

    @InjectRepository(PartnerProfile)
    private partnerRepo: Repository<PartnerProfile>,
  ) {}

  async createWeeklyMenus(dto: CreateMultiMenuDto) {
    const { partner_id, menus } = dto;

    const partner = await this.partnerRepo.findOne({
      where: { id_partner: partner_id },
      relations: ['partner_type'],
    });
    if (!partner) throw new BadRequestException('Partenaire non trouvé');
    if (partner.partner_type.partner_type !== 'restaurant') {
      throw new BadRequestException('Seuls les restaurants peuvent créer des menus');
    }

    const allMenus: Menu[] = [];

    for (const dayMenu of menus) {
      const { day, breakfast, lunch } = dayMenu;

      const meals = [...(breakfast || []), ...(lunch || [])];

      for (const meal of meals) {
        const newMenu = this.menuRepo.create({
          partner_id,
          day,
          name: meal.name,
          description: meal.description,
          price: meal.price,
          meal_type: meal.meal_type,
        });
        allMenus.push(newMenu);
      }
    }

    await this.menuRepo.save(allMenus);

    return {
      message: `${allMenus.length} menus créés pour le partenaire ${partner_id}`,
      menus: allMenus,
    };
  }

  async getMenusByPartner(partner_id: number) {
  // Récupération de tous les menus du partenaire
  const menus = await this.menuRepo.find({
    where: { partner_id },
    order: { day: 'ASC', meal_type: 'ASC' },
  });

  if (menus.length === 0)
    throw new BadRequestException('Aucun menu trouvé pour ce partenaire');

  // Regrouper les menus par jour et type de repas
  const grouped: Record<string, any> = {};

  for (const menu of menus) {
    if (!grouped[menu.day]) {
      grouped[menu.day] = { breakfast: [], lunch: [] };
    }

    grouped[menu.day][menu.meal_type].push({
      id_menu: menu.id_menu,
      name: menu.name,
      description: menu.description,
      price: menu.price,
      available: menu.available,
      created_at: menu.created_at,
      updated_at: menu.updated_at,
    });
  }

  return {
    partner_id,
    message: `Menus proposés par le partenaire ${partner_id}`,
    menus: Object.entries(grouped).map(([day, data]) => ({
      day,
      breakfast: data.breakfast,
      lunch: data.lunch,
    })),
  };
}
  async updateMenu(partner_id: number, id_menu: number, dto: UpdateMenuDto) {
    const menu = await this.menuRepo.findOne({ where: { id_menu, partner_id } });
    if (!menu) throw new NotFoundException('Menu non trouvé ou pas accessible');

    Object.assign(menu, dto); // met à jour seulement les champs présents dans dto

    return this.menuRepo.save(menu);
  }
  async getAllMenus() {
    const menus = await this.menuRepo.find({
      relations: ['partner'],
      order: { day: 'ASC', meal_type: 'ASC' },
    });

    
    return {
      message: `Liste de tous les menus (${menus.length})`,
      menus,
    };
  }
  async deleteMenu(partner_id: number, id_menu: number) {
    const menu = await this.menuRepo.findOne({ where: { id_menu, partner_id } });
    if (!menu) throw new NotFoundException('Menu non trouvé ou pas accessible');

    await this.menuRepo.remove(menu);

    return { message: 'Menu supprimé avec succès' };
  }
}