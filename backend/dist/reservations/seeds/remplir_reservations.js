"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const movie_entity_1 = require("../../movies/entities/movie.entity");
const dotenv_1 = require("dotenv");
const reservations_users_entity_1 = require("../entities/reservations_users.entity");
const reservations_entity_1 = require("../entities/reservations.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const faker_1 = require("@faker-js/faker");
(0, dotenv_1.config)();
async function generateReservations() {
    console.log('Starting reservation generation...');
    const AppDataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'admin',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_NAME || 'moviebooking',
        synchronize: true,
        logging: true,
        entities: [movie_entity_1.Movie, reservations_entity_1.Reservation, reservations_users_entity_1.ReservationUser, user_entity_1.User],
    });
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connection initialized successfully');
    const reservationRepository = AppDataSource.getRepository(reservations_entity_1.Reservation);
    const movieRepository = AppDataSource.getRepository(movie_entity_1.Movie);
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
        const slots = [];
        while (slots.length < numSlots) {
            const slot = Math.floor(Math.random() * 8) + 4;
            if (!slots.includes(slot)) {
                slots.push(slot);
            }
        }
        slots.sort((a, b) => a - b);
        console.log(`Generated time slots: ${slots.join(', ')}`);
        const reservation = new reservations_entity_1.Reservation();
        reservation.date = new Date(faker_1.faker.date.past().toDateString());
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
//# sourceMappingURL=remplir_reservations.js.map