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
exports.PropiedadesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const propiedades_service_1 = require("./propiedades.service");
const create_propiedad_dto_1 = require("./dto/create-propiedad.dto");
const update_propiedad_dto_1 = require("./dto/update-propiedad.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PropiedadesController = class PropiedadesController {
    constructor(propiedadesService) {
        this.propiedadesService = propiedadesService;
    }
    async create(dto, req) {
        const u = req.user ?? {};
        const farmerId = Number.isFinite(Number(dto.farmerId)) ? Number(dto.farmerId)
            : Number(u.sub ?? u.id ?? u.userId);
        if (!Number.isFinite(farmerId)) {
            throw new common_1.BadRequestException('farmerId requerido');
        }
        dto.farmerId = farmerId;
        return this.propiedadesService.create(dto);
    }
    findAll(q, req) {
        let farmerId;
        let active;
        if (req.user?.role === 'farmer') {
            farmerId = Number(req.user.id);
        }
        else if (q.farmerId != null && q.farmerId !== '') {
            farmerId = Number(q.farmerId);
        }
        if (q.active !== undefined) {
            const v = String(q.active).toLowerCase();
            active = v === 'true' || v === '1';
        }
        return this.propiedadesService.findAll(farmerId, active);
    }
    findOne(id) {
        return this.propiedadesService.findOne(+id);
    }
    update(id, dto) {
        return this.propiedadesService.update(+id, dto);
    }
    toggleActive(id) {
        return this.propiedadesService.toggleActive(+id);
    }
    remove(id) {
        return this.propiedadesService.remove(+id);
    }
};
exports.PropiedadesController = PropiedadesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_propiedad_dto_1.CreatePropiedadDto, Object]),
    __metadata("design:returntype", Promise)
], PropiedadesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las propiedades' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PropiedadesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener propiedad por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropiedadesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar propiedad' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_propiedad_dto_1.UpdatePropiedadDto]),
    __metadata("design:returntype", void 0)
], PropiedadesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, swagger_1.ApiOperation)({ summary: 'Activar/Desactivar propiedad' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropiedadesController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar propiedad' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropiedadesController.prototype, "remove", null);
exports.PropiedadesController = PropiedadesController = __decorate([
    (0, swagger_1.ApiTags)('propiedades'),
    (0, common_1.Controller)('propiedades'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [propiedades_service_1.PropiedadesService])
], PropiedadesController);
//# sourceMappingURL=propiedades.controller.js.map