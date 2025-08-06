import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';
import { Book } from '../models/books.model';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class CsvExportService {
  constructor(private readonly loggingService: LoggingService) {}
  async exportBooks(): Promise<string> {
    const books = await Book.findAll({ raw: true });
    const parser = new Parser();
    this.loggingService.logAction('Exportación CSV', { count: books.length });
    return parser.parse(books);
  }
}
