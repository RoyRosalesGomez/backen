import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Activity } from './activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly repo: Repository<Activity>,
  ) {}

  async log(params: {
    type: Activity['type'];
    title: string;
    description: string;
    meta?: Record<string, any>;
  }) {
    const row = this.repo.create(params);
    return this.repo.save(row);
  }

  async recent(sinceDays = 5, limit = 25) {
    const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);
    return this.repo.find({
      where: { createdAt: MoreThanOrEqual(since) },
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 100),
    });
  }

  // opcional: purgar viejas
  async purgeOlderThan(days = 5) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    await this.repo
      .createQueryBuilder()
      .delete()
      .from(Activity)
      .where('createdAt < :cutoff', { cutoff })
      .execute();
  }
}
