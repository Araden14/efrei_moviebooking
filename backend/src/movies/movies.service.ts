import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

config();

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>
  ){}
  async fetchMovies(search : string, page : number, sortBy : string) {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}`;

    if (search) {
      url += `&query=${search}`;
    }
    if (page) {
      url += `&page=${page}`;
    }

    const response = await fetch(url, {
      headers: {
        'accept': 'application/json'
      }
    });
    const data = await response.json();

    if (sortBy === "annee.desc") {
      data.results.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
    }
    if (sortBy === "annee.asc") {
      data.results.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
    }

    return data;
  }
async fetchAvailableMovies() {
  return await this.moviesRepository.find();
}

}