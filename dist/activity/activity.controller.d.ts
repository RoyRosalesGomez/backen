import { ActivityService } from './activity.service';
export declare class ActivityController {
    private readonly activities;
    constructor(activities: ActivityService);
    list(sinceDays?: string, limit?: string): Promise<import("./activity.entity").Activity[]>;
}
