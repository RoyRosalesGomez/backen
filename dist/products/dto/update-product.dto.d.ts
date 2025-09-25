import { CreateProductDto } from './create-product.dto';
import { ProductStatus } from '../entities/product.entity';
declare const UpdateProductDto_base: import("@nestjs/common").Type<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
    status?: ProductStatus;
    active?: boolean;
    rating?: number;
}
export {};
