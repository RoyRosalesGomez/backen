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
exports.VetShopsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vet_shop_entity_1 = require("./entities/vet-shop.entity");
let VetShopsService = class VetShopsService {
    constructor(vetShopsRepository) {
        this.vetShopsRepository = vetShopsRepository;
    }
    async create(createVetShopDto) {
        const vetShop = this.vetShopsRepository.create(createVetShopDto);
        return this.vetShopsRepository.save(vetShop);
    }
    async findAll(active) {
        const query = this.vetShopsRepository.createQueryBuilder('vetShop');
        if (active !== undefined) {
            query.andWhere('vetShop.active = :active', { active });
        }
        return query.getMany();
    }
    async findActive() {
        return this.findAll(true);
    }
    async findOne(id) {
        const vetShop = await this.vetShopsRepository.findOne({ where: { id } });
        if (!vetShop) {
            throw new common_1.NotFoundException('Agro veterinaria no encontrada');
        }
        return vetShop;
    }
    async update(id, updateVetShopDto) {
        const vetShop = await this.findOne(id);
        Object.assign(vetShop, updateVetShopDto);
        return this.vetShopsRepository.save(vetShop);
    }
    async remove(id) {
        const vetShop = await this.findOne(id);
        await this.vetShopsRepository.remove(vetShop);
    }
    async toggleActive(id) {
        const vetShop = await this.findOne(id);
        return this.update(id, { active: !vetShop.active });
    }
    async getStatistics() {
        const total = await this.vetShopsRepository.count();
        const active = await this.vetShopsRepository.count({ where: { active: true } });
        const inactive = await this.vetShopsRepository.count({ where: { active: false } });
        return {
            total,
            active,
            inactive,
        };
    }
};
exports.VetShopsService = VetShopsService;
exports.VetShopsService = VetShopsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vet_shop_entity_1.VetShop)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VetShopsService);
//# sourceMappingURL=vet-shops.service.js.map