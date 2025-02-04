import { UsersService } from './users.service';
import { InscriptionUserDto } from '../auth/dto/inscription.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: Partial<InscriptionUserDto>): Promise<import("./entities/user.entity").User>;
    remove(id: string): Promise<import("./entities/user.entity").User>;
}
