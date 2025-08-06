import { Routes, Route, Navigate } from 'react-router-dom';
import BookListPage from '../pages/BookListPage';
import BookFormPage from '../pages/BookFormPage';
import BookDetailPage from '../pages/BookFormPage';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import RegisterPage from '../pages/RegisterPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <BookListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/new"
        element={
          <ProtectedRoute>
            <BookFormPage />
          </ProtectedRoute>
        }
      />
      <Route path="/books/:id" element={<BookFormPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
