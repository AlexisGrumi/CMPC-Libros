import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    return res as Response;
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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 1, email: 'test@example.com' };
          return true;
        },
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user and set cookie', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'securepass',
      };

      const res = mockResponse();
      const user = { id: 1, email: dto.email };
      const token = 'token123';

      mockAuthService.register.mockResolvedValue({ user, access_token: token });

      const result = await controller.register(dto, res);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(res.cookie).toHaveBeenCalledWith('access_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      });

      expect(result).toEqual({
        message: 'Usuario registrado correctamente',
        user,
      });
    });
  });

  describe('login', () => {
    it('should login a user and set cookie', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'securepass',
      };

      const res = mockResponse();
      const user = { id: 1, email: dto.email };
      const token = 'token456';

      mockAuthService.validateUser.mockResolvedValue({ user, access_token: token });

      const result = await controller.login(dto, res);

      expect(authService.validateUser).toHaveBeenCalledWith(dto);
      expect(res.cookie).toHaveBeenCalledWith('access_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      });

      expect(result).toEqual({
        message: 'Login exitoso',
        user,
      });
    });
  });

  describe('getProfile', () => {
    it('should return the user from request', () => {
      const req = {
        user: {
          id: 1,
          email: 'test@example.com',
        },
      } as unknown as Request;

      const result = controller.getProfile(req);
      expect(result).toEqual(req.user);
    });
  });

  describe('logout', () => {
    it('should clear cookie and return logout message', () => {
      const res = mockResponse();

      const result = controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith('jwt', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      expect(result).toEqual({
        message: 'Sesión cerrada correctamente',
      });
    });
  });
});
