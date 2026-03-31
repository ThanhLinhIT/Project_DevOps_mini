import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const onChange = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authLogin(form);
      login(res.data);
      navigate(res.data.user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page anim-fade">
      <div className="auth-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--s6)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--s2)' }}>🏓</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Đăng nhập</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Chào mừng trở lại Pickleball Booking!
          </p>
        </div>

        {error && (
          <div className="alert alert-error anim-fade" style={{ marginBottom: 'var(--s5)' }}>
            <span className="alert-icon">❌</span>{error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
          <div className="form-group">
            <label className="form-label">Email <span className="required">*</span></label>
            <input id="login-email" name="email" type="email" className="form-control"
              placeholder="admin@gmail.com" value={form.email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu <span className="required">*</span></label>
            <input id="login-password" name="password" type="password" className="form-control"
              placeholder="••••••••" value={form.password} onChange={onChange} required />
          </div>
          <button id="btn-login" type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? <><span className="spinner" /> &nbsp;Đang đăng nhập...</> : '🔐 Đăng nhập'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--s5)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Đăng ký ngay</Link>
        </p>

        {/* Admin hint */}
        <div style={{
          marginTop: 'var(--s5)', padding: 'var(--s3) var(--s4)',
          background: 'var(--primary-glow)', borderRadius: 'var(--r)',
          fontSize: '0.8rem', color: 'var(--text-muted)',
          border: '1px solid rgba(14,165,233,0.15)',
        }}>
          <strong style={{ color: 'var(--primary-light)' }}>🔑 Admin demo:</strong><br />
          admin@gmail.com / admin12345
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
