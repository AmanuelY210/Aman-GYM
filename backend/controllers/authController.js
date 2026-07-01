const { queryAll, queryOne, run } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const existing = queryOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = run('INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, role || 'member', phone || null]);

    if ((role || 'member') === 'member') {
      run('INSERT INTO members (userId) VALUES (?)', [result.lastInsertRowid]);
    }

    const user = queryOne('SELECT id, name, email, role, phone FROM users WHERE id = ?', [result.lastInsertRowid]);
    const token = generateToken(user);
    res.status(201).json({ success: true, token, data: user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const user = queryOne('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, token, data: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

exports.getMe = (req, res) => {
  const user = queryOne('SELECT id, name, email, role, phone, profileImage FROM users WHERE id = ?', [req.user.id]);
  res.json({ success: true, data: user });
};

exports.updateProfile = (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    run('UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone), updatedAt = datetime("now") WHERE id = ?', [name, email, phone, req.user.id]);
    const user = queryOne('SELECT id, name, email, role, phone FROM users WHERE id = ?', [req.user.id]);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
