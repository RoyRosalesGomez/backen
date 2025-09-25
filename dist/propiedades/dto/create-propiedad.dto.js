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
exports.CreatePropiedadDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePropiedadDto {
}
exports.CreatePropiedadDto = CreatePropiedadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Finca El Progreso' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropiedadDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cartago, Paraíso' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropiedadDto.prototype, "localizacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5 hectáreas' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropiedadDto.prototype, "tamano", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Finca principal con cultivos diversos', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropiedadDto.prototype, "comentario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CreatePropiedadDto.prototype, "farmerId", void 0);
//# sourceMappingURL=create-propiedad.dto.js.map