import { Repository } from 'typeorm';
import { Product, ProductStatus, ProductCategory } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(status?: ProductStatus, category?: ProductCategory, farmerId?: number, search?: string): Promise<Product[]>;
    findApproved(category?: ProductCategory, search?: string): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<void>;
    approve(id: number): Promise<Product>;
    reject(id: number): Promise<Product>;
    toggleActive(id: number): Promise<Product>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    }>;
}
