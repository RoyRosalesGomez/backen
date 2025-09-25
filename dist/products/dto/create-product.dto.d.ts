import { ProductCategory } from '../entities/product.entity';
export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    unit: string;
    stock: number;
    image: string;
    category: ProductCategory;
    farmerId: number;
}
