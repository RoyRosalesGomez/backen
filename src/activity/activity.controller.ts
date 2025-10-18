import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activity: ActivityService) {}

  @Get()
  recent(
    @Query('sinceDays') sinceDays?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activity.recent(Number(sinceDays ?? 5), Number(limit ?? 25));
  }

  // útil si quieres registrar manualmente desde Postman
  @Post()
  create(
    @Body()
    body: {
      type: any; // Activity['type']
      title: string;
      description: string;
      meta?: Record<string, any>;
    },
  ) {
    return this.activity.log(body);
  }
}
