import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';

export function ProtectedRoute({ role }) {
  const { currentUser, authLoading } = usePortal();
  const location = useLocation();
  if (authLoading) return <div className="page-shell py-24 text-center text-slate" role="status">Restoring your session…</div>;
  if (!currentUser) return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace state={{ from: location.pathname, message: role === 'admin' ? 'Log in with an administrator account to access the admin dashboard.' : 'Log in to continue.' }} />;
  if (currentUser.role !== role) return <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/applicant/dashboard'} replace />;
  return <Outlet />;
}
