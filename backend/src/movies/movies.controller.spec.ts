import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  const mockMoviesService = {
    fetchMovies: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetchMovies', () => {
    const mockMovieResponse = {
      page: 1,
      results: [
        {
          id: 1,
          title: 'Test Movie',
          release_date: '2024-01-01'
        }
      ],
      total_pages: 1,
      total_results: 1
    };

    it('should fetch movies with valid parameters', async () => {
      mockMoviesService.fetchMovies.mockResolvedValue(mockMovieResponse);
      
      const result = await controller.fetchMovies('test', 1, 'annee.desc');
      
      expect(result).toEqual(mockMovieResponse);
      expect(mockMoviesService.fetchMovies).toHaveBeenCalledWith('test', 1, 'annee.desc');
    });

    it('should throw BadRequestException for invalid sort parameter', async () => {
      await expect(controller.fetchMovies('test', 1, 'invalid_sort'))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should handle service errors correctly', async () => {
      mockMoviesService.fetchMovies.mockRejectedValue(new Error('API Error'));
      
      await expect(controller.fetchMovies('test', 1, 'annee.desc'))
        .rejects
        .toThrow(InternalServerErrorException);
    });

    it('should pass through HTTP exceptions from service', async () => {
      const httpException = new BadRequestException('Service error');
      mockMoviesService.fetchMovies.mockRejectedValue(httpException);
      
      await expect(controller.fetchMovies('test', 1, 'annee.desc'))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should handle optional parameters', async () => {
      mockMoviesService.fetchMovies.mockResolvedValue(mockMovieResponse);
      
      await controller.fetchMovies('', 1, '');
      
      expect(mockMoviesService.fetchMovies).toHaveBeenCalledWith('', 1, '');
    });

    it('should accept valid sort parameters', async () => {
      mockMoviesService.fetchMovies.mockResolvedValue(mockMovieResponse);
      
      await expect(controller.fetchMovies('test', 1, 'annee.asc')).resolves.not.toThrow();
      await expect(controller.fetchMovies('test', 1, 'annee.desc')).resolves.not.toThrow();
    });
  });
});
