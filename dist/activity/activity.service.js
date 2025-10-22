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
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_entity_1 = require("./activity.entity");
let ActivityService = class ActivityService {
    constructor(repo) {
        this.repo = repo;
        this.IMPORTANT = [
            'USER_CREATED',
            'USER_STATUS_CHANGED',
            'PRODUCT_SUBMITTED',
            'PRODUCT_APPROVED',
            'PRODUCT_REJECTED',
            'VETSHOP_CREATED',
            'VETSHOP_TOGGLED',
        ];
    }
    async log(payload) {
        const entity = this.repo.create({
            type: payload.type,
            title: payload.title,
            description: payload.description,
            meta: payload.meta ?? null,
        });
        return this.repo.save(entity);
    }
    async deleteProductStatusHistory(productId) {
        await this.repo.createQueryBuilder()
            .delete()
            .from(activity_entity_1.Activity)
            .where(`type IN (:...types) AND meta LIKE :needle`, {
            types: ['PRODUCT_APPROVED', 'PRODUCT_REJECTED'],
            needle: `%\"productId\":${productId}%`,
        })
            .execute();
    }
    async deleteVetShopToggleHistory(vetShopId) {
        await this.repo.createQueryBuilder()
            .delete()
            .from(activity_entity_1.Activity)
            .where(`type = :type AND meta LIKE :needle`, {
            type: 'VETSHOP_TOGGLED',
            needle: `%\"vetShopId\":${vetShopId}%`,
        })
            .execute();
    }
    async deleteUserStatusHistory(userId) {
        await this.repo.createQueryBuilder()
            .delete()
            .from(activity_entity_1.Activity)
            .where(`type = :type AND meta LIKE :needle`, {
            type: 'USER_STATUS_CHANGED',
            needle: `%\"userId\":${userId}%`,
        })
            .execute();
    }
    async getRecentCompacted(days = 5, limit = 25) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const raw = await this.repo.find({
            where: { createdAt: (0, typeorm_2.MoreThan)(since) },
            order: { createdAt: 'DESC' },
            take: 400,
        });
        const filtered = raw.filter(a => this.IMPORTANT.includes(a.type));
        const seen = new Set();
        const compacted = [];
        for (const a of filtered) {
            const m = a.meta || {};
            let key = null;
            if (a.type.startsWith('USER_') && m.userId)
                key = `user:${m.userId}`;
            else if (a.type.startsWith('PRODUCT_') && m.productId)
                key = `product:${m.productId}`;
            else if (a.type.startsWith('VETSHOP_') && m.vetShopId)
                key = `vetshop:${m.vetShopId}`;
            if (!key) {
                compacted.push(a);
                if (compacted.length >= limit)
                    break;
                continue;
            }
            if (seen.has(key))
                continue;
            seen.add(key);
            compacted.push(a);
            if (compacted.length >= limit)
                break;
        }
        return compacted;
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ActivityService);
//# sourceMappingURL=activity.service.js.map