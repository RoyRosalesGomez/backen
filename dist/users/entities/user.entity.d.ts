import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
import { BitacoraEntry } from '../../bitacora/entities/bitacora.entity';
import { Cultivo } from '../../cultivos/entities/cultivo.entity';
import { Propiedad } from '../../propiedades/entities/propiedad.entity';
export declare enum UserRole {
    CLIENT = "client",
    FARMER = "farmer",
    ADMIN = "admin"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending"
}
export declare class User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    residence: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    canView: boolean;
    canEdit: boolean;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
    orders: Order[];
    bitacoraEntries: BitacoraEntry[];
    cultivos: Cultivo[];
    propiedades: Propiedad[];
}
