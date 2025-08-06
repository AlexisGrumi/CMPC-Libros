import { IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  available: boolean;

  @IsNumber()
  authorId: number;

  @IsNumber()
  editorialId: number;

  @IsNumber()
  genreId: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
