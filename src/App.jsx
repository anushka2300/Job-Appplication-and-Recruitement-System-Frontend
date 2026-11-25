import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToasterProvider } from './components/common/Toaster';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToasterProvider>
          <AppRoutes />
        </ToasterProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
