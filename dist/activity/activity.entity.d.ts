export type ActivityType = 'USER_CREATED' | 'USER_STATUS_CHANGED' | 'PRODUCT_SUBMITTED' | 'PRODUCT_APPROVED' | 'PRODUCT_REJECTED' | 'VETSHOP_CREATED' | 'VETSHOP_TOGGLED';
export declare class Activity {
    id: number;
    type: ActivityType;
    title: string;
    description: string;
    meta?: Record<string, any>;
    createdAt: Date;
}
