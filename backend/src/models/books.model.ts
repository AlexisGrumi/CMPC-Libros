import { Table, Column, Model, DataType, BelongsTo, ForeignKey, Index } from 'sequelize-typescript';
import { User } from '../models/user.model';

@Table({ paranoid: true })
export class Book extends Model {
  @Index({ name: 'idx_book_title' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Index({ name: 'idx_book_author' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare author: string;

  @Index({ name: 'idx_book_editorial' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare editorial: string;

  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare price: number;

  @Index({ name: 'idx_book_available' })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare available: boolean;

  @Index({ name: 'idx_book_genre' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare genre: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare imageUrl: string;

  // Relación con usuario que creó el libro
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}
