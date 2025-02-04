import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { config } from 'dotenv';
import { UsersService } from 'src/users/users.service';

config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'default-secret-key',
      ignoreExpiration: false,
    });
  }
  
  async validate(payload: any) {
    const authHeader = ExtractJwt.fromAuthHeaderAsBearerToken();
    if (!authHeader) {
      throw new HttpException('No token found', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersService.findOne(payload.email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}