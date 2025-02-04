import { InscriptionUserDto } from '../auth/dto/inscription.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(inscriptionUserDto: InscriptionUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(email: string): Promise<User | null>;
    findById(id: number): Promise<User>;
    update(id: number, updateUserDto: Partial<InscriptionUserDto>): Promise<User>;
    remove(id: number): Promise<User>;
}
