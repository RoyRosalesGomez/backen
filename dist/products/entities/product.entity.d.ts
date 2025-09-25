import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
export declare enum ProductStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare enum ProductCategory {
    FRUTAS = "frutas",
    VERDURAS = "verduras",
    GRANOS = "granos",
    OTROS = "otros"
}
export declare class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    unit: string;
    stock: number;
    image: string;
    category: ProductCategory;
    status: ProductStatus;
    active: boolean;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
    farmer: User;
    orders: Order[];
}
