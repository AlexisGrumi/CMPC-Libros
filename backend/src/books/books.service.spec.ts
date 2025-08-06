import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Book } from '../models/books.model';
import { LoggingService } from 'src/logging/logging.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let bookModel: any;
  let sequelize: any;
  let loggingService: LoggingService;

  const mockBook = {
    id: 1,
    title: 'Test Book',
    update: jest.fn().mockResolvedValue({ id: 1, title: 'Updated Book' }),
    destroy: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    bookModel = {
      create: jest.fn(),
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
    };

    sequelize = {
      transaction: jest.fn().mockImplementation(async (cb) => await cb({})),
    };

    loggingService = {
      logAction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getModelToken(Book), useValue: bookModel },
        { provide: Sequelize, useValue: sequelize },
        { provide: LoggingService, useValue: loggingService },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  describe('create', () => {
    it('should create a book', async () => {
      const dto = { title: 'Test', author: 'Author' };
      const result = { id: 1, title: 'Test' };
      bookModel.create.mockResolvedValue(result);

      const created = await service.create(dto, 123);

      expect(created).toEqual(result);
      expect(bookModel.create).toHaveBeenCalledWith(
        { ...dto, userId: 123 },
        { transaction: {} },
      );
      expect(loggingService.logAction).toHaveBeenCalledWith('Libro creado', {
        id: 1,
        title: 'Test',
        userId: 123,
      });
    });

    it('should throw if creation fails', async () => {
      bookModel.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create({}, 1)).rejects.toThrow(InternalServerErrorException);
      expect(loggingService.logAction).toHaveBeenCalledWith('Error al crear libro', {
        error: 'DB error',
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      bookModel.findAndCountAll.mockResolvedValue({
        rows: [{ id: 1, title: 'Book' }],
        count: 1,
      });

      const result = await service.findAll({}, 1);

      expect(result.books.length).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(bookModel.findAndCountAll).toHaveBeenCalled();
    });

    it('should apply all filters', async () => {
      await service.findAll(
        {
          search: 'Test',
          genre: 'Drama',
          editorial: 'CMPC',
          author: 'Author1',
          available: 'true',
          sort: 'title:DESC',
        },
        5,
      );

      expect(bookModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 5,
            genre: 'Drama',
            editorial: 'CMPC',
            author: 'Author1',
            available: true,
            title: { [Op.iLike]: '%Test%' },
          }),
          order: [['title', 'DESC']],
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return book by id', async () => {
      bookModel.findByPk.mockResolvedValue(mockBook);

      const result = await service.findOne(1);

      expect(result).toBe(mockBook);
    });

    it('should throw if book not found', async () => {
      bookModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
      expect(loggingService.logAction).toHaveBeenCalledWith('Libro no encontrado', { id: 2 });
    });
  });

  describe('update', () => {
    it('should update the book', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBook);

      const result = await service.update(1, { title: 'Updated Book' });

      expect(mockBook.update).toHaveBeenCalledWith({ title: 'Updated Book' }, { transaction: {} });
      expect(loggingService.logAction).toHaveBeenCalledWith('Libro actualizado', { id: 1 });
      expect(result).toEqual({ id: 1, title: 'Updated Book' });
    });

    it('should throw if update fails', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBook);
      mockBook.update.mockRejectedValueOnce(new Error('Update failed'));

      await expect(service.update(1, {})).rejects.toThrow(InternalServerErrorException);
      expect(loggingService.logAction).toHaveBeenCalledWith(
        'Error al actualizar libro',
        expect.objectContaining({
          id: 1,
          error: 'Update failed',
        }),
      );
    });
  });

  describe('remove', () => {
    it('should delete the book', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBook);

      const result = await service.remove(1);

      expect(mockBook.destroy).toHaveBeenCalledWith({ transaction: {} });
      expect(loggingService.logAction).toHaveBeenCalledWith('Libro eliminado', { id: 1 });
      expect(result).toEqual({ message: 'Libro eliminado (soft delete)' });
    });

    it('should throw if delete fails', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBook);
      mockBook.destroy.mockRejectedValueOnce(new Error('Delete error'));

      await expect(service.remove(1)).rejects.toThrow(InternalServerErrorException);
      expect(loggingService.logAction).toHaveBeenCalledWith(
        'Error al eliminar libro',
        expect.objectContaining({ id: 1, error: 'Delete error' }),
      );
    });
  });
});
