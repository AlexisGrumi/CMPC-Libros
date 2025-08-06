import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoggingService } from 'src/logging/logging.service';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.model';

jest.mock('../models/user.model');
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let loggingService: LoggingService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-token'),
  };

  const mockLoggingService = {
    logAction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: LoggingService, useValue: mockLoggingService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    loggingService = module.get<LoggingService>(LoggingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return token', async () => {
      const dto = { email: 'test@example.com', password: '123456' };
      const user = { id: 1, email: dto.email };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      (User.create as jest.Mock).mockResolvedValue(user);

      const result = await service.register(dto);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        email: dto.email,
        password: 'hashedpassword',
      });
      expect(loggingService.logAction).toHaveBeenCalledWith('Usuario registrado', {
        id: user.id,
        email: user.email,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
      expect(result).toEqual({
        message: 'Usuario registrado correctamente',
        user: { id: user.id, email: user.email },
        access_token: 'mocked-token',
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto = { email: 'existing@example.com', password: '123456' };
      const existingUser = { id: 99, email: dto.email };
      (User.findOne as jest.Mock).mockResolvedValue(existingUser);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      expect(loggingService.logAction).toHaveBeenCalledWith(
        'Registro fallido: correo ya en uso',
        { email: dto.email },
      );
    });

    it('should throw InternalServerErrorException if any unexpected error occurs', async () => {
      const dto = { email: 'fail@example.com', password: '123456' };
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

      await expect(service.register(dto)).rejects.toThrow(InternalServerErrorException);
      expect(loggingService.logAction).toHaveBeenCalledWith('Error en registro', {
        error: 'Unexpected error',
      });
    });
  });

  describe('validateUser', () => {
    it('should return user and token on successful login', async () => {
      const dto = { email: 'test@example.com', password: '123456' };
      const user = { id: 1, email: dto.email, password: 'hashedpassword' };

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(dto);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, user.password);
      expect(loggingService.logAction).toHaveBeenCalledWith('Usuario autenticado', {
        id: user.id,
        email: user.email,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
      expect(result).toEqual({
        access_token: 'mocked-token',
        user: { id: user.id, email: user.email },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const dto = { email: 'notfound@example.com', password: '123456' };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.validateUser(dto)).rejects.toThrow(UnauthorizedException);
      expect(loggingService.logAction).toHaveBeenCalledWith(
        'Login fallido: usuario no encontrado',
        { email: dto.email },
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const dto = { email: 'test@example.com', password: 'wrongpass' };
      const user = { id: 1, email: dto.email, password: 'hashedpassword' };

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser(dto)).rejects.toThrow(UnauthorizedException);
      expect(loggingService.logAction).toHaveBeenCalledWith(
        'Login fallido: contraseña inválida',
        { email: dto.email },
      );
    });
  });
});
