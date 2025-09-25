import { Repository } from 'typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
export declare class CultivosService {
    private cultivosRepository;
    constructor(cultivosRepository: Repository<Cultivo>);
    create(createCultivoDto: CreateCultivoDto): Promise<Cultivo>;
    findAll(farmerId?: number, active?: boolean): Promise<Cultivo[]>;
    findOne(id: number): Promise<Cultivo>;
    update(id: number, updateCultivoDto: UpdateCultivoDto): Promise<Cultivo>;
    remove(id: number): Promise<void>;
    toggleActive(id: number): Promise<Cultivo>;
}
