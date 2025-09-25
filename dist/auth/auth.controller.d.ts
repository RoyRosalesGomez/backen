import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
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
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            lastName: string;
            email: string;
            phone: string;
            location: string;
            residence: string;
            role: import("../users/entities/user.entity").UserRole;
            status: import("../users/entities/user.entity").UserStatus;
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
