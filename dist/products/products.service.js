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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let ProductsService = class ProductsService {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async create(createProductDto) {
        const product = this.productsRepository.create({
            ...createProductDto,
            farmer: { id: createProductDto.farmerId },
            status: product_entity_1.ProductStatus.PENDING,
        });
        return this.productsRepository.save(product);
    }
    async findAll(status, category, farmerId, search) {
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
    async findApproved(category, search) {
        return this.findAll(product_entity_1.ProductStatus.APPROVED, category, undefined, search);
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['farmer'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        Object.assign(product, updateProductDto);
        return this.productsRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productsRepository.remove(product);
    }
    async approve(id) {
        return this.update(id, { status: product_entity_1.ProductStatus.APPROVED });
    }
    async reject(id) {
        return this.update(id, { status: product_entity_1.ProductStatus.REJECTED });
    }
    async toggleActive(id) {
        const product = await this.findOne(id);
        return this.update(id, { active: !product.active });
    }
    async getStatistics() {
        const total = await this.productsRepository.count();
        const pending = await this.productsRepository.count({ where: { status: product_entity_1.ProductStatus.PENDING } });
        const approved = await this.productsRepository.count({ where: { status: product_entity_1.ProductStatus.APPROVED } });
        const rejected = await this.productsRepository.count({ where: { status: product_entity_1.ProductStatus.REJECTED } });
        return {
            total,
            pending,
            approved,
            rejected,
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map