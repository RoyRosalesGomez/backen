import { User } from '../../users/entities/user.entity';
export declare class Cultivo {
    id: number;
    name: string;
    variedad: string;
    comentario: string;
    image: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    farmer: User;
}
