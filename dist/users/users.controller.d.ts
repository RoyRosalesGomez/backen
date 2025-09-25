import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(status?: UserStatus, search?: string): Promise<import("./entities/user.entity").User[]>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        pending: number;
        inactive: number;
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
    activate(id: string): Promise<import("./entities/user.entity").User>;
    deactivate(id: string): Promise<import("./entities/user.entity").User>;
    changePassword(id: string, newPassword: string): Promise<import("./entities/user.entity").User>;
    remove(id: string): Promise<void>;
}
