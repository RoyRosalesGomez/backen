import { User } from '../../users/entities/user.entity';
export declare class BitacoraEntry {
    id: number;
    tipoActividad: string;
    tipoCultivo: string;
    fechaInicio: Date;
    fechaFin: Date;
    detalle: string;
    lote: string;
    observaciones: string;
    cantidad: string;
    createdAt: Date;
    updatedAt: Date;
    farmer: User;
}
