import { DataSource } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { config } from 'dotenv';

config();

async function getRandomMovies() {
  const page = Math.floor(Math.random() * 100);
  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
  console.log(url)
  const response = await fetch(url, {
    headers: {
      'accept': 'application/json'
    }
  });
  const data = await response.json();
  console.log(response)
  console.log(data)

  return data.results.slice(0, 50);
}


async function seed() {
  const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Movie],
    synchronize: true,
  });

  try {
    await AppDataSource.initialize();
    console.log("Connected to database");

    const movies = await getRandomMovies();
    const movieRepository = AppDataSource.getRepository(Movie);

    for (const movieData of movies) {
      const movie = new Movie();
      movie.titre = movieData.title;
      movie.description = movieData.overview;
      movie.date = new Date(movieData.release_date);
      await movieRepository.save(movie);
    }

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
