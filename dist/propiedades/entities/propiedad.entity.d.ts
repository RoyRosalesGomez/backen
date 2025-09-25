import { User } from '../../users/entities/user.entity';
export declare class Propiedad {
    id: number;
    nombre: string;
    localizacion: string;
    tamano: string;
    comentario: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    farmer: User;
}
