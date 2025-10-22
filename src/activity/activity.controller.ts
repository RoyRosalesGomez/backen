
// src/activity/activity.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activities: ActivityService) {}

  @Get()
  list(@Query('sinceDays') sinceDays?: string, @Query('limit') limit?: string) {
    const days = Number(sinceDays ?? 5);
    const lim  = Number(limit ?? 25);
    return this.activities.getRecentCompacted(days, lim);
  }
}
