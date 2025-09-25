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
exports.BitacoraController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bitacora_service_1 = require("./bitacora.service");
const create_bitacora_dto_1 = require("./dto/create-bitacora.dto");
const update_bitacora_dto_1 = require("./dto/update-bitacora.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BitacoraController = class BitacoraController {
    constructor(bitacoraService) {
        this.bitacoraService = bitacoraService;
    }
    create(createBitacoraDto) {
        return this.bitacoraService.create(createBitacoraDto);
    }
    findAll(farmerId) {
        return this.bitacoraService.findAll(farmerId);
    }
    findOne(id) {
        return this.bitacoraService.findOne(+id);
    }
    update(id, updateBitacoraDto) {
        return this.bitacoraService.update(+id, updateBitacoraDto);
    }
    remove(id) {
        return this.bitacoraService.remove(+id);
    }
};
exports.BitacoraController = BitacoraController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nueva entrada de bitácora' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bitacora_dto_1.CreateBitacoraDto]),
    __metadata("design:returntype", void 0)
], BitacoraController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las entradas de bitácora' }),
    __param(0, (0, common_1.Query)('farmerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BitacoraController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener entrada de bitácora por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BitacoraController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar entrada de bitácora' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bitacora_dto_1.UpdateBitacoraDto]),
    __metadata("design:returntype", void 0)
], BitacoraController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar entrada de bitácora' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BitacoraController.prototype, "remove", null);
exports.BitacoraController = BitacoraController = __decorate([
    (0, swagger_1.ApiTags)('bitacora'),
    (0, common_1.Controller)('bitacora'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bitacora_service_1.BitacoraService])
], BitacoraController);
//# sourceMappingURL=bitacora.controller.js.map