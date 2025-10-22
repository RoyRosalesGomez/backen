
// src/activity/activity.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Activity } from './activity.entity';
import type { ActivityType } from './activity.entity'; // tu union de tipos

type LogPayload = {
  type: ActivityType;
  title: string;
  description: string;
  meta?: Record<string, any>;
};

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly repo: Repository<Activity>,
  ) {}

  // Método que usan tus otros services (users, products, vet-shops)
  async log(payload: LogPayload): Promise<Activity> {
    const entity = this.repo.create({
      type: payload.type,
      title: payload.title,
      description: payload.description,
      meta: payload.meta ?? null,
    });
    return this.repo.save(entity);
  }

  // Helpers para “barrer” logs previos del mismo recurso (opuestos/duplicados)
  async deleteProductStatusHistory(productId: number) {
    await this.repo.createQueryBuilder()
      .delete()
      .from(Activity)
      .where(`type IN (:...types) AND meta LIKE :needle`, {
        types: ['PRODUCT_APPROVED', 'PRODUCT_REJECTED'],
        needle: `%\"productId\":${productId}%`,
      })
      .execute();
  }

  async deleteVetShopToggleHistory(vetShopId: number) {
    await this.repo.createQueryBuilder()
      .delete()
      .from(Activity)
      .where(`type = :type AND meta LIKE :needle`, {
        type: 'VETSHOP_TOGGLED',
        needle: `%\"vetShopId\":${vetShopId}%`,
      })
      .execute();
  }

  async deleteUserStatusHistory(userId: number) {
    await this.repo.createQueryBuilder()
      .delete()
      .from(Activity)
      .where(`type = :type AND meta LIKE :needle`, {
        type: 'USER_STATUS_CHANGED',
        needle: `%\"userId\":${userId}%`,
      })
      .execute();
  }

  // Tipos “importantes” que sí mostramos en el feed
  private IMPORTANT: Activity['type'][] = [
    'USER_CREATED',
    'USER_STATUS_CHANGED',
    'PRODUCT_SUBMITTED',   // opcional
    'PRODUCT_APPROVED',
    'PRODUCT_REJECTED',
    'VETSHOP_CREATED',
    'VETSHOP_TOGGLED',
  ];

  // Devuelve sólo el último evento por recurso (compactado)
  async getRecentCompacted(days = 5, limit = 25): Promise<Activity[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const raw = await this.repo.find({
      where: { createdAt: MoreThan(since) },
      order: { createdAt: 'DESC' },
      take: 400, // cogemos “de más” para poder compactar
    });

    const filtered = raw.filter(a => this.IMPORTANT.includes(a.type));

    const seen = new Set<string>();
    const compacted: Activity[] = [];

    for (const a of filtered) {
      const m = a.meta || {};
      let key: string | null = null;

      if (a.type.startsWith('USER_') && m.userId) key = `user:${m.userId}`;
      else if (a.type.startsWith('PRODUCT_') && m.productId) key = `product:${m.productId}`;
      else if (a.type.startsWith('VETSHOP_') && m.vetShopId) key = `vetshop:${m.vetShopId}`;

      if (!key) {
        compacted.push(a);
        if (compacted.length >= limit) break;
        continue;
      }

      if (seen.has(key)) continue;
      seen.add(key);
      compacted.push(a);
      if (compacted.length >= limit) break;
    }

    return compacted;
  }
}

