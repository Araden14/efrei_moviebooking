import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
export declare class MoviesService {
    private moviesRepository;
    constructor(moviesRepository: Repository<Movie>);
    fetchMovies(search: string, page: number, sortBy: string): Promise<any>;
    fetchAvailableMovies(): Promise<Movie[]>;
}
