import { useState, useEffect } from 'react';
import { getCourts, getCourtSlots } from '../services/api';

const today = () => new Date().toISOString().split('T')[0];

const SlotGrid = ({ onSelect }) => {
  const [courts,  setCourts]  = useState([]);
  const [courtId, setCourtId] = useState('');
  const [date,    setDate]    = useState(today());
  const [slots,   setSlots]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('');

  // Load courts once
  useEffect(() => {
    getCourts()
      .then(r => {
        setCourts(r.data.data);
        if (r.data.data.length) setCourtId(r.data.data[0]._id);
      })
      .catch(() => {});
  }, []);

  // Load slots when court/date changes
  useEffect(() => {
    if (!courtId || !date) return;
    setLoading(true);
    setSelected('');
    getCourtSlots(courtId, date)
      .then(r => setSlots(r.data.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [courtId, date]);

  const handleSlot = (slot) => {
    if (slot.status !== 'available') return;
    setSelected(slot.time);
    const court = courts.find(c => c._id === courtId);
    onSelect?.({ courtId, courtName: court?.name, date, timeSlot: slot.time });
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <h3 className="section-title">🏟️ Chọn sân & khung giờ</h3>

      {/* Controls */}
      <div style={{ display:'flex', gap:'var(--s3)', marginBottom:'var(--s5)', flexWrap:'wrap' }}>
        <div className="form-group" style={{ flex:1, minWidth:140 }}>
          <label className="form-label">Sân</label>
          <select className="form-control" value={courtId} onChange={e => setCourtId(e.target.value)}>
            {courts.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ flex:1, minWidth:140 }}>
          <label className="form-label">Ngày</label>
          <input
            type="date"
            className="form-control"
            value={date}
            min={today()}
            onChange={e => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:'var(--s4)', marginBottom:'var(--s4)', fontSize:'0.8rem', color:'var(--text-muted)' }}>
        <span style={{ color:'#4ade80' }}>● Còn trống</span>
        <span style={{ color:'var(--text-muted)' }}>● Đã đặt</span>
        <span style={{ color:'#86efac' }}>✔ Đang chọn</span>
      </div>

      {/* Slot grid */}
      {loading ? (
        <div className="loading-center" style={{ paddingTop:'var(--s8)' }}>
          <div className="spinner" style={{ color:'var(--primary)', width:28, height:28, borderWidth:3 }} />
          <span>Đang tải lịch...</span>
        </div>
      ) : slots.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗓️</div>
          <p>Không có dữ liệu khung giờ</p>
        </div>
      ) : (
        <div className="slot-grid">
          {slots.map(slot => (
            <div
              key={slot.time}
              className={`slot-item ${slot.status} ${selected === slot.time ? 'selected' : ''}`}
              onClick={() => handleSlot(slot)}
              title={slot.status === 'booked' ? 'Đã được đặt' : 'Click để chọn'}
            >
              <span className="slot-time">{slot.time}</span>
              <span className="slot-label">{slot.status === 'booked' ? '🔴 Đã đặt' : '🟢 Trống'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotGrid;
