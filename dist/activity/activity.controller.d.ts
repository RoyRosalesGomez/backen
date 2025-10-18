import { ActivityService } from './activity.service';
export declare class ActivityController {
    private readonly activity;
    constructor(activity: ActivityService);
    recent(sinceDays?: string, limit?: string): Promise<import("./activity.entity").Activity[]>;
    create(body: {
        type: any;
        title: string;
        description: string;
        meta?: Record<string, any>;
    }): Promise<import("./activity.entity").Activity>;
}
