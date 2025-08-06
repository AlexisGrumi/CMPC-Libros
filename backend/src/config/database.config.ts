import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Book } from '../models/books.model';
import { User } from '../models/user.model';

export const databaseConfig = (configService: ConfigService): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
  username: configService.get<string>('DB_USER') || 'postgres',
  password: configService.get<string>('DB_PASS') || 'postgres',
  database: configService.get<string>('DB_NAME') || 'cmpc_libros',
  autoLoadModels: true,
  synchronize: true,
  models: [User, Book],
  logging: false,
});
