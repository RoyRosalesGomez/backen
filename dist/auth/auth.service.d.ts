import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole, UserStatus } from '../users/entities/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    private toUserRole;
    validateUser(email: string, password: string): Promise<{
        id: number;
        name: string;
        lastName: string;
        email: string;
        phone: string;
        location: string;
        residence: string;
        role: UserRole;
        status: UserStatus;
        canView: boolean;
        canEdit: boolean;
        isAdmin: boolean;
        createdAt: Date;
        updatedAt: Date;
        products: import("../products/entities/product.entity").Product[];
        orders: import("../orders/entities/order.entity").Order[];
        bitacoraEntries: import("../bitacora/entities/bitacora.entity").BitacoraEntry[];
        cultivos: import("../cultivos/entities/cultivo.entity").Cultivo[];
        propiedades: import("../propiedades/entities/propiedad.entity").Propiedad[];
    }>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            lastName: any;
            email: any;
            role: any;
            status: any;
        };
    }>;
    register(createUserDto: any): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            lastName: string;
            email: string;
            phone: string;
            location: string;
            residence: string;
            role: UserRole;
            status: UserStatus;
            canView: boolean;
            canEdit: boolean;
            isAdmin: boolean;
            createdAt: Date;
            updatedAt: Date;
            products: import("../products/entities/product.entity").Product[];
            orders: import("../orders/entities/order.entity").Order[];
            bitacoraEntries: import("../bitacora/entities/bitacora.entity").BitacoraEntry[];
            cultivos: import("../cultivos/entities/cultivo.entity").Cultivo[];
            propiedades: import("../propiedades/entities/propiedad.entity").Propiedad[];
        };
    }>;
}
