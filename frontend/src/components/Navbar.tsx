// src/components/Navbar.tsx
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // No mostrar en login y register
  const shouldHide = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    api
      .get('/auth/profile')
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/login');
    } catch (err) {
      console.error('Error cerrando sesión:', err);
    }
  };

  if (shouldHide || !isAuthenticated) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white px-6 py-4 shadow z-50 flex justify-between items-center">
      <nav className="flex gap-6">
        <Link to="/books" className="hover:underline">
          Libros
        </Link>
        <Link to="/books/new" className="hover:underline">
          Crear libro
        </Link>
      </nav>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
