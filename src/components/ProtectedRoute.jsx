import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'agent' ? '/agent-dashboard' : '/customer-dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
