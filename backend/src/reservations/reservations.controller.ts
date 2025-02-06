import { Controller, Post, UseGuards, Body, Get, Delete, Param, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationDto } from './dto/reservations.dto';
import { JwtStrategy } from '../auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../users/get-user-decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody} from '@nestjs/swagger';

@ApiTags('Réservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService)
  {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Créer une nouvelle réservation' })
  @ApiResponse({ status: 201, description: 'La réservation a été créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Requête invalide - Les données fournies sont incorrectes.' })
  @ApiResponse({ status: 401, description: 'Non autorisé - Authentification requise.' })
  @ApiResponse({ status: 500, description: 'Erreur serveur - Une erreur est survenue lors de la création.' })
  @ApiBody({ schema: { type: 'object', properties: { reservationid: { type: 'number' }, creneau: { type: 'number' }}}})
  @Post()
  createReservation(@GetUser() user, @Body() reservation: ReservationDto) {
    return this.reservationsService.create(user, reservation)
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Récupérer toutes les réservations de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des réservations récupérée avec succès.' })
  @ApiResponse({ status: 401, description: 'Non autorisé - Authentification requise.' })
  @ApiResponse({ status: 500, description: 'Erreur serveur - Une erreur est survenue lors de la récupération.' })
  @Get()
  findAll(@GetUser() user){
    return this.reservationsService.findAll(user)
  }

@UseGuards(AuthGuard('jwt'))
@ApiOperation({ summary: "Supprimer une réservation en tant qu'utilisateur" })
@ApiResponse({ status: 200, description: 'Liste des réservations récupérée avec succès.' })
@ApiResponse({ status: 401, description: 'Non autorisé - Authentification requise.' })
@ApiResponse({ status: 500, description: 'Erreur serveur - Une erreur est survenue lors de la récupération.' })
@Delete()
delete(@Query('id') usereservationid: number, @GetUser() user){
  return this.reservationsService.delete(user, usereservationid)
}
}