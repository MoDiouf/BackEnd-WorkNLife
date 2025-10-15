import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { PartnerProfile } from '../partner.entity';
import { CreateMultiMenuDto } from './menu.dto';


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
}
