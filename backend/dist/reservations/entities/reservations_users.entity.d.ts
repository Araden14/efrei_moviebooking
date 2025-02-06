import { User } from '../../users/entities/user.entity';
import { Reservation } from './reservations.entity';
export declare class ReservationUser {
    id: number;
    reservation: Reservation;
    user: User;
    creneau: number;
    createdAt: Date;
    updatedAt: Date;
}
