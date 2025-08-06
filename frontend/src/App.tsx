// src/App.tsx
import { AuthProvider } from './auth/AuthContext';
import AppRoutes from './router';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <div className="pt-20"> {/* margen para que no se oculte detrás del navbar */}
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;
