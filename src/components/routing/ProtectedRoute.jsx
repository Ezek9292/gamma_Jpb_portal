import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';

export function ProtectedRoute({ role }) {
  const { currentUser } = usePortal();
  const location = useLocation();
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (currentUser.role !== role) return <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/applicant/dashboard'} replace />;
  return <Outlet />;
}
