import { Repository } from 'typeorm';
import { Propiedad } from './entities/propiedad.entity';
import { CreatePropiedadDto } from './dto/create-propiedad.dto';
import { UpdatePropiedadDto } from './dto/update-propiedad.dto';
export declare class PropiedadesService {
    private propiedadesRepository;
    constructor(propiedadesRepository: Repository<Propiedad>);
    create(dto: CreatePropiedadDto): Promise<Propiedad>;
    findAll(farmerId?: number, active?: boolean): Promise<Propiedad[]>;
    findOne(id: number): Promise<Propiedad>;
    update(id: number, dto: UpdatePropiedadDto): Promise<Propiedad>;
    remove(id: number): Promise<void>;
    toggleActive(id: number): Promise<Propiedad>;
}
