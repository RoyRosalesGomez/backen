import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus, ProductCategory } from './entities/product.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    findAll(status?: ProductStatus, category?: ProductCategory, farmerId?: number, search?: string): Promise<import("./entities/product.entity").Product[]>;
    findApproved(category?: ProductCategory, search?: string): Promise<import("./entities/product.entity").Product[]>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    }>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./entities/product.entity").Product>;
    approve(id: string): Promise<import("./entities/product.entity").Product>;
    reject(id: string): Promise<import("./entities/product.entity").Product>;
    toggleActive(id: string): Promise<import("./entities/product.entity").Product>;
    remove(id: string): Promise<void>;
}
