import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly loggingService: LoggingService,
  ) { }

  async register(dto: RegisterDto) {
    try {
      const existing = await User.findOne({ where: { email: dto.email } });
      if (existing) {
        this.loggingService.logAction('Registro fallido: correo ya en uso', { email: dto.email });
        throw new ConflictException('El correo ya está en uso');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await User.create({
        email: dto.email,
        password: hashedPassword,
      });

      this.loggingService.logAction('Usuario registrado', { id: user.id, email: user.email });

      const access_token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
      });

      return {
        message: 'Usuario registrado correctamente',
        user: { id: user.id, email: user.email },
        access_token,
      };
    } catch (error) {
      this.loggingService.logAction('Error en registro', { error: error.message });
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al registrar usuario');
    }

  }

  async validateUser(dto: LoginDto) {

    const user = await User.findOne({ where: { email: dto.email } });

    if (!user) {
      this.loggingService.logAction('Login fallido: usuario no encontrado', { email: dto.email });
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      this.loggingService.logAction('Login fallido: contraseña inválida', { email: dto.email });
      throw new UnauthorizedException('Credenciales inválidas');
    }

    this.loggingService.logAction('Usuario autenticado', { id: user.id, email: user.email });

    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token,
      user: { id: user.id, email: user.email },
    };
  }

}
