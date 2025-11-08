

import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole, UserStatus } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 👇 Normaliza string | enum -> enum
  private toUserRole(role: any): UserRole {
    if (typeof role === 'string') {
      switch (role.toLowerCase()) {
        case 'admin':
          return UserRole.ADMIN;
        case 'farmer':
          return UserRole.FARMER;
        case 'client':
        default:
          return UserRole.CLIENT;
      }
    }
    // si ya viene como enum, lo devolvemos tal cual (o client por defecto)
    return role ?? UserRole.CLIENT;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Cuenta inactiva. Contacte al administrador.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
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

  // ✅ Primer admin queda ACTIVE; demás registros quedan PENDING
  async register(createUserDto: any) {
    const normalizedRole = this.toUserRole(createUserDto.role);

    let statusOverride: UserStatus | undefined = undefined;
    if (normalizedRole === UserRole.ADMIN) {
      const adminCount = await this.usersService.countByRole(UserRole.ADMIN);
      statusOverride = adminCount === 0 ? UserStatus.ACTIVE : UserStatus.PENDING;
    }

     const user = await this.usersService.create(
    { ...createUserDto, role: normalizedRole },
    statusOverride,
  );

    const { password, ...result } = user;

    const isFirstAdminActive =
    result.role === UserRole.ADMIN && result.status === UserStatus.ACTIVE;

  
    const payload = { email: result.email, sub: result.id, role: result.role, status: result.status };
    const access_token = isFirstAdminActive ? this.jwtService.sign(payload) : undefined;
    
    const message = isFirstAdminActive
    ? 'Administrador creado y activado (primer admin).'
    : 'Usuario registrado. Su cuenta está pendiente de activación.';

    return { message, user: result, access_token };
  }

  async countAllUsers() {
  return this.usersService.countAll();
}

  // 🔐 Verificar que el correo existe en la base de datos
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('No existe una cuenta con este correo electrónico');
    }

    // Retornar mensaje de éxito (el correo existe)
    return {
      message: 'Correo verificado correctamente. Puede proceder a restablecer su contraseña.',
      email: user.email
    };
  }

  // 🔐 Resetear contraseña verificando que coincidan
  async resetPassword(email: string, newPassword: string, confirmPassword: string) {
    // Verificar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Buscar el usuario por email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('No existe una cuenta con este correo electrónico');
    }

    // Cambiar la contraseña usando el método del servicio de usuarios
    // Este método ya se encarga de hashear la contraseña automáticamente
    await this.usersService.changePassword(user.id, newPassword);

    return {
      message: 'Contraseña actualizada exitosamente. Ya puede iniciar sesión con su nueva contraseña.'
    };
  }

}
