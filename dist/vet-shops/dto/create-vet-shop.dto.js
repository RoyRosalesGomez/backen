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
exports.CreateVetShopDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateVetShopDto {
}
exports.CreateVetShopDto = CreateVetShopDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AgroVet Central' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVetShopDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'info@agrovetcentral.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateVetShopDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+506 2234-5678' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVetShopDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'San José Centro' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVetShopDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Avenida Central, Calle 5, San José' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVetShopDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/logo.jpg', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateVetShopDto.prototype, "image", void 0);
//# sourceMappingURL=create-vet-shop.dto.js.map