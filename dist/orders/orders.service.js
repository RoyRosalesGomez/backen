"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    constructor(ordersRepository, productsService) {
        this.ordersRepository = ordersRepository;
        this.productsService = productsService;
    }
    async create(createOrderDto) {
        const product = await this.productsService.findOne(createOrderDto.productId);
        if (product.stock < createOrderDto.quantity) {
            throw new common_1.BadRequestException('Stock insuficiente');
        }
        const unitPrice = product.price;
        const subtotal = unitPrice * createOrderDto.quantity;
        const iva = subtotal * 0.13;
        const total = subtotal + iva;
        const order = this.ordersRepository.create({
            ...createOrderDto,
            product: { id: createOrderDto.productId },
            customer: { id: createOrderDto.customerId },
            unitPrice,
            subtotal,
            iva,
            total,
        });
        await this.productsService.update(product.id, {
            stock: product.stock - createOrderDto.quantity,
        });
        return this.ordersRepository.save(order);
    }
    async findAll(status, customerId, farmerId) {
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
    async findOne(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['customer', 'product', 'product.farmer'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Orden no encontrada');
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.findOne(id);
        Object.assign(order, updateOrderDto);
        return this.ordersRepository.save(order);
    }
    async updateStatus(id, status) {
        return this.update(id, { status });
    }
    async remove(id) {
        const order = await this.findOne(id);
        await this.ordersRepository.remove(order);
    }
    async getStatistics() {
        const total = await this.ordersRepository.count();
        const pending = await this.ordersRepository.count({ where: { status: order_entity_1.OrderStatus.PENDING } });
        const processing = await this.ordersRepository.count({ where: { status: order_entity_1.OrderStatus.PROCESSING } });
        const delivered = await this.ordersRepository.count({ where: { status: order_entity_1.OrderStatus.DELIVERED } });
        return {
            total,
            pending,
            processing,
            delivered,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map