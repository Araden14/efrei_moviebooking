import { ReservationUser } from './reservations_users.entity';
export declare class Reservation {
    id: number;
    creneaux: number[];
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    movieId: number;
    reservationsUsers: ReservationUser[];
}
