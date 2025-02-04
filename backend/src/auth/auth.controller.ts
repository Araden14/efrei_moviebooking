import { Controller, Post, Body, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InscriptionUserDto } from './dto/inscription.dto';
import { ConnexionUserDto } from 'src/auth/dto/connexion.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: "S'inscrire" })
  @ApiBody({ schema: { type: 'object', properties: { 
    prenom: { type: 'string' },
    nom: { type: 'string' },
    email: { type: 'string' },
    motdepasse: { type: 'string' }
  } } })
  @ApiResponse({ status: 201, description: 'Utilisateur inscrit avec succès' })
  @ApiResponse({ status: 400, description: 'Requête invalide - Données manquantes ou incorrectes' })
  @ApiResponse({ status: 409, description: 'Conflit - Un utilisateur avec cet email existe déjà' })
    async register(@Body() inscriptionUserDto: InscriptionUserDto) {
    return this.authService.register(inscriptionUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Se connecter' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, motdepasse: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'Connexion réussie - Token JWT généré' })
  @ApiResponse({ status: 400, description: 'Requête invalide - Format incorrect' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() connexionUserDto: ConnexionUserDto) {
    return this.authService.login(connexionUserDto.email, connexionUserDto.motdepasse);
  }
}
