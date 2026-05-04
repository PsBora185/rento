import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user?.role === 'OWNER' ? '/owner/dashboard' : '/rooms';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleRoute;