import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PartnerProfile } from 'src/partner/partner.entity';
import { PartnerPortalTemplate } from 'src/partner/partner.entity';
import { HealthyActivity } from './healty.entity';
import { CreateHealthyActivityDto, UpdateHealthyShopPriceDto } from './healty.dto';
@Injectable()
export class HealtyService {
  constructor(
    @InjectRepository(PartnerProfile)
    private readonly partnerRepo: Repository<PartnerProfile>,

    @InjectRepository(PartnerPortalTemplate)
    private readonly templateRepo: Repository<PartnerPortalTemplate>,

    @InjectRepository(HealthyActivity)
    private readonly activityRepo: Repository<HealthyActivity>,
    private dataSource: DataSource,
  ) {}

  // healty.service.ts
async updateShopPrice(partnerId: number, dto: UpdateHealthyShopPriceDto) {
  const partner = await this.partnerRepo.findOne({ where: { id_partner: partnerId } });
  if (!partner) {
    throw new NotFoundException('Boutique introuvable');
  }

  if (dto.price_per_session !== undefined) partner.price_per_session = dto.price_per_session;
  if (dto.price_per_month !== undefined) partner.price_per_month = dto.price_per_month;

  return await this.partnerRepo.save(partner);
}
    async addActivity(partnerId: number, dto: CreateHealthyActivityDto) {
    const partner = await this.partnerRepo.findOne({ where: { id_partner: partnerId } });
    if (!partner) throw new NotFoundException('Boutique introuvable');

    const activity = this.activityRepo.create({
      ...dto,
      partner,
      available: dto.available ?? true,
    });

    return await this.activityRepo.save(activity);
  }
}
