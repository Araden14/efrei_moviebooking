import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Reservation } from './reservations.entity';

@Entity('reservations_users')
export class ReservationUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reservation, reservation => reservation.reservationsUsers)
  reservation: Reservation;

  @ManyToOne(() => User, user => user.reservationsUsers)
  user: User;

  @Column()
  creneau: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}