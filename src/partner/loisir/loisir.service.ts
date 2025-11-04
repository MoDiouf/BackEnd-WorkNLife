import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PartnerProfile } from '../partner.entity';
import { LoisirActivity } from './loisir.entity';
import { CreateLoisirActivityDto, LoisirDTO, UpdateLoisirActivityDto } from './loisir.dto';

@Injectable()
export class LoisirService {
  constructor(
    @InjectRepository(LoisirActivity)
    private readonly activityRepo: Repository<LoisirActivity>,
    @InjectRepository(PartnerProfile)
    private readonly partnerRepo: Repository<PartnerProfile>,
  ) {}

  async addActivitiesToPartner(
    partnerId: number,
    activities: CreateLoisirActivityDto[],
  ): Promise<LoisirActivity[]> {
    const partner = await this.partnerRepo.findOne({ where: { id_partner: partnerId } });
    if (!partner) throw new NotFoundException('Partner not found');

    const newActivities = activities.map((act) => {
      const activity = this.activityRepo.create({
        ...act,
        partner_id: partnerId,
        partner,
      });
      return activity;
    });

    return await this.activityRepo.save(newActivities);
  }

  
  // --- Mise à jour d’une activité
  async updateActivity(partnerId: number, dto: UpdateLoisirActivityDto): Promise<LoisirActivity> {
    const activity = await this.activityRepo.findOne({ where: { id_activity: dto.id_activity } });
    if (!activity) throw new NotFoundException('Activity not found');
    if (activity.partner_id !== partnerId) throw new ForbiddenException('Access denied');

    Object.assign(activity, dto);
    return await this.activityRepo.save(activity);
  }

  // --- Suppression d’une ou plusieurs activités
  async deleteActivities(partnerId: number, ids: number[]): Promise<{ deleted: number }> {
    const activities = await this.activityRepo.findByIds(ids);

    if (!activities.length) throw new NotFoundException('No activities found');
    const unauthorized = activities.find((a) => a.partner_id !== partnerId);
    if (unauthorized) throw new ForbiddenException('Access denied');

    await this.activityRepo.remove(activities);
    return { deleted: activities.length };
  }
  async updateBoutik(partnerId: number, loisir: LoisirDTO): Promise<PartnerProfile> {
    const partner = await this.partnerRepo.findOne({ where: { id_partner: partnerId } });
    if (!partner) throw new NotFoundException('Partner not found');

    partner.partner_name = loisir.name ?? partner.partner_name;
    partner.description = loisir.description ?? partner.description;
    partner.address = loisir.adresse ?? partner.address;

    return await this.partnerRepo.save(partner);
  }
}

