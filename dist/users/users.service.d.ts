import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActivityService } from 'src/activity/activity.service';
export declare class UsersService {
    private usersRepository;
    private readonly activity;
    constructor(usersRepository: Repository<User>, activity: ActivityService);
    private toUserRole;
    countByRole(role: UserRole): Promise<number>;
    create(createUserDto: CreateUserDto, statusOverride?: UserStatus): Promise<User>;
    activateUser(id: number): Promise<User>;
    deactivateUser(id: number): Promise<User>;
    findAll(status?: UserStatus, search?: string): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
    changePassword(id: number, newPassword: string): Promise<User>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        pending: number;
        inactive: number;
    }>;
}
