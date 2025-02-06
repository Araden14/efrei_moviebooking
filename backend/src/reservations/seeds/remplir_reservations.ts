import { DataSource } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { config } from 'dotenv';
import { ReservationUser } from '../entities/reservations_users.entity';
import { Reservation } from '../entities/reservations.entity';
import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';
config();

async function generateReservations() {
  console.log('Starting reservation generation...');

  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'admin', 
    database: process.env.DB_NAME || 'moviebooking',
    synchronize: true,
    logging: true,
    entities: [Movie, Reservation, ReservationUser, User], 
  });

  console.log('Initializing database connection...');
  await AppDataSource.initialize();
  console.log('Database connection initialized successfully');

  const reservationRepository = AppDataSource.getRepository(Reservation);
  const movieRepository = AppDataSource.getRepository(Movie);

  const movieIds = await movieRepository
    .createQueryBuilder('movie')
    .select('movie.id')
    .getMany()
    .then(movies => movies.map(movie => movie.id));

  console.log(`Found ${movieIds.length} movie IDs`);

  console.log('Starting to generate 20 random reservations...');
  for (let i = 0; i < 20; i++) {
    console.log(`\nGenerating reservation ${i + 1} of 20`);
    
    const numSlots = Math.floor(Math.random() * 8) + 1;
    console.log(`Generating ${numSlots} random time slots`);
    const slots: number[] = [];
    while (slots.length < numSlots) {
      const slot = Math.floor(Math.random() * 8) + 4;
      if (!slots.includes(slot)) {
        slots.push(slot);
      }
    }
    slots.sort((a, b) => a - b);
    console.log(`Generated time slots: ${slots.join(', ')}`);

    const reservation = new Reservation();
    reservation.date = new Date(faker.date.past().toDateString());
    reservation.creneaux = slots;
    reservation.movieId = movieIds[Math.floor(Math.random() * movieIds.length)];

    await reservationRepository.save(reservation);
  }

  console.log('\nClosing database connection...');
  await AppDataSource.destroy();
  console.log('Database connection closed');
  console.log('Reservation generation completed successfully');
}

generateReservations();
