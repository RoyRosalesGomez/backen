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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/entities/user.entity");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    toUserRole(role) {
        if (typeof role === 'string') {
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
        return role ?? user_entity_1.UserRole.CLIENT;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        if (user.status !== user_entity_1.UserStatus.ACTIVE) {
            throw new common_1.UnauthorizedException('Cuenta inactiva. Contacte al administrador.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const { password: _, ...result } = user;
        return result;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            status: user.status,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        };
    }
    async register(createUserDto) {
        const normalizedRole = this.toUserRole(createUserDto.role);
        let statusOverride = undefined;
        if (normalizedRole === user_entity_1.UserRole.ADMIN) {
            const adminCount = await this.usersService.countByRole(user_entity_1.UserRole.ADMIN);
            statusOverride = adminCount === 0 ? user_entity_1.UserStatus.ACTIVE : user_entity_1.UserStatus.PENDING;
        }
        const user = await this.usersService.create({ ...createUserDto, role: normalizedRole }, statusOverride);
        const { password, ...result } = user;
        const message = result.role === user_entity_1.UserRole.ADMIN && result.status === user_entity_1.UserStatus.ACTIVE
            ? 'Administrador creado y activado (primer admin).'
            : 'Usuario registrado exitosamente. Su cuenta está pendiente de activación.';
        return { message, user: result };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map