import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './entities/order.entity';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<import("./entities/order.entity").Order>;
    findAll(status?: OrderStatus, customerId?: number, farmerId?: number): Promise<import("./entities/order.entity").Order[]>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        processing: number;
        delivered: number;
    }>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("./entities/order.entity").Order>;
    updateStatus(id: string, status: OrderStatus): Promise<import("./entities/order.entity").Order>;
    remove(id: string): Promise<void>;
}
