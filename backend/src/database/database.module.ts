import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from '../config/database.config';
import { User } from '../models/user.model';
import { Book } from '../models/books.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    SequelizeModule.forFeature([User, Book]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
