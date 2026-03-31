const getAbout = (req, res) => {
  res.status(200).json({
    studentName: 'Đỗ Thành Linh',
    studentId:   '2251220044',
    class:       '22Ct1',
    project:     'Pickleball Court Booking System',
    version:     '2.0',
    tech: {
      frontend: 'React 18 + Vite',
      backend:  'Node.js + Express',
      database: 'MongoDB (Mongoose)',
    },
  });
};

module.exports = { getAbout };
