import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcryptUtils from '../utils/bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user object without password when credentials are valid', async () => {
      const mockUser = {
        email: 'test@test.com',
        motdepasse: 'hashedPassword',
        id: 1,
        nom: 'Test',
        prenom: 'User',
      };

      jest.spyOn(mockUsersService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcryptUtils, 'comparePasswords').mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', 'password');
      
      expect(result).toBeDefined();
      expect(result.motdepasse).toBeUndefined();
      expect(result.email).toBe(mockUser.email);
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(mockUsersService, 'findOne').mockResolvedValue(null);

      const result = await service.validateUser('test@test.com', 'password');
      
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const mockUser = {
        email: 'test@test.com',
        motdepasse: 'hashedPassword',
      };

      jest.spyOn(mockUsersService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcryptUtils, 'comparePasswords').mockResolvedValue(false);

      const result = await service.validateUser('test@test.com', 'wrongpassword');
      
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return JWT token when credentials are valid', async () => {
      const mockUser = {
        email: 'test@test.com',
        id: 1,
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(mockJwtService, 'sign').mockReturnValue('jwt-token');

      const result = await service.login('test@test.com', 'password');
      
      expect(result.access_token).toBe('jwt-token');
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login('test@test.com', 'wrongpassword'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a new user when email is not taken', async () => {
      const mockUserDto = {
        email: 'new@test.com',
        motdepasse: 'password',
        nom: 'Test',
        prenom: 'User',
      };

      jest.spyOn(mockUsersService, 'findOne').mockResolvedValue(null);
      jest.spyOn(mockUsersService, 'create').mockResolvedValue({ ...mockUserDto, id: 1 });

      const result = await service.register(mockUserDto);
      
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(mockUsersService.create).toHaveBeenCalledWith(mockUserDto);
    });

    it('should throw ConflictException when email is already taken', async () => {
      const mockUserDto = {
        email: 'existing@test.com',
        motdepasse: 'password',
      };

      jest.spyOn(mockUsersService, 'findOne').mockResolvedValue({ id: 1, ...mockUserDto });

      await expect(service.register(mockUserDto))
        .rejects
        .toThrow(ConflictException);
      
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });
});
