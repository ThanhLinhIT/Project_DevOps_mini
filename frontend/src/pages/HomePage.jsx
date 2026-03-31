import { useState } from 'react';
import SlotGrid from '../components/SlotGrid';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';

const HomePage = () => {
  const [prefill,  setPrefill]  = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSlotSelect = (data) => {
    setPrefill(data);
    // Smooth scroll to form on mobile
    setTimeout(() => {
      document.getElementById('booking-form-section')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }, 100);
  };

  const handleBookingSuccess = () => {
    setRefreshKey(k => k + 1); // re-fetch bookings list
    setPrefill(null);
  };

  return (
    <div className="anim-fade">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(30,41,59,0) 60%)',
          borderBottom: '1px solid var(--border)',
          padding: 'var(--s10) 0 var(--s8)',
        }}
      >
        <div className="container" style={{ textAlign:'center' }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'var(--s3)' }}>🏓</div>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.75rem)', fontWeight:800, letterSpacing:'-0.03em', marginBottom:'var(--s3)' }}>
            Đặt sân <span className="gradient-text">Pickleball</span> Online
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:'1.0625rem', maxWidth:500, margin:'0 auto' }}>
            Chọn sân, chọn giờ, điền thông tin — đặt sân trong vòng 30 giây. Không cần gọi điện!
          </p>
          <div style={{ display:'flex', gap:'var(--s3)', justifyContent:'center', marginTop:'var(--s6)', flexWrap:'wrap' }}>
            <span className="badge badge-success">✅ Không trùng lịch</span>
            <span className="badge badge-info">⚡ Realtime</span>
            <span className="badge badge-warning">🏆 4 sân sẵn sàng</span>
          </div>
        </div>
      </div>

      {/* ── Main Grid: SlotGrid + BookingForm ──────────────── */}
      <div className="container" style={{ padding:'var(--s8) var(--s6)' }}>
        <div id="booking-form-section" className="grid-2" style={{ alignItems:'start' }}>
          <SlotGrid onSelect={handleSlotSelect} />
          <BookingForm prefill={prefill} onSuccess={handleBookingSuccess} />
        </div>

        {/* ── Recent Bookings ─────────────────────────────── */}
        <div className="card" style={{ marginTop:'var(--s8)' }}>
          <h3 className="section-title">📋 Booking gần đây</h3>
          <BookingList refresh={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
