import { Injectable, UnauthorizedException, BadRequestException, UsePipes, ValidationPipe, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from '../utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, motdepasse: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await comparePasswords(motdepasse, user.motdepasse)) {
      const { motdepasse, ...result } = user;
      return result;
    }
    return null;
  }
  

  async login(email: string, motdepasse: string) {
    const user = await this.validateUser(email, motdepasse);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const payload = { email: user.email, motdepasse: user.motdepasse };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(inscriptionUserDto: any) {
    const existingUser = await this.usersService.findOne(inscriptionUserDto.email);
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }
    return this.usersService.create(inscriptionUserDto);
  }
}
