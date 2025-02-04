import { MoviesService } from './movies.service';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    fetchMovies(search: string, page: number, sortBy: string): Promise<any>;
}
