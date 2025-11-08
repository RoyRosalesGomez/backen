

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly activity: ActivityService,
  ) {}

  // 👇 Normaliza string -> enum para evitar "Argument of type '\"admin\"'..."
  private toUserRole(role: string | UserRole | undefined): UserRole {
    if (!role) return UserRole.CLIENT;
    if (typeof role !== 'string') return role;
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

  async countAll(): Promise<number> {
  return this.usersRepository.count();
}

  // Cuenta por rol (usa el enum, no string literal)
  async countByRole(role: UserRole): Promise<number> {
    return this.usersRepository.count({ where: { role } });
  }

  async create(createUserDto: CreateUserDto, statusOverride?: UserStatus): Promise<User> {
    // Email único
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // 🔐 Hash de contraseña (esta es la variable que antes te marcaba "Cannot find name 'hashedPassword'")
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Normaliza rol
    const role = this.toUserRole(createUserDto.role);

    const user = this.usersRepository.create({
      ...createUserDto,
      role,
      password: hashedPassword,
      status: statusOverride ?? UserStatus.PENDING, // default: PENDING
    });

    const saved = await this.usersRepository.save(user);

  // 👇 actividad
  await this.activity.log({
    type: 'USER_CREATED',
    title: 'Nuevo usuario registrado',
    description: `${saved.name} ${saved.lastName} se registró como ${saved.role.toLowerCase()}`,
    meta: { userId: saved.id, role: saved.role },
  });

  return saved;
}

async activateUser(id: number): Promise<User> {
  const updated = await this.update(id, { status: UserStatus.ACTIVE } as UpdateUserDto);

  await this.activity.log({
    type: 'USER_STATUS_CHANGED',
    title: 'Usuario activado',
    description: `${updated.name} ${updated.lastName} fue activado`,
    meta: { userId: updated.id, newStatus: updated.status },
  });

  return updated;
}

async deactivateUser(id: number): Promise<User> {
  const updated = await this.update(id, { status: UserStatus.INACTIVE } as UpdateUserDto);

  await this.activity.log({
    type: 'USER_STATUS_CHANGED',
    title: 'Usuario desactivado',
    description: `${updated.name} ${updated.lastName} fue desactivado`,
    meta: { userId: updated.id, newStatus: updated.status },
  });

  return updated;

  }

  async findAll(status?: UserStatus, search?: string): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user');

    if (status) query.andWhere('user.status = :status', { status });

    if (search) {
      query.andWhere(
        '(user.name LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['products', 'orders', 'bitacoraEntries', 'cultivos', 'propiedades'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Si te interesa permitir cambiar rol con string, normalízalo:
    if ((updateUserDto as any).role) {
      (updateUserDto as any).role = this.toUserRole((updateUserDto as any).role);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  // async activateUser(id: number): Promise<User> {
  //   return this.update(id, { status: UserStatus.ACTIVE } as UpdateUserDto);
  // }

  // async deactivateUser(id: number): Promise<User> {
  //   return this.update(id, { status: UserStatus.INACTIVE } as UpdateUserDto);
  // }

  async changePassword(id: number, newPassword: string): Promise<User> {
    const user = await this.findOne(id);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    return this.usersRepository.save(user);
  }

  async getStatistics() {
    const total = await this.usersRepository.count();
    const active = await this.usersRepository.count({ where: { status: UserStatus.ACTIVE } });
    const pending = await this.usersRepository.count({ where: { status: UserStatus.PENDING } });
    const inactive = await this.usersRepository.count({ where: { status: UserStatus.INACTIVE } });

    return { total, active, pending, inactive };
  }
}
