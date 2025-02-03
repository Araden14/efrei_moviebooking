import { UsersService } from './users.service';
import { CreateUserDto } from './dto/inscription.dto';
import { ConnexionUserDto } from './dto/connexion.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    inscription(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(): any;
    findOne(id: string): any;
    connexion(id: string, connexionUserDto: ConnexionUserDto): any;
    remove(id: string): any;
}
