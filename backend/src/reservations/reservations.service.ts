import { User } from './../users/entities/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservations.entity';
import { ReservationUser } from './entities/reservations_users.entity'
import { Repository } from 'typeorm';
import { ReservationDto } from './dto/reservations.dto';
import {Movie} from '../movies/entities/movie.entity'
import { BadRequestException } from '@nestjs/common';

const creneauxHours = {
  4: '08:00',
  5: '10:00',
  6: '12:00', 
  7: '14:00',
  8: '16:00',
  9: '18:00',
  10: '20:00',
  11: '22:00'
};


@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(ReservationUser)
    private reservationsUserRepository: Repository<ReservationUser>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>
){}
async create(user: any , reservation: ReservationDto){
    try {
    const userid = user.id
    const reservationid = reservation.reservationid
    const reservationrow = await this.reservationsRepository.findOne({ where: {id: reservationid}});
    const movierow = await this.moviesRepository.findOne({where: {id: reservationrow?.movieId } })

    if(!reservationrow || !movierow ){
        throw new BadRequestException("Erreur dans la récupération des données")
    }
    const creneaux = reservationrow.creneaux
    const indice_creneau = creneaux.indexOf(reservation.creneau)
    const heure = creneauxHours[reservation.creneau].split(':')[0]
    const date = movierow.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

    if (indice_creneau === -1){
        throw new BadRequestException("Le créneau demandé n'est pas disponible")
    }
    
    // Check if movie date has passed
    const now = new Date();
    if (movierow.date < now) {
        throw new BadRequestException("Impossible de réserver pour une séance passée");
    }

    const existingReservation = await this.reservationsUserRepository.findOne({
        where: {
            reservation: { id: reservationid },
            user: { id: userid },
            creneau: creneaux[indice_creneau]
        }
    });

    if (existingReservation) {
        throw new BadRequestException("Vous avez déjà une réservation pour ce créneau");
    }
    
    await this.reservationsUserRepository
    .createQueryBuilder()
    .insert()
    .into(ReservationUser)
    .values([
        { reservation: reservationrow, user:userid, creneau: creneaux[indice_creneau] },
    ])
    .execute()
    return {message: `Félicitations ! Nous confirmons votre réservation pour le film ${movierow.titre} à ${heure}h le ${date}`}
}
    catch(error){
        if (error instanceof BadRequestException) {
            throw error;
        }
        throw new InternalServerErrorException('Une erreur est survenue lors de la réservation');
    }
}
async findAll(user: any){
    const reservations = await this.reservationsUserRepository.find({ 
        where: { user: { id: user.id } },
        relations: ['reservation', 'user']
    });
    return reservations.map(reservation => ({
        id: reservation.id,
        reservationId: reservation.reservation.id,
        userId: reservation.user.id,
        creneau: reservation.creneau,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt
    }));
}

async delete(user: any, usereservationid: number){
   if (!usereservationid){
        throw new BadRequestException("Le numéro de réservation est requis")
   }
   const reservationrow = await this.reservationsUserRepository.findOne({ 
    where: {id: usereservationid},
    relations: ['user', 'reservation']
  });
   const movierow = await this.moviesRepository.findOne({where: {id : reservationrow?.reservation.movieId} })

   if (!reservationrow || !movierow) {
    throw new BadRequestException("La réservation ou le film n'ont pas pu être identifiés");
  }
   const date = movierow.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

   const userid = user.id
  
   if (reservationrow.user.id != user.id)
   throw new BadRequestException("Cette réservation a été effectuée par un autre utilisateur")  

   try{
    await this.reservationsUserRepository
    .createQueryBuilder()
    .delete()
    .from(ReservationUser)
    .where("id = :id", { id: usereservationid })
    .execute()
   }
   catch(error){
    throw new InternalServerErrorException("Une erreur est survenue lors de la suppression de la réservation");
   }
   return `Votre reservation pour le film ${movierow.titre} le ${date} a bien été annulée`;
}
async CreneauxList() {
    const reservations = await this.reservationsRepository.find()
    return reservations.map(reservation => ({
        id: reservation.id,
        movieId: reservation.movieId,
        creneaux: reservation.creneaux,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt,
    }));
}}