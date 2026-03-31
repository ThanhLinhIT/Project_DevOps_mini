import { useState, useEffect, useCallback } from 'react';
import { getBookings } from '../services/api';
import StatusBadge from './StatusBadge';

const BookingList = ({ refresh }) => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  const fetchBookings = useCallback(() => {
    setLoading(true);
    setError('');
    getBookings()
      .then(r  => setBookings(r.data.data))
      .catch(() => setError('Không thể tải danh sách booking. Vui lòng kiểm tra kết nối.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings, refresh]);

  const formatDate = (d) => {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  };

  const formatTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('vi-VN', { dateStyle:'short', timeStyle:'short' });
  };

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" style={{ color:'var(--primary)', width:36, height:36, borderWidth:3 }} />
      <span>Đang tải danh sách booking...</span>
    </div>
  );

  if (error) return (
    <div className="alert alert-error anim-fade" style={{ margin:'var(--s8) 0' }}>
      <span className="alert-icon">❌</span>{error}
    </div>
  );

  return (
    <>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--s5)' }}>
        <div>
          <span style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>
            Tổng cộng: <strong style={{ color:'var(--text)' }}>{bookings.length}</strong> booking
          </span>
        </div>
        <button id="btn-refresh" className="btn btn-secondary btn-sm" onClick={fetchBookings}>
          🔄 Làm mới
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>Chưa có booking nào. Hãy đặt sân đầu tiên!</p>
        </div>
      ) : (
        <div className="table-wrap anim-fade">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Họ tên</th>
                <th>SĐT</th>
                <th>Sân</th>
                <th>Ngày</th>
                <th>Khung giờ</th>
                <th>Trạng thái</th>
                <th>Tạo lúc</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id}>
                  <td style={{ color:'var(--text-muted)', width:40 }}>{i + 1}</td>
                  <td style={{ fontWeight:600, color:'var(--text)' }}>{b.fullName}</td>
                  <td>{b.phone}</td>
                  <td>
                    <span className="badge badge-info">{b.court}</span>
                  </td>
                  <td>{formatDate(b.date)}</td>
                  <td>
                    <span style={{ fontFamily:'monospace', fontSize:'0.85rem', color:'var(--primary-light)' }}>
                      {b.timeSlot}
                    </span>
                  </td>
                  <td><StatusBadge status={b.status} /></td>
                  <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{formatTime(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default BookingList;
