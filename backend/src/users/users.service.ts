import { Injectable, NotFoundException } from '@nestjs/common';
import { InscriptionUserDto } from '../auth/dto/inscription.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from '../utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(inscriptionUserDto: InscriptionUserDto) {
    const hashedPassword = await hashPassword(inscriptionUserDto.motdepasse);
    inscriptionUserDto.motdepasse = hashedPassword;
    const user = this.userRepository.create(inscriptionUserDto);
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'prenom', 'nom', 'email', 'createdAt', 'updatedAt']
    });
  }

  async findOne(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: Partial<InscriptionUserDto>) {
    const user = await this.findById(id);
    if (updateUserDto.motdepasse) {
      updateUserDto.motdepasse = await hashPassword(updateUserDto.motdepasse);
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    return this.userRepository.remove(user);
  }
}
  