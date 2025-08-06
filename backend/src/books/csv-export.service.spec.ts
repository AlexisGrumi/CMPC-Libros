import { CsvExportService } from './csv-export.service';
import { Book } from '../models/books.model'; // ✅ Usa el path real
import { Parser } from 'json2csv';
import { LoggingService } from 'src/logging/logging.service';

jest.mock('../models/books.model', () => ({
  Book: { findAll: jest.fn() },
}));

describe('CsvExportService', () => {
  let service: CsvExportService;

  beforeEach(() => {
    const mockLoggingService = {
      logAction: jest.fn(),
    };
    service = new CsvExportService(mockLoggingService as unknown as LoggingService);
  });

  it('should export books to CSV', async () => {
    const mockBooks = [
      { title: 'Book1', author: 'Author1' },
      { title: 'Book2', author: 'Author2' },
    ];
    (Book.findAll as jest.Mock).mockResolvedValue(mockBooks);

    const parseSpy = jest.spyOn(Parser.prototype, 'parse');
    parseSpy.mockReturnValue('csv_content');

    const result = await service.exportBooks();

    expect(Book.findAll).toHaveBeenCalledWith({ raw: true });
    expect(parseSpy).toHaveBeenCalledWith(mockBooks);
    expect(result).toBe('csv_content');
  });
});
