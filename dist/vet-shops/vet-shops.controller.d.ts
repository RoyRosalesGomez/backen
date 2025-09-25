import { VetShopsService } from './vet-shops.service';
import { CreateVetShopDto } from './dto/create-vet-shop.dto';
import { UpdateVetShopDto } from './dto/update-vet-shop.dto';
export declare class VetShopsController {
    private readonly vetShopsService;
    constructor(vetShopsService: VetShopsService);
    create(createVetShopDto: CreateVetShopDto): Promise<import("./entities/vet-shop.entity").VetShop>;
    findAll(active?: boolean): Promise<import("./entities/vet-shop.entity").VetShop[]>;
    findActive(): Promise<import("./entities/vet-shop.entity").VetShop[]>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
    findOne(id: string): Promise<import("./entities/vet-shop.entity").VetShop>;
    update(id: string, updateVetShopDto: UpdateVetShopDto): Promise<import("./entities/vet-shop.entity").VetShop>;
    toggleActive(id: string): Promise<import("./entities/vet-shop.entity").VetShop>;
    remove(id: string): Promise<void>;
}
