import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './entities/reservations.entity';
import { ReservationUser } from './entities/reservations_users.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Repository } from 'typeorm';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationsRepository: Repository<Reservation>;
  let reservationsUserRepository: Repository<ReservationUser>;
  let moviesRepository: Repository<Movie>;

  const mockUser = { 
    id: 1, 
    email: 'test@test.com',
    prenom: 'Test',
    nom: 'User',
    motdepasse: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    reservationsUsers: []
  };
  const mockMovie = { 
    id: 1, 
    titre: 'Test Movie', 
    date: new Date(Date.now() + 86400000), // tomorrow
    description: 'Test description',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const mockReservation = { 
    id: 1, 
    movieId: 1,
    creneaux: [4, 5, 6], 
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    reservationsUsers: []
  };
  const mockReservationUser = {
    id: 1,
    reservation: mockReservation,
    user: mockUser,
    creneau: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              insert: jest.fn().mockReturnThis(),
              into: jest.fn().mockReturnThis(),
              values: jest.fn().mockReturnThis(),
              execute: jest.fn().mockResolvedValue(true),
              delete: jest.fn().mockReturnThis(),
              from: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
            })),
          },
        },
        {
          provide: getRepositoryToken(ReservationUser),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              insert: jest.fn().mockReturnThis(),
              into: jest.fn().mockReturnThis(),
              values: jest.fn().mockReturnThis(),
              execute: jest.fn().mockResolvedValue(true),
              delete: jest.fn().mockReturnThis(),
              from: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
            })),
          },
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    reservationsRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    reservationsUserRepository = module.get<Repository<ReservationUser>>(getRepositoryToken(ReservationUser));
    moviesRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = { reservationid: 1, creneau: 4 };

    it('should create a reservation successfully', async () => {
      jest.spyOn(reservationsRepository, 'findOne').mockResolvedValue(mockReservation);
      jest.spyOn(moviesRepository, 'findOne').mockResolvedValue(mockMovie);
      jest.spyOn(reservationsUserRepository, 'findOne').mockResolvedValue(null);

      const result = await service.create(mockUser, createDto);
      expect(result).toHaveProperty('message');
      expect(result.message).toContain('Félicitations');
    });

    it('should throw BadRequestException for non-existent reservation', async () => {
      jest.spyOn(reservationsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(mockUser, createDto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException for unavailable time slot', async () => {
      const reservationWithoutSlot = { ...mockReservation, creneaux: [5, 6] };
      jest.spyOn(reservationsRepository, 'findOne').mockResolvedValue(reservationWithoutSlot);
      jest.spyOn(moviesRepository, 'findOne').mockResolvedValue(mockMovie);

      await expect(service.create(mockUser, createDto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException for past movie date', async () => {
      const pastMovie = { ...mockMovie, date: new Date(Date.now() - 86400000) }; // yesterday
      jest.spyOn(reservationsRepository, 'findOne').mockResolvedValue(mockReservation);
      jest.spyOn(moviesRepository, 'findOne').mockResolvedValue(pastMovie);

      await expect(service.create(mockUser, createDto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException for duplicate booking', async () => {
      jest.spyOn(reservationsRepository, 'findOne').mockResolvedValue(mockReservation);
      jest.spyOn(moviesRepository, 'findOne').mockResolvedValue(mockMovie);
      jest.spyOn(reservationsUserRepository, 'findOne').mockResolvedValue(mockReservationUser);

      await expect(service.create(mockUser, createDto))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all reservations for a user', async () => {
      jest.spyOn(reservationsUserRepository, 'find').mockResolvedValue([mockReservationUser]);

      const result = await service.findAll(mockUser);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('reservationId');
      expect(result[0]).toHaveProperty('userId');
    });
  });

  describe('delete', () => {
    it('should throw BadRequestException when no reservation ID provided', async () => {
      await expect(service.delete(mockUser, 0))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException when reservation not found', async () => {
      jest.spyOn(reservationsUserRepository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(mockUser, 1))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException when trying to delete another user\'s reservation', async () => {
      const otherUserReservation = {
        ...mockReservationUser,
        user: { ...mockUser, id: 999 }
      };
      jest.spyOn(reservationsUserRepository, 'findOne').mockResolvedValue(otherUserReservation);
      jest.spyOn(moviesRepository, 'findOne').mockResolvedValue(mockMovie);

      await expect(service.delete(mockUser, 1))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should delete reservation successfully', async () => {
      jest.spyOn(reservationsUserRepository, 'findOne').mockResolvedValue(mockReservationUser);
      jest.spyOn(moviesRepository, 'findOne').mockResolvedValue(mockMovie);

      const result = await service.delete(mockUser, 1);
      expect(result).toContain('bien été annulée');
    });

    it('should throw InternalServerErrorException when delete fails', async () => {
      jest.spyOn(reservationsUserRepository, 'findOne').mockResolvedValue(mockReservationUser);
      jest.spyOn(moviesRepository, 'findOne').mockResolvedValue(mockMovie);
      jest.spyOn(reservationsUserRepository, 'createQueryBuilder').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.delete(mockUser, 1))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });
});
