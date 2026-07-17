import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken } from '../utils/storage';

/**
 * Componente de Ruta Protegida (ProtectedRoute)
 * 
 * NOTA DE MOCKUP: Se ha deshabilitado temporalmente la redirección obligatoria a '/login'
 * si no existe token, permitiendo el acceso libre a cualquier ruta interna de la aplicación.
 * Retorna directamente el Outlet para renderizar los componentes hijos.
 */
export default function ProtectedRoute() {
  // Retorna directamente el outlet permitiendo acceso a cualquier ruta sin validar token
  return <Outlet />;
}