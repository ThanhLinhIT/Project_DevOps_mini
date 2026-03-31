import { useState, useEffect, useCallback } from 'react';
import { getStats, getBookings, getUsers, updateBookingStatus, deleteBooking,
         getCourts, createCourt, updateCourt, deleteCourt,
         toggleUserStatus, deleteUser } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const AdminDashboard = () => {
  const [tab,      setTab]      = useState('overview');
  const [stats,    setStats]    = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [courts,   setCourts]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState('');

  // Court form
  const [courtForm,    setCourtForm]    = useState({ name: '', location: '' });
  const [editingCourt, setEditingCourt] = useState(null);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const loadStats = useCallback(async () => {
    const r = await getStats(); setStats(r.data.data);
  }, []);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    const r = await getBookings(); setBookings(r.data.data);
    setLoading(false);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const r = await getUsers(); setUsers(r.data.data);
    setLoading(false);
  }, []);

  const loadCourts = useCallback(async () => {
    const r = await getCourts(); setCourts(r.data.data);
  }, []);

  useEffect(() => {
    loadStats();
    if (tab === 'bookings') loadBookings();
    if (tab === 'users')    loadUsers();
    if (tab === 'courts')   loadCourts();
  }, [tab]);

  const changeStatus = async (id, status) => {
    await updateBookingStatus(id, status);
    flash(`✅ Đã cập nhật trạng thái → ${status}`);
    loadBookings();
    loadStats();
  };

  const removeBooking = async (id) => {
    if (!confirm('Xóa booking này?')) return;
    await deleteBooking(id); flash('🗑️ Đã xóa booking'); loadBookings(); loadStats();
  };

  const handleToggleUser = async (id) => {
    await toggleUserStatus(id); flash('✅ Đã cập nhật trạng thái người dùng'); loadUsers();
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Xóa người dùng này?')) return;
    await deleteUser(id); flash('🗑️ Đã xóa người dùng'); loadUsers(); loadStats();
  };

  const handleSaveCourt = async () => {
    if (!courtForm.name.trim()) return;
    if (editingCourt) {
      await updateCourt(editingCourt._id, courtForm);
      flash('✅ Cập nhật sân thành công');
    } else {
      await createCourt(courtForm);
      flash('✅ Tạo sân thành công');
    }
    setCourtForm({ name: '', location: '' }); setEditingCourt(null); loadCourts();
  };

  const handleDeleteCourt = async (id) => {
    if (!confirm('Xóa sân này?')) return;
    await deleteCourt(id); flash('🗑️ Đã xóa sân'); loadCourts(); loadStats();
  };

  const fmtDate = (d) => { if (!d) return '—'; const [y,m,day]=d.split('-'); return `${day}/${m}/${y}`; };
  const fmtTime = (iso) => iso ? new Date(iso).toLocaleString('vi-VN',{dateStyle:'short',timeStyle:'short'}) : '—';

  const TABS = [
    { key:'overview', icon:'📊', label:'Tổng quan' },
    { key:'bookings', icon:'📋', label:'Bookings' },
    { key:'users',    icon:'👥', label:'Người dùng' },
    { key:'courts',   icon:'🏟️', label:'Sân' },
  ];

  return (
    <div className="anim-fade">
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,rgba(14,165,233,.15) 0%,transparent 60%)', borderBottom:'1px solid var(--border)', padding:'var(--s8) 0 var(--s6)' }}>
        <div className="container">
          <h1 style={{ fontSize:'1.8rem', fontWeight:800 }}>⚙️ Admin <span className="gradient-text">Dashboard</span></h1>
          <p style={{ color:'var(--text-muted)' }}>Quản lý toàn bộ hệ thống đặt sân Pickleball</p>
        </div>
      </div>

      {msg && <div className="alert alert-success anim-fade" style={{ margin:'var(--s4) var(--s6)' }}><span className="alert-icon">✅</span>{msg}</div>}

      <div className="container" style={{ paddingTop:'var(--s6)', paddingBottom:'var(--s16)' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:'var(--s2)', marginBottom:'var(--s6)', borderBottom:'1px solid var(--border)', paddingBottom:'var(--s3)' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`btn btn-sm ${tab===t.key ? 'btn-primary' : 'btn-secondary'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Overview ─────────────────────────────────── */}
        {tab === 'overview' && stats && (
          <div className="anim-fade">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'var(--s4)', marginBottom:'var(--s8)' }}>
              {[
                { label:'Tổng người dùng', value: stats.totalUsers,    icon:'👥', color:'#0ea5e9' },
                { label:'Tổng booking',     value: stats.totalBookings, icon:'📋', color:'#8b5cf6' },
                { label:'Tổng sân',         value: stats.totalCourts,   icon:'🏟️', color:'#f59e0b' },
                { label:'Đã xác nhận',      value: stats.confirmed,     icon:'✅', color:'#22c55e' },
                { label:'Đã huỷ',           value: stats.cancelled,     icon:'❌', color:'#ef4444' },
              ].map(s => (
                <div key={s.label} className="card" style={{ borderColor: `${s.color}30` }}>
                  <div style={{ fontSize:'2rem', marginBottom:'var(--s2)' }}>{s.icon}</div>
                  <div style={{ fontSize:'2rem', fontWeight:800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Bookings ──────────────────────────────────── */}
        {tab === 'bookings' && (
          <div className="anim-fade">
            <div className="card">
              <h3 className="section-title">📋 Tất cả booking</h3>
              {loading ? <div className="loading-center"><div className="spinner" style={{color:'var(--primary)',width:32,height:32,borderWidth:3}} /></div> : (
                <div className="table-wrap">
                  <table className="table">
                    <thead><tr><th>#</th><th>Khách hàng</th><th>Người dùng</th><th>Sân</th><th>Ngày</th><th>Giờ</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
                    <tbody>
                      {bookings.map((b,i) => (
                        <tr key={b.id}>
                          <td style={{color:'var(--text-muted)'}}>{i+1}</td>
                          <td><div style={{fontWeight:600,color:'var(--text)'}}>{b.fullName}</div><div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{b.phone}</div></td>
                          <td style={{fontSize:'0.85rem'}}>{b.bookedBy || <em style={{color:'var(--text-muted)'}}>Khách</em>}</td>
                          <td><span className="badge badge-info">{b.court}</span></td>
                          <td>{fmtDate(b.date)}</td>
                          <td style={{fontFamily:'monospace',color:'var(--primary-light)',fontSize:'0.82rem'}}>{b.timeSlot}</td>
                          <td><StatusBadge status={b.status} /></td>
                          <td>
                            <div style={{display:'flex',gap:'var(--s2)',flexWrap:'wrap'}}>
                              {b.status !== 'Confirmed' && <button className="btn btn-sm" style={{background:'rgba(34,197,94,.15)',color:'#4ade80',border:'1px solid rgba(34,197,94,.25)'}} onClick={()=>changeStatus(b.id,'Confirmed')}>✅</button>}
                              {b.status !== 'Cancelled' && <button className="btn btn-sm" style={{background:'rgba(239,68,68,.15)',color:'#f87171',border:'1px solid rgba(239,68,68,.25)'}} onClick={()=>changeStatus(b.id,'Cancelled')}>❌</button>}
                              <button className="btn btn-sm btn-secondary" onClick={()=>removeBooking(b.id)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!bookings.length && <div className="empty-state"><div className="empty-icon">📋</div><p>Chưa có booking nào</p></div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Users ─────────────────────────────────────── */}
        {tab === 'users' && (
          <div className="anim-fade">
            <div className="card">
              <h3 className="section-title">👥 Danh sách người dùng</h3>
              {loading ? <div className="loading-center"><div className="spinner" style={{color:'var(--primary)',width:32,height:32,borderWidth:3}} /></div> : (
                <div className="table-wrap">
                  <table className="table">
                    <thead><tr><th>#</th><th>Họ tên</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Trạng thái</th><th>Tạo lúc</th><th>Hành động</th></tr></thead>
                    <tbody>
                      {users.map((u,i) => (
                        <tr key={u._id}>
                          <td style={{color:'var(--text-muted)'}}>{i+1}</td>
                          <td style={{fontWeight:600,color:'var(--text)'}}>{u.fullName}</td>
                          <td style={{fontSize:'0.85rem'}}>{u.email}</td>
                          <td style={{fontSize:'0.85rem'}}>{u.phone || '—'}</td>
                          <td><span className={`badge ${u.role==='admin'?'badge-warning':'badge-info'}`}>{u.role==='admin'?'👑 Admin':'👤 User'}</span></td>
                          <td><span className={`badge ${u.isActive?'badge-success':'badge-danger'}`}>{u.isActive?'✅ Active':'🚫 Locked'}</span></td>
                          <td style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{fmtTime(u.createdAt)}</td>
                          <td>
                            <div style={{display:'flex',gap:'var(--s2)'}}>
                              {u.role !== 'admin' && <>
                                <button className="btn btn-sm btn-secondary" onClick={()=>handleToggleUser(u._id)}>{u.isActive?'🔒':'🔓'}</button>
                                <button className="btn btn-sm" style={{background:'rgba(239,68,68,.15)',color:'#f87171',border:'1px solid rgba(239,68,68,.25)'}} onClick={()=>handleDeleteUser(u._id)}>🗑️</button>
                              </>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Courts ────────────────────────────────────── */}
        {tab === 'courts' && (
          <div className="anim-fade" style={{display:'flex',flexDirection:'column',gap:'var(--s6)'}}>
            {/* Add/Edit form */}
            <div className="card">
              <h3 className="section-title">{editingCourt ? '✏️ Sửa sân' : '➕ Thêm sân mới'}</h3>
              <div style={{display:'flex',gap:'var(--s3)',flexWrap:'wrap',alignItems:'flex-end'}}>
                <div className="form-group" style={{flex:1,minWidth:160}}>
                  <label className="form-label">Tên sân</label>
                  <input className="form-control" placeholder="Sân E" value={courtForm.name} onChange={e=>setCourtForm(f=>({...f,name:e.target.value}))} />
                </div>
                <div className="form-group" style={{flex:2,minWidth:200}}>
                  <label className="form-label">Vị trí</label>
                  <input className="form-control" placeholder="Khu vực 5 - Tầng 2" value={courtForm.location} onChange={e=>setCourtForm(f=>({...f,location:e.target.value}))} />
                </div>
                <button className="btn btn-primary" onClick={handleSaveCourt}>{editingCourt?'💾 Lưu':'➕ Thêm'}</button>
                {editingCourt && <button className="btn btn-secondary" onClick={()=>{setEditingCourt(null);setCourtForm({name:'',location:''});}}>Hủy</button>}
              </div>
            </div>
            {/* Court list */}
            <div className="card">
              <h3 className="section-title">🏟️ Danh sách sân ({courts.length})</h3>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'var(--s4)'}}>
                {courts.map(c => (
                  <div key={c._id} style={{background:'var(--surface-2)',borderRadius:'var(--r)',padding:'var(--s4)',border:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontWeight:700,color:'var(--text)'}}>{c.name}</div>
                      <div style={{fontSize:'0.82rem',color:'var(--text-muted)',marginTop:2}}>{c.location}</div>
                    </div>
                    <div style={{display:'flex',gap:'var(--s2)'}}>
                      <button className="btn btn-sm btn-secondary" onClick={()=>{setEditingCourt(c);setCourtForm({name:c.name,location:c.location});}}>✏️</button>
                      <button className="btn btn-sm" style={{background:'rgba(239,68,68,.15)',color:'#f87171',border:'1px solid rgba(239,68,68,.25)'}} onClick={()=>handleDeleteCourt(c._id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
