import { useState, useEffect } from 'react';
import { getCourts, createBooking } from '../services/api';

const today = () => new Date().toISOString().split('T')[0];

const TIME_SLOTS = [
  '06:00-07:00','07:00-08:00','08:00-09:00','09:00-10:00',
  '10:00-11:00','11:00-12:00','13:00-14:00','14:00-15:00',
  '15:00-16:00','16:00-17:00','17:00-18:00','18:00-19:00',
  '19:00-20:00','20:00-21:00',
];

const initForm = { fullName:'', phone:'', courtId:'', date: today(), timeSlot:'' };

const BookingForm = ({ prefill, onSuccess }) => {
  const [form,    setForm]    = useState(initForm);
  const [courts,  setCourts]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState(null); // { type:'success'|'error', msg, details }

  useEffect(() => {
    getCourts().then(r => {
      setCourts(r.data.data);
      setForm(f => ({ ...f, courtId: r.data.data[0]?._id || '' }));
    }).catch(() => {});
  }, []);

  // Sync prefill from SlotGrid
  useEffect(() => {
    if (!prefill) return;
    setForm(f => ({
      ...f,
      courtId:  prefill.courtId  || f.courtId,
      date:     prefill.date     || f.date,
      timeSlot: prefill.timeSlot || f.timeSlot,
    }));
    setStatus(null);
  }, [prefill]);

  const onChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await createBooking(form);
      setStatus({ type:'success', msg: res.data.message });
      setForm({ ...initForm, courtId: courts[0]?._id || '', date: today() });
      onSuccess?.();
    } catch (err) {
      const data = err.response?.data;
      setStatus({
        type: 'error',
        msg: data?.error || 'Có lỗi xảy ra, vui lòng thử lại.',
        details: data?.details || [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ height:'100%' }}>
      <h3 className="section-title">📝 Đặt sân Pickleball</h3>

      {status && (
        <div className={`alert alert-${status.type} anim-fade`} style={{ marginBottom:'var(--s5)' }}>
          <span className="alert-icon">{status.type === 'success' ? '✅' : '❌'}</span>
          <div>
            {status.msg}
            {status.details?.length > 0 && (
              <ul>{status.details.map((d,i) => <li key={i}>{d}</li>)}</ul>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'var(--s4)' }}>
        <div className="form-group">
          <label className="form-label">
            Họ và tên <span className="required">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            className="form-control"
            placeholder="Nguyễn Văn A"
            value={form.fullName}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Số điện thoại <span className="required">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            className="form-control"
            placeholder="0912345678"
            maxLength={10}
            value={form.phone}
            onChange={onChange}
            required
          />
        </div>

        <div className="grid-2" style={{ gap:'var(--s3)' }}>
          <div className="form-group">
            <label className="form-label">Sân <span className="required">*</span></label>
            <select id="courtId" name="courtId" className="form-control" value={form.courtId} onChange={onChange} required>
              <option value="">-- Chọn sân --</option>
              {courts.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Ngày <span className="required">*</span></label>
            <input
              id="date"
              type="date"
              name="date"
              className="form-control"
              min={today()}
              value={form.date}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Khung giờ <span className="required">*</span></label>
          <select id="timeSlot" name="timeSlot" className="form-control" value={form.timeSlot} onChange={onChange} required>
            <option value="">-- Chọn khung giờ --</option>
            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <button id="btn-submit-booking" type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
          {loading ? <><span className="spinner" /> &nbsp; Đang đặt...</> : '⚡ Đặt sân ngay'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
