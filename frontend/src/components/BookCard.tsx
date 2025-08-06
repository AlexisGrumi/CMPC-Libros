import { Link } from 'react-router-dom';
import type { Book } from '../features/books/BookList';
import api from '../api/axios';

const BookCard = ({ book }: { book: Book }) => {

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este libro?')) return;
    try {
      await api.delete(`/books/${id}`);
      // idealmente: usar una prop `onDeleted()` o actualizar desde `BookList`
      alert('Libro eliminado');
      window.location.reload(); // o usar setBooks() si tienes control desde padre
    } catch (err) {
      alert('Error al eliminar el libro');
      console.error(err);
    }
  };
  return (
    <div className="border rounded p-4 shadow">

      <img
        src={`${import.meta.env.VITE_API_URL}${book.imageUrl}`}
        alt={book.title}
        className="h-40 w-full object-cover rounded mb-2"
      />
      <h3 className="font-bold text-lg">{book.title}</h3>
      <p>{book.author}</p>
      <p>{book.genre} - {book.editorial}</p>
      <p>{book.available ? 'Disponible' : 'No disponible'}</p>
      <p className="text-sm text-gray-600">${book.price}</p>
      <Link
        to={`/books/${book.id}`}
        className="block text-blue-600 mt-2 underline"
      >
        Ver detalles
      </Link>
      <button
        onClick={() => handleDelete(book.id)}
        className="text-red-600 mt-2 underline"
      >
        Eliminar
      </button>
    </div>
  );
};

export default BookCard;
