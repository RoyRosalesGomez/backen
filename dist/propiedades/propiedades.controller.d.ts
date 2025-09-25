import { PropiedadesService } from './propiedades.service';
import { CreatePropiedadDto } from './dto/create-propiedad.dto';
import { UpdatePropiedadDto } from './dto/update-propiedad.dto';
export declare class PropiedadesController {
    private readonly propiedadesService;
    constructor(propiedadesService: PropiedadesService);
    create(createPropiedadDto: CreatePropiedadDto): Promise<import("./entities/propiedad.entity").Propiedad>;
    findAll(farmerId?: number, active?: boolean): Promise<import("./entities/propiedad.entity").Propiedad[]>;
    findOne(id: string): Promise<import("./entities/propiedad.entity").Propiedad>;
    update(id: string, updatePropiedadDto: UpdatePropiedadDto): Promise<import("./entities/propiedad.entity").Propiedad>;
    toggleActive(id: string): Promise<import("./entities/propiedad.entity").Propiedad>;
    remove(id: string): Promise<void>;
}
