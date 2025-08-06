import { Table, Column, Model, DataType, HasMany, Index } from 'sequelize-typescript';
import { Book } from '../models/books.model';

@Table
export class User extends Model {
  @Index({ name: 'idx_user_email', unique: true })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @HasMany(() => Book)
  declare books: Book[];
}

