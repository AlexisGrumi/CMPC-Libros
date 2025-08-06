import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CsvExportService } from './csv-export.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import * as express from 'express';

jest.mock('./books.service');
jest.mock('./csv-export.service');

describe('BooksController', () => {
  let controller: BooksController;
  let booksService: jest.Mocked<BooksService>;
  let csvExportService: jest.Mocked<CsvExportService>;

  const mockUser = { userId: 1 };

  const mockRequest = {
    user: mockUser,
  } as express.Request;

  const mockResponse = () => {
    const res: Partial<express.Response> = {
      header: jest.fn(),
      attachment: jest.fn(),
      send: jest.fn(),
    };
    return res as express.Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: CsvExportService,
          useValue: {
            exportBooks: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        },
      })
      .compile();

    controller = module.get<BooksController>(BooksController);
    booksService = module.get(BooksService) as any;
    csvExportService = module.get(CsvExportService) as any;
  });

  describe('create', () => {
    it('should create a book with image', async () => {
      const dto = { title: 'Test Book' } as any;
      const file = { filename: 'test.jpg' } as Express.Multer.File;

      booksService.create.mockResolvedValue({ id: 1 });

      const result = await controller.create(file, dto, mockRequest);

      expect(booksService.create).toHaveBeenCalledWith(
        { ...dto, imageUrl: '/uploads/test.jpg' },
        mockUser.userId,
      );

      expect(result).toEqual({ id: 1 });
    });

    it('should create a book without image', async () => {
      const dto = { title: 'No Image Book' } as any;

      booksService.create.mockResolvedValue({ id: 2 });

      const result = await controller.create(undefined, dto, mockRequest);

      expect(booksService.create).toHaveBeenCalledWith(
        { ...dto, imageUrl: undefined },
        mockUser.userId,
      );

      expect(result).toEqual({ id: 2 });
    });
  });

  describe('findAll', () => {
    it('should return all books with filters', async () => {
      const query = { genre: 'fiction' };
      booksService.findAll.mockResolvedValue(['book1']);

      const result = await controller.findAll(query, mockRequest);
      expect(booksService.findAll).toHaveBeenCalledWith(query, mockUser.userId);
      expect(result).toEqual(['book1']);
    });
  });

  describe('findOne', () => {
    it('should return a single book by ID', async () => {
      booksService.findOne.mockResolvedValue({ id: 1 });

      const result = await controller.findOne(1);
      expect(booksService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update a book with file', async () => {
      const file = { filename: 'updated.jpg' } as Express.Multer.File;
      const body = { title: 'Updated Book' };

      booksService.update.mockResolvedValue({ id: 1 });

      const result = await controller.update(1, file, body);

      expect(booksService.update).toHaveBeenCalledWith(1, body);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('remove', () => {
    it('should delete a book by ID', async () => {
      booksService.remove.mockResolvedValue({ deleted: true });

      const result = await controller.remove(1);
      expect(booksService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });
  });

  describe('exportCsv', () => {
    it('should export books as CSV', async () => {
      const csv = 'id,title\n1,Test';
      csvExportService.exportBooks.mockResolvedValue(csv);

      const res = mockResponse();

      await controller.exportCsv(res);

      expect(csvExportService.exportBooks).toHaveBeenCalled();
      expect(res.header).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(res.attachment).toHaveBeenCalledWith('books.csv');
      expect(res.send).toHaveBeenCalledWith(csv);
    });
  });
});
