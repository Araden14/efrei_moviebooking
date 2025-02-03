import { CreateUserDto } from './dto/inscription.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    inscription(createUserDto: CreateUserDto): Promise<User>;
}
