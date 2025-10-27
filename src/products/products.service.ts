import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus, ProductCategory } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private readonly activity: ActivityService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
  const product = this.productsRepository.create({
    ...createProductDto,
    farmer: { id: createProductDto.farmerId } as any,
    status: ProductStatus.PENDING,
    active: false, // 👈 cuando se crea, arranca inactivo
  });

  const saved = await this.productsRepository.save(product);

  await this.activity.log({
    type: 'PRODUCT_SUBMITTED',
    title: 'Producto enviado a revisión',
    description: `${saved.name} fue enviado por el agricultor #${createProductDto.farmerId}`,
    meta: { productId: saved.id, farmerId: createProductDto.farmerId, status: saved.status },
  });

  return saved;
}

async approve(id: number): Promise<Product> {
  const product = await this.findOne(id);
  product.status = ProductStatus.APPROVED;
  product.active = true; // 👈 se activa al aprobar
  await this.productsRepository.save(product);

  await this.activity.deleteProductStatusHistory(product.id);
  await this.activity.log({
    type: 'PRODUCT_APPROVED',
    title: 'Producto aprobado',
    description: `${product.name} fue aprobado`,
    meta: { productId: product.id, status: product.status, active: product.active },
  });

  return product;
}

async reject(id: number): Promise<Product> {
  const product = await this.findOne(id);
  product.status = ProductStatus.REJECTED;
  product.active = false; // 👈 se desactiva al rechazar
  await this.productsRepository.save(product);

  await this.activity.deleteProductStatusHistory(product.id);
  await this.activity.log({
    type: 'PRODUCT_REJECTED',
    title: 'Producto rechazado',
    description: `${product.name} fue rechazado`,
    meta: { productId: product.id, status: product.status, active: product.active },
  });

  return product;
}

async toggleActive(id: number): Promise<Product> {
  const product = await this.findOne(id);
  const updated = await this.update(id, { active: !product.active });

  await this.activity.log({
    type: 'PRODUCT_SUBMITTED', // si prefieres, crea un tipo 'PRODUCT_TOGGLED'
    title: 'Producto activado/desactivado',
    description: `${updated.name} se ${updated.active ? 'activó' : 'desactivó'}`,
    meta: { productId: updated.id, active: updated.active },
  });

  return updated;
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

  // async approve(id: number): Promise<Product> {
  //   return this.update(id, { status: ProductStatus.APPROVED });
  // }

  // async reject(id: number): Promise<Product> {
  //   return this.update(id, { status: ProductStatus.REJECTED });
  // }

  // async toggleActive(id: number): Promise<Product> {
  //   const product = await this.findOne(id);
  //   return this.update(id, { active: !product.active });
  // }

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