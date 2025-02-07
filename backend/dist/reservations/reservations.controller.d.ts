import { ReservationsService } from './reservations.service';
import { ReservationDto } from './dto/reservations.dto';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    createReservation(user: any, reservation: ReservationDto): Promise<{
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
    delete(usereservationid: number, user: any): Promise<string>;
    creneauxList(): Promise<{
        id: number;
        movieId: number;
        creneaux: number[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
