import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import type { ActivityType } from './activity.entity';
type LogPayload = {
    type: ActivityType;
    title: string;
    description: string;
    meta?: Record<string, any>;
};
export declare class ActivityService {
    private readonly repo;
    constructor(repo: Repository<Activity>);
    log(payload: LogPayload): Promise<Activity>;
    deleteProductStatusHistory(productId: number): Promise<void>;
    deleteVetShopToggleHistory(vetShopId: number): Promise<void>;
    deleteUserStatusHistory(userId: number): Promise<void>;
    private IMPORTANT;
    getRecentCompacted(days?: number, limit?: number): Promise<Activity[]>;
}
export {};
