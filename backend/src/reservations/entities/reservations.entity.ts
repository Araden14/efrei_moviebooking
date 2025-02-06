import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ReservationUser } from './reservations_users.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('int', { array: true })
  creneaux: number[];

  @Column()
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  movieId: number;

  @OneToMany(() => ReservationUser, (reservationUser) => reservationUser.reservation)
  reservationsUsers: ReservationUser[];
}