const { queryAll, queryOne, run } = require('../config/db');

exports.getBookings = (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, memberId } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (status) { where += ' AND b.status = ?'; params.push(status); }
    if (memberId) { where += ' AND b.memberId = ?'; params.push(memberId); }

    const total = queryOne(`SELECT COUNT(*) as total FROM bookings b ${where}`, params).total;
    const bookings = queryAll(`SELECT b.*, u.name as memberName, c.name as className, c.category, c.difficulty, tu.name as trainerName
      FROM bookings b JOIN members m ON b.memberId = m.id JOIN users u ON m.userId = u.id
      JOIN classes c ON b.classId = c.id JOIN trainers t ON c.trainerId = t.id JOIN users tu ON t.userId = tu.id
      ${where} ORDER BY b.date DESC LIMIT ? OFFSET ?`, [...params, Number(limit), (Number(page) - 1) * Number(limit)]);
    res.json({ success: true, data: bookings, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (error) { next(error); }
};

exports.createBooking = (req, res, next) => {
  try {
    const { classId, date, notes } = req.body;
    const member = queryOne('SELECT id FROM members WHERE userId = ?', [req.user.id]);
    if (!member) return res.status(404).json({ message: 'Member profile not found' });

    const cls = queryOne('SELECT id FROM classes WHERE id = ?', [classId]);
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    const existing = queryOne('SELECT id FROM bookings WHERE memberId = ? AND classId = ? AND date = ? AND status = "confirmed"', [member.id, classId, date]);
    if (existing) return res.status(400).json({ message: 'Already booked for this class' });

    const result = run('INSERT INTO bookings (memberId, classId, date, notes) VALUES (?, ?, ?, ?)', [member.id, classId, date, notes || null]);
    const booking = queryOne('SELECT b.*, c.name as className FROM bookings b JOIN classes c ON b.classId = c.id WHERE b.id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, data: booking });
  } catch (error) { next(error); }
};

exports.updateBooking = (req, res, next) => {
  try {
    const { status, notes } = req.body;
    run('UPDATE bookings SET status = COALESCE(?, status), notes = COALESCE(?, notes), updatedAt = datetime("now") WHERE id = ?', [status, notes, req.params.id]);
    const booking = queryOne('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) { next(error); }
};

exports.cancelBooking = (req, res, next) => {
  try {
    const booking = queryOne('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    run('UPDATE bookings SET status = "cancelled", updatedAt = datetime("now") WHERE id = ?', [req.params.id]);
    const updated = queryOne('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
};

exports.getMyBookings = (req, res, next) => {
  try {
    const member = queryOne('SELECT id FROM members WHERE userId = ?', [req.user.id]);
    if (!member) return res.status(404).json({ message: 'Member profile not found' });

    const bookings = queryAll(`SELECT b.*, c.name as className, c.category, c.duration, tu.name as trainerName
      FROM bookings b JOIN classes c ON b.classId = c.id
      JOIN trainers t ON c.trainerId = t.id JOIN users tu ON t.userId = tu.id
      WHERE b.memberId = ? ORDER BY b.date DESC`, [member.id]);
    res.json({ success: true, data: bookings });
  } catch (error) { next(error); }
};
