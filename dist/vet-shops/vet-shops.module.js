"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VetShopsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vet_shops_service_1 = require("./vet-shops.service");
const vet_shops_controller_1 = require("./vet-shops.controller");
const vet_shop_entity_1 = require("./entities/vet-shop.entity");
let VetShopsModule = class VetShopsModule {
};
exports.VetShopsModule = VetShopsModule;
exports.VetShopsModule = VetShopsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vet_shop_entity_1.VetShop])],
        controllers: [vet_shops_controller_1.VetShopsController],
        providers: [vet_shops_service_1.VetShopsService],
        exports: [vet_shops_service_1.VetShopsService],
    })
], VetShopsModule);
//# sourceMappingURL=vet-shops.module.js.map