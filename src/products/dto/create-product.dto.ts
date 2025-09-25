import { IsString, IsNumber, IsEnum, IsOptional, IsUrl, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'Chayotes Frescos' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Chayotes frescos cultivados orgánicamente' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'unidad' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsUrl()
  image: string;

  @ApiProperty({ enum: ProductCategory, example: ProductCategory.VERDURAS })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ example: 1 })
  @IsNumber()
  farmerId: number;
}