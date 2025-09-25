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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    toUserRole(role) {
        if (!role)
            return user_entity_1.UserRole.CLIENT;
        if (typeof role !== 'string')
            return role;
        switch (role.toLowerCase()) {
            case 'admin':
                return user_entity_1.UserRole.ADMIN;
            case 'farmer':
                return user_entity_1.UserRole.FARMER;
            case 'client':
            default:
                return user_entity_1.UserRole.CLIENT;
        }
    }
    async countByRole(role) {
        return this.usersRepository.count({ where: { role } });
    }
    async create(createUserDto, statusOverride) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const role = this.toUserRole(createUserDto.role);
        const user = this.usersRepository.create({
            ...createUserDto,
            role,
            password: hashedPassword,
            status: statusOverride ?? user_entity_1.UserStatus.PENDING,
        });
        return this.usersRepository.save(user);
    }
    async findAll(status, search) {
        const query = this.usersRepository.createQueryBuilder('user');
        if (status)
            query.andWhere('user.status = :status', { status });
        if (search) {
            query.andWhere('(user.name LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)', { search: `%${search}%` });
        }
        return query.getMany();
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['products', 'orders', 'bitacoraEntries', 'cultivos', 'propiedades'],
        });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return user;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        if (updateUserDto.role) {
            updateUserDto.role = this.toUserRole(updateUserDto.role);
        }
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
    async activateUser(id) {
        return this.update(id, { status: user_entity_1.UserStatus.ACTIVE });
    }
    async deactivateUser(id) {
        return this.update(id, { status: user_entity_1.UserStatus.INACTIVE });
    }
    async changePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return this.update(id, { password: hashedPassword });
    }
    async getStatistics() {
        const total = await this.usersRepository.count();
        const active = await this.usersRepository.count({ where: { status: user_entity_1.UserStatus.ACTIVE } });
        const pending = await this.usersRepository.count({ where: { status: user_entity_1.UserStatus.PENDING } });
        const inactive = await this.usersRepository.count({ where: { status: user_entity_1.UserStatus.INACTIVE } });
        return { total, active, pending, inactive };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map