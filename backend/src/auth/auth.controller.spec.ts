import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InscriptionUserDto } from './dto/inscription.dto';
import { ConnexionUserDto } from './dto/connexion.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const inscriptionDto: InscriptionUserDto = {
        email: 'test@test.com',
        motdepasse: 'password123',
        nom: 'Test',
        prenom: 'User',
      };

      const expectedResult = {
        id: 1,
        ...inscriptionDto,
      };

      jest.spyOn(mockAuthService, 'register').mockResolvedValue(expectedResult);

      const result = await controller.register(inscriptionDto);

      expect(result).toBe(expectedResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(inscriptionDto);
    });
  });

  describe('login', () => {
    it('should successfully login a user and return access token', async () => {
      const connexionDto: ConnexionUserDto = {
        email: 'test@test.com',
        motdepasse: 'password123',
      };

      const expectedResult = {
        access_token: 'jwt-token',
      };

      jest.spyOn(mockAuthService, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(connexionDto);

      expect(result).toBe(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        connexionDto.email,
        connexionDto.motdepasse,
      );
    });
  });
}); 