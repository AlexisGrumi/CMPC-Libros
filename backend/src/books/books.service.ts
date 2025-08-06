import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Book } from '../models/books.model';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book) private readonly bookModel: typeof Book,
    private readonly sequelize: Sequelize,
    private readonly loggingService: LoggingService,
  ) {}

  async create(dto: CreateBookDto & { imageUrl?: string }, userId: number) {
    try {
      const created = await this.sequelize.transaction(async (t) => {
        return await this.bookModel.create(
          {
            ...dto,
            userId,
          },
          { transaction: t },
        );
      });

      this.loggingService.logAction('Libro creado', {
        id: created.id,
        title: created.title,
        userId,
      });

      return created;
    } catch (error) {
      this.loggingService.logAction('Error al crear libro', {
        error: error.message,
      });
      throw new InternalServerErrorException('No se pudo crear el libro');
    }
  }

  async findAll(query: any, userId: number) {
    const {
      page = 1,
      limit = 10,
      search,
      genre,
      editorial,
      author,
      available,
      sort,
    } = query;
  
    const where: any = {
      userId, // ✅ Siempre filtra por el usuario autenticado
    };
  
    if (genre) where.genre = genre;
    if (editorial) where.editorial = editorial;
    if (author) where.author = author;
  
    // ✅ Solo aplicar el filtro si es 'true' o 'false'
    if (available === 'true' || available === 'false') {
      where.available = available === 'true';
    }
  
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }
  
    const order = sort
      ? sort.split(',').map((f) => f.split(':'))
      : [['title', 'ASC']];
  
    const result = await this.bookModel.findAndCountAll({
      where,
      order,
      offset: (page - 1) * +limit,
      limit: +limit,
    });
  
    return {
      books: result.rows,
      totalPages: Math.ceil(result.count / limit),
    };
  }
  
  

  async findOne(id: number) {
    const book = await this.bookModel.findByPk(id);
    if (!book) {
      this.loggingService.logAction('Libro no encontrado', { id });
      throw new NotFoundException('Libro no encontrado');
    }
    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    try {
      return await this.sequelize.transaction(async (t) => {
        const book = await this.findOne(id);
        const updated = await book.update(dto, { transaction: t });

        this.loggingService.logAction('Libro actualizado', { id: book.id });
        return updated;
      });
    } catch (error) {
      this.loggingService.logAction('Error al actualizar libro', { id, error: error.message });
      throw new InternalServerErrorException('No se pudo actualizar el libro');
    }
  }

  async remove(id: number) {
    try {
      return await this.sequelize.transaction(async (t) => {
        const book = await this.findOne(id);
        await book.destroy({ transaction: t });

        this.loggingService.logAction('Libro eliminado', { id: book.id });
        return { message: 'Libro eliminado (soft delete)' };
      });
    } catch (error) {
      this.loggingService.logAction('Error al eliminar libro', { id, error: error.message });
      throw new InternalServerErrorException('No se pudo eliminar el libro');
    }
  }
}
