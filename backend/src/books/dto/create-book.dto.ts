import { IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Cien años de soledad' })
  @IsString()
  title: string;

  @ApiProperty({ example: 19990 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  available: boolean;

  @ApiProperty({ example: 1, description: 'ID del autor (relación)' })
  @IsNumber()
  authorId: number;

  @ApiProperty({ example: 2, description: 'ID de la editorial (relación)' })
  @IsNumber()
  editorialId: number;

  @ApiProperty({ example: 3, description: 'ID del género (relación)' })
  @IsNumber()
  genreId: number;

  @ApiPropertyOptional({ example: 'https://cdn.ejemplo.com/imagenes/libro.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
