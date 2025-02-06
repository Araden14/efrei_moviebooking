import { ReservationUser } from '../../reservations/entities/reservations_users.entity';
export declare class User {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    motdepasse: string;
    createdAt: Date;
    updatedAt: Date;
    reservationsUsers: ReservationUser[];
}
