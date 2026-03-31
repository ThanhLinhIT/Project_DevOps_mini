import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const active = (p) => pathname === p ? 'nav-link active' : 'nav-link';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏓</span>
          <span>Pickle<span className="brand-accent">Ball</span></span>
        </Link>

        <div className="navbar-links">
          <Link to="/"         className={active('/')}>         🏠 Trang chủ</Link>
          <Link to="/bookings" className={active('/bookings')}> 📋 Bookings</Link>
          <Link to="/about"    className={active('/about')}>    👤 About</Link>

          {isAdmin && (
            <Link to="/admin" className={active('/admin')} style={{ color: '#f59e0b' }}>
              ⚙️ Admin
            </Link>
          )}

          {user && !isAdmin && (
            <Link to="/dashboard" className={active('/dashboard')}>
              🧑‍💻 Của tôi
            </Link>
          )}

          {user ? (
            <div style={{ display:'flex', alignItems:'center', gap:'var(--s3)', marginLeft:'var(--s3)' }}>
              <span style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>
                {isAdmin && <span className="badge badge-warning" style={{ marginRight:6 }}>👑 Admin</span>}
                {user.fullName}
              </span>
              <button id="btn-logout" onClick={handleLogout} className="btn btn-secondary btn-sm">
                🚪 Đăng xuất
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', gap:'var(--s2)', marginLeft:'var(--s3)' }}>
              <Link to="/login"    className="btn btn-secondary btn-sm">🔐 Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary btn-sm">✅ Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
