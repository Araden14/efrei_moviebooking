import { MoviesService } from './movies.service';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    fetchAvailableMovies(): Promise<import("./entities/movie.entity").Movie[]>;
    fetchMovies(search: string, page: number, sortBy: string): Promise<any>;
}
