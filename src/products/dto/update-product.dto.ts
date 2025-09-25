import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { ProductStatus } from '../entities/product.entity';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  rating?: number;
}