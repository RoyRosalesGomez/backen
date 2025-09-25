import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    iva: number;
    total: number;
    status: OrderStatus;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    customer: User;
    product: Product;
}
