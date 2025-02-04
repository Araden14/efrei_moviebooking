import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, motdepasse: string): Promise<any>;
    login(email: string, motdepasse: string): Promise<{
        access_token: string;
    }>;
    register(inscriptionUserDto: any): Promise<import("../users/entities/user.entity").User>;
}
