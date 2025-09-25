import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const product = await this.productsService.findOne(createOrderDto.productId);

    if (product.stock < createOrderDto.quantity) {
      throw new BadRequestException('Stock insuficiente');
    }

    const unitPrice = product.price;
    const subtotal = unitPrice * createOrderDto.quantity;
    const iva = subtotal * 0.13; // 13% IVA
    const total = subtotal + iva;

    const order = this.ordersRepository.create({
      ...createOrderDto,
      product: { id: createOrderDto.productId } as any,
      customer: { id: createOrderDto.customerId } as any,
      unitPrice,
      subtotal,
      iva,
      total,
    });

    // Reducir stock del producto
    await this.productsService.update(product.id, {
      stock: product.stock - createOrderDto.quantity,
    });

    return this.ordersRepository.save(order);
  }

  async findAll(
    status?: OrderStatus,
    customerId?: number,
    farmerId?: number,
  ): Promise<Order[]> {
    const query = this.ordersRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('product.farmer', 'farmer');

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (customerId) {
      query.andWhere('order.customerId = :customerId', { customerId });
    }

    if (farmerId) {
      query.andWhere('farmer.id = :farmerId', { farmerId });
    }

    return query.orderBy('order.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer', 'product', 'product.farmer'],
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    return this.update(id, { status });
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  async getStatistics() {
    const total = await this.ordersRepository.count();
    const pending = await this.ordersRepository.count({ where: { status: OrderStatus.PENDING } });
    const processing = await this.ordersRepository.count({ where: { status: OrderStatus.PROCESSING } });
    const delivered = await this.ordersRepository.count({ where: { status: OrderStatus.DELIVERED } });

    return {
      total,
      pending,
      processing,
      delivered,
    };
  }
}