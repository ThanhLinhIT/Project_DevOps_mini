import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="anim-fade" style={{ textAlign:'center', padding:'var(--s16) var(--s8)' }}>
    <div style={{ fontSize:'5rem', marginBottom:'var(--s4)' }}>🏓</div>
    <h1 style={{ fontSize:'4rem', fontWeight:900, color:'var(--text-muted)', marginBottom:'var(--s3)' }}>404</h1>
    <p style={{ color:'var(--text-muted)', marginBottom:'var(--s6)', fontSize:'1.1rem' }}>
      Trang bạn tìm không tồn tại.
    </p>
    <Link to="/" className="btn btn-primary btn-lg">🏠 Về trang chủ</Link>
  </div>
);

export default NotFoundPage;
