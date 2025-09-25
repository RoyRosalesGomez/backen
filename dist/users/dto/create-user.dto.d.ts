import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    residence: string;
    password: string;
    role: UserRole;
}
