import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBookings } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import BookingForm from '../components/BookingForm';
import SlotGrid from '../components/SlotGrid';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState('bookings');
  const [prefill,   setPrefill]   = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadBookings = async () => {
    setLoading(true);
    try { const r = await getBookings(); setBookings(r.data.data); }
    catch { setBookings([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadBookings(); }, [refreshKey]);

  const fmtDate = (d) => { if (!d) return '—'; const [y,m,day]=d.split('-'); return `${day}/${m}/${y}`; };

  const statusCount = (s) => bookings.filter(b => b.status === s).length;

  return (
    <div className="anim-fade">
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,rgba(139,92,246,.12) 0%,transparent 60%)', borderBottom:'1px solid var(--border)', padding:'var(--s8) 0 var(--s6)' }}>
        <div className="container" style={{ display:'flex', alignItems:'center', gap:'var(--s5)' }}>
          <div style={{ width:64, height:64, background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', borderRadius:'50%', display:'flex',alignItems:'center',justifyContent:'center', fontSize:'1.75rem', boxShadow:'0 4px 20px rgba(139,92,246,.4)' }}>
            🧑‍💻
          </div>
          <div>
            <h1 style={{ fontSize:'1.8rem', fontWeight:800, marginBottom:4 }}>Xin chào, <span className="gradient-text">{user?.fullName}</span>!</h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop:'var(--s6)', paddingBottom:'var(--s16)' }}>
        {/* Mini stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'var(--s4)', marginBottom:'var(--s6)' }}>
          {[
            { label:'Tổng booking', value: bookings.length, icon:'📋', color:'#0ea5e9' },
            { label:'Đã xác nhận', value: statusCount('Confirmed'), icon:'✅', color:'#22c55e' },
            { label:'Chờ xử lý', value: statusCount('Booked'), icon:'⏳', color:'#f59e0b' },
            { label:'Đã huỷ', value: statusCount('Cancelled'), icon:'❌', color:'#ef4444' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign:'center', borderColor:`${s.color}30` }}>
              <div style={{ fontSize:'1.8rem', marginBottom:'var(--s1)' }}>{s.icon}</div>
              <div style={{ fontSize:'1.8rem', fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'var(--s2)', marginBottom:'var(--s6)' }}>
          <button onClick={() => setTab('bookings')} className={`btn btn-sm ${tab==='bookings'?'btn-primary':'btn-secondary'}`}>📋 Lịch sử đặt sân</button>
          <button onClick={() => setTab('new')}      className={`btn btn-sm ${tab==='new'?'btn-primary':'btn-secondary'}`}>➕ Đặt sân mới</button>
        </div>

        {tab === 'bookings' && (
          <div className="card anim-fade">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'var(--s4)' }}>
              <h3 className="section-title" style={{ marginBottom:0 }}>📋 Booking của tôi</h3>
              <button className="btn btn-secondary btn-sm" onClick={loadBookings}>🔄 Làm mới</button>
            </div>
            {loading ? (
              <div className="loading-center"><div className="spinner" style={{color:'var(--primary)',width:32,height:32,borderWidth:3}} /></div>
            ) : bookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>Bạn chưa có booking nào. <button className="btn btn-primary btn-sm" style={{marginTop:'var(--s3)'}} onClick={()=>setTab('new')}>Đặt sân ngay ➕</button></p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>#</th><th>Sân</th><th>Ngày</th><th>Khung giờ</th><th>Trạng thái</th><th>Tạo lúc</th></tr></thead>
                  <tbody>
                    {bookings.map((b,i) => (
                      <tr key={b.id}>
                        <td style={{color:'var(--text-muted)'}}>{i+1}</td>
                        <td><span className="badge badge-info">{b.court}</span></td>
                        <td>{fmtDate(b.date)}</td>
                        <td style={{fontFamily:'monospace',color:'var(--primary-light)',fontSize:'0.85rem'}}>{b.timeSlot}</td>
                        <td><StatusBadge status={b.status} /></td>
                        <td style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{new Date(b.createdAt).toLocaleString('vi-VN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'new' && (
          <div className="grid-2 anim-fade" style={{ alignItems:'start' }}>
            <SlotGrid onSelect={setPrefill} />
            <BookingForm prefill={prefill} onSuccess={() => { setRefreshKey(k=>k+1); setTab('bookings'); }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
