import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authRegister } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form,    setForm]    = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [details, setDetails] = useState([]);

  const onChange = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); setDetails([]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Mật khẩu xác nhận không khớp'); return; }
    setLoading(true);
    try {
      const res = await authRegister({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password });
      login(res.data);
      navigate('/', { replace: true });
    } catch (err) {
      const d = err.response?.data;
      setError(d?.error || 'Đăng ký thất bại');
      setDetails(d?.details || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page anim-fade">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 'var(--s6)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--s2)' }}>🎾</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Đăng ký</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tạo tài khoản để đặt sân nhanh hơn</p>
        </div>

        {error && (
          <div className="alert alert-error anim-fade" style={{ marginBottom: 'var(--s5)' }}>
            <span className="alert-icon">❌</span>
            <div>{error}{details.length > 0 && <ul>{details.map((d,i)=><li key={i}>{d}</li>)}</ul>}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
          <div className="form-group">
            <label className="form-label">Họ và tên <span className="required">*</span></label>
            <input id="reg-fullName" name="fullName" className="form-control" placeholder="Nguyễn Văn A"
              value={form.fullName} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email <span className="required">*</span></label>
            <input id="reg-email" name="email" type="email" className="form-control" placeholder="email@example.com"
              value={form.email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input id="reg-phone" name="phone" className="form-control" placeholder="0912345678"
              value={form.phone} onChange={onChange} />
          </div>
          <div className="grid-2" style={{ gap: 'var(--s3)' }}>
            <div className="form-group">
              <label className="form-label">Mật khẩu <span className="required">*</span></label>
              <input id="reg-password" name="password" type="password" className="form-control" placeholder="≥ 6 ký tự"
                value={form.password} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Xác nhận MK <span className="required">*</span></label>
              <input id="reg-confirm" name="confirm" type="password" className="form-control" placeholder="Nhập lại"
                value={form.confirm} onChange={onChange} required />
            </div>
          </div>
          <button id="btn-register" type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? <><span className="spinner" /> &nbsp;Đang đăng ký...</> : '✅ Tạo tài khoản'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--s5)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Đã có tài khoản? <Link to="/login" style={{ fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
