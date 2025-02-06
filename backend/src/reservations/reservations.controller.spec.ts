import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '@nestjs/passport';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

// Mock GetUser decorator
jest.mock('../users/get-user-decorator', () => ({
  GetUser: () => {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
      return descriptor;
    };
  },
}));

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

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

  const mockReservationDto = {
    reservationid: 1,
    creneau: 4
  };

  const mockReservationResponse = {
    message: 'Félicitations ! Nous confirmons votre réservation pour le film Test Movie à 8h le lundi 1 janvier'
  };

  const mockReservations = [
    {
      id: 1,
      reservationId: 1,
      userId: 1,
      creneau: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockReservationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockReservationsService
        }
      ]
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReservation', () => {
    it('should create a reservation successfully', async () => {
      mockReservationsService.create.mockResolvedValue(mockReservationResponse);

      const result = await controller.createReservation(mockUser, mockReservationDto);

      expect(result).toEqual(mockReservationResponse);
      expect(service.create).toHaveBeenCalledWith(mockUser, mockReservationDto);
    });

    it('should handle BadRequestException', async () => {
      mockReservationsService.create.mockRejectedValue(
        new BadRequestException('Le créneau demandé n\'est pas disponible')
      );

      await expect(controller.createReservation(mockUser, mockReservationDto))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should handle InternalServerErrorException', async () => {
      mockReservationsService.create.mockRejectedValue(
        new InternalServerErrorException('Une erreur est survenue lors de la réservation')
      );

      await expect(controller.createReservation(mockUser, mockReservationDto))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return all reservations for a user', async () => {
      mockReservationsService.findAll.mockResolvedValue(mockReservations);

      const result = await controller.findAll(mockUser);

      expect(result).toEqual(mockReservations);
      expect(service.findAll).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors when fetching reservations', async () => {
      mockReservationsService.findAll.mockRejectedValue(
        new InternalServerErrorException('Une erreur est survenue')
      );

      await expect(controller.findAll(mockUser))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    const reservationId = 1;

    it('should delete a reservation successfully', async () => {
      const successMessage = 'Votre reservation a bien été annulée';
      mockReservationsService.delete.mockResolvedValue(successMessage);

      const result = await controller.delete(reservationId, mockUser);

      expect(result).toBe(successMessage);
      expect(service.delete).toHaveBeenCalledWith(mockUser, reservationId);
    });

    it('should handle BadRequestException when deleting non-existent reservation', async () => {
      mockReservationsService.delete.mockRejectedValue(
        new BadRequestException('La réservation n\'a pas pu être identifiée')
      );

      await expect(controller.delete(reservationId, mockUser))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should handle BadRequestException when trying to delete another user\'s reservation', async () => {
      mockReservationsService.delete.mockRejectedValue(
        new BadRequestException('Cette réservation a été effectuée par un autre utilisateur')
      );

      await expect(controller.delete(reservationId, mockUser))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should handle InternalServerErrorException', async () => {
      mockReservationsService.delete.mockRejectedValue(
        new InternalServerErrorException('Une erreur est survenue lors de la suppression')
      );

      await expect(controller.delete(reservationId, mockUser))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('Authentication', () => {
    it('should have AuthGuard applied to createReservation', () => {
      const guards = Reflect.getMetadata('__guards__', controller.createReservation);
      expect(guards).toBeDefined();
      expect(guards[0]).toBe(AuthGuard('jwt'));
    });

    it('should have AuthGuard applied to findAll', () => {
      const guards = Reflect.getMetadata('__guards__', controller.findAll);
      expect(guards).toBeDefined();
      expect(guards[0]).toBe(AuthGuard('jwt'));
    });

    it('should have AuthGuard applied to delete', () => {
      const guards = Reflect.getMetadata('__guards__', controller.delete);
      expect(guards).toBeDefined();
      expect(guards[0]).toBe(AuthGuard('jwt'));
    });
  });
});
