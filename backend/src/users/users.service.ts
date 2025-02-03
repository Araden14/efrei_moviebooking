import { Injectable, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/inscription.dto';
import { ConnexionUserDto } from './dto/connexion.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/utils/bcrypt';

export type Userschema = {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  motdepasse: string;
}


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async inscription(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.motdepasse);
    createUserDto.motdepasse = hashedPassword;
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }
}