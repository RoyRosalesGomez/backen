import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
export declare class ActivityService {
    private readonly repo;
    constructor(repo: Repository<Activity>);
    log(params: {
        type: Activity['type'];
        title: string;
        description: string;
        meta?: Record<string, any>;
    }): Promise<Activity>;
    recent(sinceDays?: number, limit?: number): Promise<Activity[]>;
    purgeOlderThan(days?: number): Promise<void>;
}
