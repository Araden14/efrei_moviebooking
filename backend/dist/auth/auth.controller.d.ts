import { AuthService } from './auth.service';
import { InscriptionUserDto } from './dto/inscription.dto';
import { ConnexionUserDto } from './dto/connexion.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(inscriptionUserDto: InscriptionUserDto): Promise<import("../users/entities/user.entity").User>;
    login(connexionUserDto: ConnexionUserDto): Promise<{
        access_token: string;
    }>;
}
