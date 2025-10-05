import { BitacoraService } from './bitacora.service';
import { CreateBitacoraDto } from './dto/create-bitacora.dto';
import { UpdateBitacoraDto } from './dto/update-bitacora.dto';
export declare class BitacoraController {
    private readonly bitacoraService;
    constructor(bitacoraService: BitacoraService);
    create(dto: CreateBitacoraDto, req: any): Promise<import("./entities/bitacora.entity").BitacoraEntry>;
    findAll(farmerId?: number): Promise<import("./entities/bitacora.entity").BitacoraEntry[]>;
    findOne(id: string): Promise<import("./entities/bitacora.entity").BitacoraEntry>;
    update(id: string, dto: UpdateBitacoraDto): Promise<import("./entities/bitacora.entity").BitacoraEntry>;
    remove(id: string): Promise<void>;
}
