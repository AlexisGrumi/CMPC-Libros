import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CsvExportService } from './csv-export.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response, Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly csvExportService: CsvExportService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateBookDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number };
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.booksService.create({ ...dto, imageUrl }, user.userId);
  }

  @Get()
  findAll(@Query() query: any, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.booksService.findAll(query, user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    return this.booksService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.booksService.remove(id);
  }

  @Get('export/csv')
  async exportCsv(@Res() res: Response) {
    const csv = await this.csvExportService.exportBooks();
    res.header('Content-Type', 'text/csv');
    res.attachment('books.csv');
    return res.send(csv);
  }
}
