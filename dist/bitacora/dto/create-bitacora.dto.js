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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBitacoraDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBitacoraDto {
}
exports.CreateBitacoraDto = CreateBitacoraDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Siembra' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBitacoraDto.prototype, "tipoActividad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chayote' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBitacoraDto.prototype, "tipoCultivo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-10' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBitacoraDto.prototype, "fechaInicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-12' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBitacoraDto.prototype, "fechaFin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Siembra de chayotes en lote norte' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBitacoraDto.prototype, "detalle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lote A-1' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBitacoraDto.prototype, "lote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Condiciones climáticas favorables', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBitacoraDto.prototype, "observaciones", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2 hectáreas' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBitacoraDto.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CreateBitacoraDto.prototype, "farmerId", void 0);
//# sourceMappingURL=create-bitacora.dto.js.map