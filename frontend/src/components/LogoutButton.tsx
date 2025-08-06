import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const LogoutButton = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar sesión
  useEffect(() => {
    api
      .get('/auth/profile')
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 z-50"
    >
      Logout
    </button>
  );
};

export default LogoutButton;