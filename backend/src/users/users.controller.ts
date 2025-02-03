import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/inscription.dto';
import { ConnexionUserDto } from './dto/connexion.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  inscription(@Body() createUserDto: CreateUserDto) {
    return this.usersService.inscription(createUserDto);
  }

//   @Get()
//   findAll() {
//     return this.usersService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.usersService.findOne(+id);
//   }

//   @Post('login')
//   connexion(@Param('id') id: string, @Body() connexionUserDto: ConnexionUserDto) {
//     return this.usersService.connexion(connexionUserDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.usersService.remove(+id);
//   }
// }
}