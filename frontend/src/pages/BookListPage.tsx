import { Link } from 'react-router-dom';
import BookList from '../features/books/BookList';
import ExportCSVButton from '../components/ExportCSVButton';

const BookListPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Libros</h1>

        <ExportCSVButton />
        <Link
          to="/books/new"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Nuevo libro
        </Link>
      </div>
      <BookList />
    </div>
  );
};

export default BookListPage;
