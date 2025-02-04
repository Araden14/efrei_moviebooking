import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class MoviesService {
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
}

