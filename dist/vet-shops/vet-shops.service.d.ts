import { Repository } from 'typeorm';
import { VetShop } from './entities/vet-shop.entity';
import { CreateVetShopDto } from './dto/create-vet-shop.dto';
import { UpdateVetShopDto } from './dto/update-vet-shop.dto';
export declare class VetShopsService {
    private vetShopsRepository;
    constructor(vetShopsRepository: Repository<VetShop>);
    create(createVetShopDto: CreateVetShopDto): Promise<VetShop>;
    findAll(active?: boolean): Promise<VetShop[]>;
    findActive(): Promise<VetShop[]>;
    findOne(id: number): Promise<VetShop>;
    update(id: number, updateVetShopDto: UpdateVetShopDto): Promise<VetShop>;
    remove(id: number): Promise<void>;
    toggleActive(id: number): Promise<VetShop>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
}
