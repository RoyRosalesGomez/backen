import { Repository } from 'typeorm';
import { BitacoraEntry } from './entities/bitacora.entity';
import { CreateBitacoraDto } from './dto/create-bitacora.dto';
import { UpdateBitacoraDto } from './dto/update-bitacora.dto';
export declare class BitacoraService {
    private bitacoraRepository;
    constructor(bitacoraRepository: Repository<BitacoraEntry>);
    create(dto: CreateBitacoraDto, farmerId: number): Promise<BitacoraEntry>;
    findAll(farmerId?: number): Promise<BitacoraEntry[]>;
    findOne(id: number): Promise<BitacoraEntry>;
    update(id: number, dto: UpdateBitacoraDto): Promise<BitacoraEntry>;
    remove(id: number): Promise<void>;
}
