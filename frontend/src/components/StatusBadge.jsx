const StatusBadge = ({ status }) => {
  const map = {
    Booked:    { cls: 'badge-success', icon: '✅', label: 'Booked' },
    Pending:   { cls: 'badge-warning', icon: '⏳', label: 'Pending' },
    Cancelled: { cls: 'badge-danger',  icon: '❌', label: 'Cancelled' },
  };
  const { cls, icon, label } = map[status] || { cls: 'badge-info', icon: '●', label: status };
  return <span className={`badge ${cls}`}>{icon} {label}</span>;
};

export default StatusBadge;
