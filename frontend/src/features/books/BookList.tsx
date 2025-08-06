import { useEffect, useState } from 'react';
import api from '../../api/axios';
import useDebounce from '../../hooks/useDebounce';
import BookCard from '../../components/BookCard';
import FilterBar from '../../components/FilterBar';
import Pagination from '../../components/Pagination';

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  editorial: string;
  available: boolean;
  price: number;
  imageUrl: string;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [editorial, setEditorial] = useState('');
  const [author, setAuthor] = useState('');
  const [available, setAvailable] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books', {
          params: {
            page,
            limit, // ✅ Enviar límite al backend
            search: debouncedSearch,
            genre,
            editorial,
            author,
            available,
            sort,
          },
        });

        const books = res.data?.data?.books ?? [];
        const totalPages = res.data?.data.totalPages ?? 1;
        setBooks(books);
        setTotalPages(totalPages);
      } catch (err) {
        console.error('Error al cargar libros:', err);
        setBooks([]);
        setTotalPages(1);
      }
    };

    fetchBooks();
  }, [debouncedSearch, genre, editorial, author, available, sort, page]);

  return (
    <div className="space-y-6">
      <FilterBar
        search={search}
        setSearch={setSearch}
        genre={genre}
        setGenre={setGenre}
        editorial={editorial}
        setEditorial={setEditorial}
        author={author}
        setAuthor={setAuthor}
        available={available}
        setAvailable={setAvailable}
        sort={sort}
        setSort={setSort}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
};

export default BookList;
