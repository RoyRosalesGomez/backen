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
exports.PropiedadesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const propiedad_entity_1 = require("./entities/propiedad.entity");
let PropiedadesService = class PropiedadesService {
    constructor(propiedadesRepository) {
        this.propiedadesRepository = propiedadesRepository;
    }
    async create(dto) {
        if (!dto.farmerId) {
            throw new common_1.BadRequestException('farmerId requerido');
        }
        const propiedad = this.propiedadesRepository.create({
            nombre: dto.nombre,
            localizacion: dto.localizacion,
            tamano: dto.tamano,
            comentario: dto.comentario ?? null,
            active: true,
            farmerId: dto.farmerId,
            farmer: { id: dto.farmerId },
        });
        const saved = await this.propiedadesRepository.save(propiedad);
        return this.findOne(saved.id);
    }
    async findAll(farmerId, active) {
        const qb = this.propiedadesRepository
            .createQueryBuilder('propiedad')
            .leftJoinAndSelect('propiedad.farmer', 'farmer')
            .orderBy('propiedad.createdAt', 'DESC');
        if (farmerId) {
            qb.andWhere('propiedad.farmerId = :farmerId', { farmerId });
        }
        if (active !== undefined) {
            qb.andWhere('propiedad.active = :active', { active });
        }
        return qb.getMany();
    }
    async findOne(id) {
        const propiedad = await this.propiedadesRepository.findOne({
            where: { id },
            relations: ['farmer'],
        });
        if (!propiedad)
            throw new common_1.NotFoundException('Propiedad no encontrada');
        return propiedad;
    }
    async update(id, dto) {
        const propiedad = await this.findOne(id);
        Object.assign(propiedad, dto);
        await this.propiedadesRepository.save(propiedad);
        return this.findOne(id);
    }
    async remove(id) {
        const propiedad = await this.findOne(id);
        await this.propiedadesRepository.remove(propiedad);
    }
    async toggleActive(id) {
        const propiedad = await this.findOne(id);
        propiedad.active = !propiedad.active;
        await this.propiedadesRepository.save(propiedad);
        return this.findOne(id);
    }
};
exports.PropiedadesService = PropiedadesService;
exports.PropiedadesService = PropiedadesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(propiedad_entity_1.Propiedad)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PropiedadesService);
//# sourceMappingURL=propiedades.service.js.map