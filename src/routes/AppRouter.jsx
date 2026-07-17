import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsuariosPage from '../pages/UsuariosPage';
import MateriasPage from '../pages/MateriasPage';
import SesionesPage from '../pages/SesionesPage';
import PerfilPage from '../pages/PerfilPage';
import NotFoundPage from '../pages/NotFoundPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/materias" element={<MateriasPage />} />
          <Route path="/sesiones" element={<SesionesPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}