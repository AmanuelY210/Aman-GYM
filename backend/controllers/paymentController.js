const { queryAll, queryOne, run } = require('../config/db');

exports.getPayments = (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, type, memberId } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (status) { where += ' AND p.status = ?'; params.push(status); }
    if (type) { where += ' AND p.type = ?'; params.push(type); }
    if (memberId) { where += ' AND p.memberId = ?'; params.push(memberId); }

    const total = queryOne(`SELECT COUNT(*) as total FROM payments p ${where}`, params).total;
    const payments = queryAll(`SELECT p.*, u.name as memberName
      FROM payments p JOIN members m ON p.memberId = m.id JOIN users u ON m.userId = u.id
      ${where} ORDER BY p.createdAt DESC LIMIT ? OFFSET ?`, [...params, Number(limit), (Number(page) - 1) * Number(limit)]);
    const rev = queryOne('SELECT COALESCE(SUM(amount), 0) as totalRevenue FROM payments WHERE status = "completed"');
    res.json({ success: true, data: payments, total, pages: Math.ceil(total / limit), currentPage: Number(page), totalRevenue: rev.totalRevenue });
  } catch (error) { next(error); }
};

exports.createPayment = (req, res, next) => {
  try {
    const { memberId, amount, type, paymentMethod, description, status } = req.body;
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const paidAt = status === 'completed' ? new Date().toISOString() : null;
    const result = run('INSERT INTO payments (memberId, amount, type, paymentMethod, invoiceNumber, description, status, paidAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [memberId, amount, type, paymentMethod, invoiceNumber, description || null, status || 'pending', paidAt]);
    const payment = queryOne('SELECT * FROM payments WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, data: payment });
  } catch (error) { next(error); }
};

exports.updatePayment = (req, res, next) => {
  try {
    const { status, amount, type, paymentMethod } = req.body;
    const paidAt = status === 'completed' ? new Date().toISOString() : null;
    run(`UPDATE payments SET status = COALESCE(?, status), amount = COALESCE(?, amount),
      type = COALESCE(?, type), paymentMethod = COALESCE(?, paymentMethod),
      paidAt = COALESCE(?, paidAt), updatedAt = datetime('now') WHERE id = ?`,
      [status, amount, type, paymentMethod, paidAt, req.params.id]);
    const payment = queryOne('SELECT * FROM payments WHERE id = ?', [req.params.id]);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (error) { next(error); }
};

exports.getMyPayments = (req, res, next) => {
  try {
    const member = queryOne('SELECT id FROM members WHERE userId = ?', [req.user.id]);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    const payments = queryAll('SELECT * FROM payments WHERE memberId = ? ORDER BY createdAt DESC', [member.id]);
    res.json({ success: true, data: payments });
  } catch (error) { next(error); }
};
