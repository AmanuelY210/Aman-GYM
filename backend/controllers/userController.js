const { queryAll, queryOne, run } = require('../config/db');

exports.getUsers = (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (role) { where += ' AND role = ?'; params.push(role); }
    if (search) { where += ' AND (name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    const total = queryOne(`SELECT COUNT(*) as total FROM users ${where}`, params).total;
    const users = queryAll(`SELECT id, name, email, role, phone, profileImage, createdAt FROM users ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`, [...params, Number(limit), (Number(page) - 1) * Number(limit)]);
    res.json({ success: true, data: users, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (error) { next(error); }
};

exports.getUser = (req, res, next) => {
  try {
    const user = queryOne('SELECT id, name, email, role, phone, profileImage FROM users WHERE id = ?', [req.params.id]);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.updateUser = (req, res, next) => {
  try {
    const { name, email, role, phone } = req.body;
    run('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), role = COALESCE(?, role), phone = COALESCE(?, phone), updatedAt = datetime("now") WHERE id = ?', [name, email, role, phone, req.params.id]);
    const user = queryOne('SELECT id, name, email, role, phone FROM users WHERE id = ?', [req.params.id]);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.deleteUser = (req, res, next) => {
  try {
    const user = queryOne('SELECT id FROM users WHERE id = ?', [req.params.id]);
    if (!user) return res.status(404).json({ message: 'User not found' });
    run('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: {} });
  } catch (error) { next(error); }
};
