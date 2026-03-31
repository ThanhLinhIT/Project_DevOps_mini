import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects to /login if not authenticated
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="loading-center" style={{ paddingTop: '30vh' }}>
      <div className="spinner" style={{ color: 'var(--primary)', width: 40, height: 40, borderWidth: 3 }} />
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
