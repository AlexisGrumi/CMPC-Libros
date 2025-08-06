import BookForm from '../features/books/BookForm';
import { useNavigate } from 'react-router-dom';

const BookFormPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Formulario de libro</h2>
      <BookForm onSubmitSuccess={() => navigate('/books')} />
    </div>
  );
};

export default BookFormPage;
