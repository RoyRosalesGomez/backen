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
exports.BitacoraService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bitacora_entity_1 = require("./entities/bitacora.entity");
let BitacoraService = class BitacoraService {
    constructor(bitacoraRepository) {
        this.bitacoraRepository = bitacoraRepository;
    }
    async create(createBitacoraDto) {
        const entry = this.bitacoraRepository.create({
            ...createBitacoraDto,
            farmer: { id: createBitacoraDto.farmerId },
        });
        return this.bitacoraRepository.save(entry);
    }
    async findAll(farmerId) {
        const query = this.bitacoraRepository.createQueryBuilder('entry')
            .leftJoinAndSelect('entry.farmer', 'farmer');
        if (farmerId) {
            query.andWhere('entry.farmerId = :farmerId', { farmerId });
        }
        return query.orderBy('entry.fechaInicio', 'DESC').getMany();
    }
    async findOne(id) {
        const entry = await this.bitacoraRepository.findOne({
            where: { id },
            relations: ['farmer'],
        });
        if (!entry) {
            throw new common_1.NotFoundException('Entrada de bitácora no encontrada');
        }
        return entry;
    }
    async update(id, updateBitacoraDto) {
        const entry = await this.findOne(id);
        Object.assign(entry, updateBitacoraDto);
        return this.bitacoraRepository.save(entry);
    }
    async remove(id) {
        const entry = await this.findOne(id);
        await this.bitacoraRepository.remove(entry);
    }
};
exports.BitacoraService = BitacoraService;
exports.BitacoraService = BitacoraService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bitacora_entity_1.BitacoraEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BitacoraService);
//# sourceMappingURL=bitacora.service.js.map