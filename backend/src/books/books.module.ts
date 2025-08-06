import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from '../models/books.model';
import { CsvExportService } from './csv-export.service';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [SequelizeModule.forFeature([Book]), LoggingModule],
  controllers: [BooksController],
  providers: [BooksService, CsvExportService],
})
export class BooksModule {}
