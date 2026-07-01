const { queryAll, queryOne, run } = require('../config/db');

exports.getTrainers = (req, res, next) => {
  try {
    const { page = 1, limit = 10, specialty, search } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (specialty) { where += ' AND t.specialties LIKE ?'; params.push(`%${specialty}%`); }
    if (search) { where += ' AND (u.name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    const total = queryOne(`SELECT COUNT(*) as total FROM trainers t JOIN users u ON t.userId = u.id ${where}`, params).total;
    const trainers = queryAll(`SELECT t.*, u.name, u.email, u.phone, u.profileImage
      FROM trainers t JOIN users u ON t.userId = u.id ${where} ORDER BY t.rating DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), (Number(page) - 1) * Number(limit)]);

    const enriched = trainers.map(t => ({
      ...t,
      specialties: JSON.parse(t.specialties || '[]'),
      availability: queryAll('SELECT day, startTime, endTime FROM trainer_availability WHERE trainerId = ?', [t.id]),
      certifications: queryAll('SELECT name, issuedBy, year FROM trainer_certifications WHERE trainerId = ?', [t.id]),
    }));

    res.json({ success: true, data: enriched, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (error) { next(error); }
};

exports.getTrainer = (req, res, next) => {
  try {
    const trainer = queryOne('SELECT t.*, u.name, u.email, u.phone, u.profileImage FROM trainers t JOIN users u ON t.userId = u.id WHERE t.id = ?', [req.params.id]);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    trainer.specialties = JSON.parse(trainer.specialties || '[]');
    trainer.availability = queryAll('SELECT day, startTime, endTime FROM trainer_availability WHERE trainerId = ?', [trainer.id]);
    trainer.certifications = queryAll('SELECT name, issuedBy, year FROM trainer_certifications WHERE trainerId = ?', [trainer.id]);
    res.json({ success: true, data: trainer });
  } catch (error) { next(error); }
};

exports.createTrainer = (req, res, next) => {
  try {
    const { userId, specialties, bio, hourlyRate, yearsExperience, availability } = req.body;
    const result = run('INSERT INTO trainers (userId, specialties, bio, hourlyRate, yearsExperience) VALUES (?, ?, ?, ?, ?)',
      [userId, JSON.stringify(specialties || []), bio || '', hourlyRate || 0, yearsExperience || 0]);

    if (availability && availability.length > 0) {
      availability.forEach(a => run('INSERT INTO trainer_availability (trainerId, day, startTime, endTime) VALUES (?, ?, ?, ?)',
        [result.lastInsertRowid, a.day, a.startTime, a.endTime]));
    }

    const trainer = queryOne('SELECT * FROM trainers WHERE id = ?', [result.lastInsertRowid]);
    trainer.specialties = JSON.parse(trainer.specialties || '[]');
    res.status(201).json({ success: true, data: trainer });
  } catch (error) { next(error); }
};

exports.updateTrainer = (req, res, next) => {
  try {
    const { specialties, bio, hourlyRate, yearsExperience, rating } = req.body;
    run(`UPDATE trainers SET specialties = COALESCE(?, specialties), bio = COALESCE(?, bio),
      hourlyRate = COALESCE(?, hourlyRate), yearsExperience = COALESCE(?, yearsExperience),
      rating = COALESCE(?, rating), updatedAt = datetime('now') WHERE id = ?`,
      [specialties ? JSON.stringify(specialties) : null, bio, hourlyRate, yearsExperience, rating, req.params.id]);
    const trainer = queryOne('SELECT * FROM trainers WHERE id = ?', [req.params.id]);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    trainer.specialties = JSON.parse(trainer.specialties || '[]');
    res.json({ success: true, data: trainer });
  } catch (error) { next(error); }
};

exports.deleteTrainer = (req, res, next) => {
  try {
    const trainer = queryOne('SELECT id FROM trainers WHERE id = ?', [req.params.id]);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    run('DELETE FROM trainers WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: {} });
  } catch (error) { next(error); }
};
