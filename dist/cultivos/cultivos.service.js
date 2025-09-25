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
exports.CultivosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cultivo_entity_1 = require("./entities/cultivo.entity");
let CultivosService = class CultivosService {
    constructor(cultivosRepository) {
        this.cultivosRepository = cultivosRepository;
    }
    async create(createCultivoDto) {
        const cultivo = this.cultivosRepository.create({
            ...createCultivoDto,
            farmer: { id: createCultivoDto.farmerId },
        });
        return this.cultivosRepository.save(cultivo);
    }
    async findAll(farmerId, active) {
        const query = this.cultivosRepository.createQueryBuilder('cultivo')
            .leftJoinAndSelect('cultivo.farmer', 'farmer');
        if (farmerId) {
            query.andWhere('cultivo.farmerId = :farmerId', { farmerId });
        }
        if (active !== undefined) {
            query.andWhere('cultivo.active = :active', { active });
        }
        return query.getMany();
    }
    async findOne(id) {
        const cultivo = await this.cultivosRepository.findOne({
            where: { id },
            relations: ['farmer'],
        });
        if (!cultivo) {
            throw new common_1.NotFoundException('Cultivo no encontrado');
        }
        return cultivo;
    }
    async update(id, updateCultivoDto) {
        const cultivo = await this.findOne(id);
        Object.assign(cultivo, updateCultivoDto);
        return this.cultivosRepository.save(cultivo);
    }
    async remove(id) {
        const cultivo = await this.findOne(id);
        await this.cultivosRepository.remove(cultivo);
    }
    async toggleActive(id) {
        const cultivo = await this.findOne(id);
        return this.update(id, { active: !cultivo.active });
    }
};
exports.CultivosService = CultivosService;
exports.CultivosService = CultivosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cultivo_entity_1.Cultivo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CultivosService);
//# sourceMappingURL=cultivos.service.js.map