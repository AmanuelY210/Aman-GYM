const { queryAll, queryOne, run } = require('../config/db');

exports.getClasses = (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, difficulty } = req.query;
    let where = 'WHERE c.isActive = 1';
    const params = [];
    if (category) { where += ' AND c.category = ?'; params.push(category); }
    if (difficulty) { where += ' AND c.difficulty = ?'; params.push(difficulty); }

    const total = queryOne(`SELECT COUNT(*) as total FROM classes c ${where}`, params).total;
    const classes = queryAll(`SELECT c.*, t.id as trainerId, u.name as trainerName
      FROM classes c JOIN trainers t ON c.trainerId = t.id JOIN users u ON t.userId = u.id
      ${where} ORDER BY c.name LIMIT ? OFFSET ?`, [...params, Number(limit), (Number(page) - 1) * Number(limit)]);

    const enriched = classes.map(c => ({
      ...c,
      schedule: queryAll('SELECT day, startTime, endTime, maxCapacity, currentEnrollment FROM class_schedules WHERE classId = ?', [c.id]),
    }));

    res.json({ success: true, data: enriched, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (error) { next(error); }
};

exports.getClass = (req, res, next) => {
  try {
    const cls = queryOne(`SELECT c.*, t.id as trainerId, u.name as trainerName
      FROM classes c JOIN trainers t ON c.trainerId = t.id JOIN users u ON t.userId = u.id WHERE c.id = ?`, [req.params.id]);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    cls.schedule = queryAll('SELECT day, startTime, endTime, maxCapacity, currentEnrollment FROM class_schedules WHERE classId = ?', [cls.id]);
    res.json({ success: true, data: cls });
  } catch (error) { next(error); }
};

exports.createClass = (req, res, next) => {
  try {
    const { name, description, trainerId, category, difficulty, duration, price, schedule } = req.body;
    const result = run('INSERT INTO classes (name, description, trainerId, category, difficulty, duration, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, trainerId, category, difficulty || 'beginner', duration || 60, price || 0]);
    if (schedule && schedule.length > 0) {
      schedule.forEach(s => run('INSERT INTO class_schedules (classId, day, startTime, endTime, maxCapacity) VALUES (?, ?, ?, ?, ?)',
        [result.lastInsertRowid, s.day, s.startTime, s.endTime, s.maxCapacity || 20]));
    }
    const cls = queryOne('SELECT * FROM classes WHERE id = ?', [result.lastInsertRowid]);
    cls.schedule = queryAll('SELECT * FROM class_schedules WHERE classId = ?', [cls.id]);
    res.status(201).json({ success: true, data: cls });
  } catch (error) { next(error); }
};

exports.updateClass = (req, res, next) => {
  try {
    const { name, description, trainerId, category, difficulty, duration, price, isActive } = req.body;
    run(`UPDATE classes SET name = COALESCE(?, name), description = COALESCE(?, description),
      trainerId = COALESCE(?, trainerId), category = COALESCE(?, category), difficulty = COALESCE(?, difficulty),
      duration = COALESCE(?, duration), price = COALESCE(?, price), isActive = COALESCE(?, isActive),
      updatedAt = datetime('now') WHERE id = ?`, [name, description, trainerId, category, difficulty, duration, price, isActive, req.params.id]);
    const cls = queryOne('SELECT * FROM classes WHERE id = ?', [req.params.id]);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    cls.schedule = queryAll('SELECT * FROM class_schedules WHERE classId = ?', [cls.id]);
    res.json({ success: true, data: cls });
  } catch (error) { next(error); }
};

exports.deleteClass = (req, res, next) => {
  try {
    const cls = queryOne('SELECT id FROM classes WHERE id = ?', [req.params.id]);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    run('DELETE FROM classes WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: {} });
  } catch (error) { next(error); }
};

exports.getClassSchedule = (req, res, next) => {
  try {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = {};
    days.forEach(d => schedule[d] = []);

    const classes = queryAll(`SELECT c.*, cs.day, cs.startTime, cs.endTime, cs.maxCapacity, u.name as trainerName
      FROM classes c JOIN class_schedules cs ON c.id = cs.classId
      JOIN trainers t ON c.trainerId = t.id JOIN users u ON t.userId = u.id
      WHERE c.isActive = 1 ORDER BY cs.startTime`);

    classes.forEach(c => {
      if (schedule[c.day]) {
        schedule[c.day].push({
          id: c.id, name: c.name, description: c.description,
          category: c.category, difficulty: c.difficulty, duration: c.duration,
          trainerName: c.trainerName,
          timeSlot: { day: c.day, startTime: c.startTime, endTime: c.endTime, maxCapacity: c.maxCapacity }
        });
      }
    });

    res.json({ success: true, data: schedule });
  } catch (error) { next(error); }
};
