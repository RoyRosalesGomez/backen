import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
export declare class OrdersService {
    private ordersRepository;
    private productsService;
    constructor(ordersRepository: Repository<Order>, productsService: ProductsService);
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(status?: OrderStatus, customerId?: number, farmerId?: number): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order>;
    updateStatus(id: number, status: OrderStatus): Promise<Order>;
    remove(id: number): Promise<void>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        processing: number;
        delivered: number;
    }>;
}
