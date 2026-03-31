const AboutPage = () => {
  const info = [
    { icon: '🎓', label: 'Họ và tên',       value: 'Đỗ Thành Linh',                  highlight: true },
    { icon: '🆔', label: 'MSSV',             value: '2251220044' },
    { icon: '🏫', label: 'Lớp',              value: '22Ct1' },
    { icon: '📌', label: 'Tên dự án',        value: 'Pickleball Court Booking System' },
    { icon: '📅', label: 'Năm học',          value: '2025 – 2026' },
    { icon: '🔖', label: 'Phiên bản',        value: 'v2.0' },
  ];

  const techStack = [
    { group:'Frontend',  items:['React 18', 'Vite 5', 'React Router v6', 'Axios'] },
    { group:'Backend',   items:['Node.js 18', 'Express 4', 'Mongoose 8', 'CORS', 'dotenv'] },
    { group:'Database',  items:['MongoDB Atlas', 'Mongoose ODM'] },
    { group:'DevOps',    items:['Docker', 'Docker Compose'] },
  ];

  return (
    <div className="anim-fade">
      <div className="page-header">
        <h1>👤 Thông tin <span className="gradient-text">Sinh viên</span></h1>
        <p>Thông tin tác giả và công nghệ sử dụng trong dự án</p>
      </div>

      <div className="container" style={{ maxWidth:760, paddingBottom:'var(--s16)' }}>
        {/* ── Student Info Card ───────────────────────────── */}
        <div
          className="card card-glass"
          style={{
            marginBottom:'var(--s6)',
            borderColor:'rgba(14,165,233,0.2)',
            boxShadow:'0 0 40px rgba(14,165,233,0.08)',
          }}
        >
          {/* Avatar */}
          <div style={{ display:'flex', alignItems:'center', gap:'var(--s5)', marginBottom:'var(--s6)' }}>
            <div
              style={{
                width:72, height:72,
                background:'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'2rem',
                boxShadow:'0 4px 20px rgba(14,165,233,0.4)',
                flexShrink:0,
              }}
            >
              🧑‍💻
            </div>
            <div>
              <h2 style={{ fontSize:'1.5rem', fontWeight:800, letterSpacing:'-0.02em' }}>
                Đỗ Thành Linh
              </h2>
              <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', marginTop:2 }}>
                Sinh viên Công nghệ Thông tin
              </p>
            </div>
          </div>

          {/* Info rows */}
          {info.map(({ icon, label, value, highlight }) => (
            <div key={label} className="info-row">
              <div className="info-label">
                <span>{icon}</span>{label}
              </div>
              <div className={`info-value ${highlight ? 'highlight' : ''}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── Tech Stack Card ─────────────────────────────── */}
        <div className="card">
          <h3 className="section-title">⚙️ Công nghệ sử dụng</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--s5)' }}>
            {techStack.map(({ group, items }) => (
              <div key={group}>
                <p style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'var(--s2)' }}>
                  {group}
                </p>
                <div className="tech-pills">
                  {items.map(item => (
                    <span key={item} className="tech-pill">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── API Info ─────────────────────────────────────── */}
        <div className="card" style={{ marginTop:'var(--s6)' }}>
          <h3 className="section-title">🔌 API Endpoints</h3>
          <table className="table">
            <thead>
              <tr><th>Method</th><th>Endpoint</th><th>Mô tả</th></tr>
            </thead>
            <tbody>
              {[
                ['GET',  '/health',            '{ "status": "ok" }'],
                ['GET',  '/api/about',          'Thông tin sinh viên'],
                ['GET',  '/api/courts',         'Danh sách sân'],
                ['GET',  '/api/courts/:id/slots','Lịch trống theo ngày'],
                ['POST', '/api/bookings',        'Tạo booking mới'],
                ['GET',  '/api/bookings',        'Danh sách booking'],
              ].map(([m, ep, desc]) => (
                <tr key={ep}>
                  <td>
                    <span className={`badge ${m==='GET' ? 'badge-info' : 'badge-success'}`}>{m}</span>
                  </td>
                  <td style={{ fontFamily:'monospace', fontSize:'0.85rem', color:'var(--primary-light)' }}>{ep}</td>
                  <td style={{ fontSize:'0.875rem' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
