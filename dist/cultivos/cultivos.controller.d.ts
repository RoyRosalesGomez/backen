import { CultivosService } from './cultivos.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
export declare class CultivosController {
    private readonly cultivosService;
    constructor(cultivosService: CultivosService);
    create(createCultivoDto: CreateCultivoDto): Promise<import("./entities/cultivo.entity").Cultivo>;
    findAll(farmerId?: number, active?: boolean): Promise<import("./entities/cultivo.entity").Cultivo[]>;
    findOne(id: string): Promise<import("./entities/cultivo.entity").Cultivo>;
    update(id: string, updateCultivoDto: UpdateCultivoDto): Promise<import("./entities/cultivo.entity").Cultivo>;
    toggleActive(id: string): Promise<import("./entities/cultivo.entity").Cultivo>;
    remove(id: string): Promise<void>;
}
