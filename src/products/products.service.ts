import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus, ProductCategory } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create({
      ...createProductDto,
      farmer: { id: createProductDto.farmerId } as any,
      status: ProductStatus.PENDING,
    });

    return this.productsRepository.save(product);
  }

  async findAll(
    status?: ProductStatus,
    category?: ProductCategory,
    farmerId?: number,
    search?: string,
  ): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.farmer', 'farmer');

    if (status) {
      query.andWhere('product.status = :status', { status });
    }

    if (category) {
      query.andWhere('product.category = :category', { category });
    }

    if (farmerId) {
      query.andWhere('product.farmerId = :farmerId', { farmerId });
    }

    if (search) {
      query.andWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    return query.getMany();
  }

  async findApproved(category?: ProductCategory, search?: string): Promise<Product[]> {
    return this.findAll(ProductStatus.APPROVED, category, undefined, search);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['farmer'],
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async approve(id: number): Promise<Product> {
    return this.update(id, { status: ProductStatus.APPROVED });
  }

  async reject(id: number): Promise<Product> {
    return this.update(id, { status: ProductStatus.REJECTED });
  }

  async toggleActive(id: number): Promise<Product> {
    const product = await this.findOne(id);
    return this.update(id, { active: !product.active });
  }

  async getStatistics() {
    const total = await this.productsRepository.count();
    const pending = await this.productsRepository.count({ where: { status: ProductStatus.PENDING } });
    const approved = await this.productsRepository.count({ where: { status: ProductStatus.APPROVED } });
    const rejected = await this.productsRepository.count({ where: { status: ProductStatus.REJECTED } });

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }
}