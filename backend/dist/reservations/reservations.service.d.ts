import { Reservation } from './entities/reservations.entity';
import { ReservationUser } from './entities/reservations_users.entity';
import { Repository } from 'typeorm';
import { ReservationDto } from './dto/reservations.dto';
import { Movie } from '../movies/entities/movie.entity';
export declare class ReservationsService {
    private reservationsRepository;
    private reservationsUserRepository;
    private moviesRepository;
    constructor(reservationsRepository: Repository<Reservation>, reservationsUserRepository: Repository<ReservationUser>, moviesRepository: Repository<Movie>);
    create(user: any, reservation: ReservationDto): Promise<{
        message: string;
    }>;
    findAll(user: any): Promise<{
        id: number;
        reservationId: number;
        userId: number;
        creneau: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    delete(user: any, usereservationid: number): Promise<string>;
}
