import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    private toUserRole;
    countByRole(role: UserRole): Promise<number>;
    create(createUserDto: CreateUserDto, statusOverride?: UserStatus): Promise<User>;
    findAll(status?: UserStatus, search?: string): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
    activateUser(id: number): Promise<User>;
    deactivateUser(id: number): Promise<User>;
    changePassword(id: number, newPassword: string): Promise<User>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        pending: number;
        inactive: number;
    }>;
}
