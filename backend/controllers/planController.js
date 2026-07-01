const { queryAll, queryOne, run } = require('../config/db');

const parsePlan = (p) => p ? { ...p, features: JSON.parse(p.features || '[]') } : p;

exports.getPlans = (req, res, next) => {
  try {
    const plans = queryAll('SELECT * FROM membership_plans WHERE isActive = 1 ORDER BY price ASC').map(parsePlan);
    res.json({ success: true, data: plans });
  } catch (error) { next(error); }
};

exports.getAllPlans = (req, res, next) => {
  try {
    const plans = queryAll('SELECT * FROM membership_plans ORDER BY price ASC').map(parsePlan);
    res.json({ success: true, data: plans });
  } catch (error) { next(error); }
};

exports.getPlan = (req, res, next) => {
  try {
    const plan = parsePlan(queryOne('SELECT * FROM membership_plans WHERE id = ?', [req.params.id]));
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ success: true, data: plan });
  } catch (error) { next(error); }
};

exports.createPlan = (req, res, next) => {
  try {
    const { name, description, price, duration, features } = req.body;
    const result = run('INSERT INTO membership_plans (name, description, price, duration, features) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, duration, JSON.stringify(features || [])]);
    const plan = parsePlan(queryOne('SELECT * FROM membership_plans WHERE id = ?', [result.lastInsertRowid]));
    res.status(201).json({ success: true, data: plan });
  } catch (error) { next(error); }
};

exports.updatePlan = (req, res, next) => {
  try {
    const { name, description, price, duration, features, isActive } = req.body;
    run(`UPDATE membership_plans SET name = COALESCE(?, name), description = COALESCE(?, description),
      price = COALESCE(?, price), duration = COALESCE(?, duration), features = COALESCE(?, features),
      isActive = COALESCE(?, isActive), updatedAt = datetime('now') WHERE id = ?`,
      [name, description, price, duration, features ? JSON.stringify(features) : null, isActive, req.params.id]);
    const plan = parsePlan(queryOne('SELECT * FROM membership_plans WHERE id = ?', [req.params.id]));
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ success: true, data: plan });
  } catch (error) { next(error); }
};

exports.deletePlan = (req, res, next) => {
  try {
    const plan = queryOne('SELECT * FROM membership_plans WHERE id = ?', [req.params.id]);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    run('UPDATE membership_plans SET isActive = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: { id: plan.id, isActive: false } });
  } catch (error) { next(error); }
};
