// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
// import { User, UserStatus } from '../users/entities/user.entity';
// import * as bcrypt from 'bcryptjs';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(email: string, password: string): Promise<any> {
//     const user = await this.usersService.findByEmail(email);
    
//     if (!user) {
//       throw new UnauthorizedException('Credenciales inválidas');
//     }

//     if (user.status !== UserStatus.ACTIVE) {
//       throw new UnauthorizedException('Cuenta inactiva. Contacte al administrador.');
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
    
//     if (!isPasswordValid) {
//       throw new UnauthorizedException('Credenciales inválidas');
//     }

//     const { password: _, ...result } = user;
//     return result;
//   }

//   async login(user: any) {
//     const payload = { 
//       email: user.email, 
//       sub: user.id, 
//       role: user.role,
//       status: user.status 
//     };
    
//     return {
//       access_token: this.jwtService.sign(payload),
//       user: {
//         id: user.id,
//         name: user.name,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         status: user.status,
//       },
//     };
//   }

//   async register(createUserDto: any) {
//     const user = await this.usersService.create(createUserDto);
//     const { password, ...result } = user;
    
//     return {
//       message: 'Usuario registrado exitosamente. Su cuenta está pendiente de activación.',
//       user: result,
//     };
//   }
// }









import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    const message =
      result.role === UserRole.ADMIN && result.status === UserStatus.ACTIVE
        ? 'Administrador creado y activado (primer admin).'
        : 'Usuario registrado exitosamente. Su cuenta está pendiente de activación.';

    return { message, user: result };
  }
}
