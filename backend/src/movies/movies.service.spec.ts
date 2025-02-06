import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { ConfigModule } from '@nestjs/config';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchMovies', () => {
    it('should fetch movies without parameters', async () => {
      const result = await service.fetchMovies('', 1, '');
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(Array.isArray(result.results)).toBeTruthy();
    }, 10000);

    it('should fetch movies with search parameter', async () => {
      const searchTerm = 'Avatar';
      const result = await service.fetchMovies(searchTerm, 1, '');
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(result.results.some(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )).toBeTruthy();
    }, 10000);

    it('should sort movies by year descending', async () => {
      const result = await service.fetchMovies('Star Wars', 1, 'annee.desc');
      const dates = result.results.map(movie => new Date(movie.release_date).getTime());
      
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
      }
    }, 10000);

    it('should sort movies by year ascending', async () => {
      const result = await service.fetchMovies('Star Wars', 1, 'annee.asc');
      const dates = result.results.map(movie => new Date(movie.release_date).getTime());
      
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeLessThanOrEqual(dates[i + 1]);
      }
    }, 10000);

    it('should handle pagination correctly', async () => {
      const page1 = await service.fetchMovies('Marvel', 1, '');
      const page2 = await service.fetchMovies('Marvel', 2, '');

      expect(page1.page).toBe(1);
      expect(page2.page).toBe(2);
      expect(page1.results).not.toEqual(page2.results);
    }, 10000);
  });
});
