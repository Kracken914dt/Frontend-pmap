import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken } from '../utils/storage';

export default function ProtectedRoute() {
  return <Outlet />;
}