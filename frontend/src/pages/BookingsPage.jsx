import BookingList from '../components/BookingList';

const BookingsPage = () => {
  return (
    <div className="anim-fade">
      <div className="page-header">
        <h1>📋 Danh sách <span className="gradient-text">Booking</span></h1>
        <p>Tất cả lịch đặt sân — sắp xếp theo thời gian mới nhất</p>
      </div>

      <div className="container" style={{ paddingBottom:'var(--s16)' }}>
        <div className="card">
          <BookingList refresh={0} />
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
