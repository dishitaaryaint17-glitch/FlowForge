import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, isReady } = useAuth();

  if (!isReady) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/member'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
