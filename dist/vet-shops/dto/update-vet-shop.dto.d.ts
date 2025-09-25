import { CreateVetShopDto } from './create-vet-shop.dto';
declare const UpdateVetShopDto_base: import("@nestjs/common").Type<Partial<CreateVetShopDto>>;
export declare class UpdateVetShopDto extends UpdateVetShopDto_base {
    active?: boolean;
}
export {};
