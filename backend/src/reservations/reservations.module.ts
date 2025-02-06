import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationUser } from './entities/reservations_users.entity';
import { Movie } from 'src/movies/entities/movie.entity';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService], 
  imports: [TypeOrmModule.forFeature([Reservation, ReservationUser, Movie])],
})
export class ReservationsModule {}
