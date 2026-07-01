const { queryAll, queryOne, run } = require('../config/db');

exports.getMembers = (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (status) { where += ' AND m.status = ?'; params.push(status); }
    if (search) { where += ' AND (u.name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    const total = queryOne(`SELECT COUNT(*) as total FROM members m JOIN users u ON m.userId = u.id ${where}`, params).total;
    const members = queryAll(`SELECT m.*, u.name, u.email, u.phone, u.profileImage, mp.name as planName, mp.price as planPrice
      FROM members m JOIN users u ON m.userId = u.id LEFT JOIN membership_plans mp ON m.membershipPlanId = mp.id
      ${where} ORDER BY m.createdAt DESC LIMIT ? OFFSET ?`, [...params, Number(limit), (Number(page) - 1) * Number(limit)]);
    res.json({ success: true, data: members, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (error) { next(error); }
};

exports.getMember = (req, res, next) => {
  try {
    const member = queryOne(`SELECT m.*, u.name, u.email, u.phone, u.profileImage, mp.name as planName, mp.features as planFeatures
      FROM members m JOIN users u ON m.userId = u.id LEFT JOIN membership_plans mp ON m.membershipPlanId = mp.id WHERE m.id = ?`, [req.params.id]);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (error) { next(error); }
};

exports.updateMember = (req, res, next) => {
  try {
    const { status, membershipPlanId, membershipEndDate, fitnessGoals, medicalConditions, gender, weight, height, dateOfBirth } = req.body;
    run(`UPDATE members SET status = COALESCE(?, status), membershipPlanId = COALESCE(?, membershipPlanId),
      membershipEndDate = COALESCE(?, membershipEndDate), fitnessGoals = COALESCE(?, fitnessGoals),
      medicalConditions = COALESCE(?, medicalConditions), gender = COALESCE(?, gender),
      weight = COALESCE(?, weight), height = COALESCE(?, height), dateOfBirth = COALESCE(?, dateOfBirth),
      updatedAt = datetime('now') WHERE id = ?`,
      [status, membershipPlanId, membershipEndDate, fitnessGoals, medicalConditions, gender, weight, height, dateOfBirth, req.params.id]);
    const member = queryOne(`SELECT m.*, u.name, u.email, u.phone, mp.name as planName
      FROM members m JOIN users u ON m.userId = u.id LEFT JOIN membership_plans mp ON m.membershipPlanId = mp.id WHERE m.id = ?`, [req.params.id]);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (error) { next(error); }
};

exports.getMyProfile = (req, res, next) => {
  try {
    const member = queryOne(`SELECT m.*, u.name, u.email, u.phone, u.profileImage, mp.name as planName, mp.price as planPrice, mp.features as planFeatures
      FROM members m JOIN users u ON m.userId = u.id LEFT JOIN membership_plans mp ON m.membershipPlanId = mp.id WHERE m.userId = ?`, [req.user.id]);
    if (!member) return res.status(404).json({ message: 'Member profile not found' });
    res.json({ success: true, data: member });
  } catch (error) { next(error); }
};

exports.updateMyProfile = (req, res, next) => {
  try {
    const { fitnessGoals, medicalConditions, gender, weight, height, dateOfBirth } = req.body;
    run(`UPDATE members SET fitnessGoals = COALESCE(?, fitnessGoals), medicalConditions = COALESCE(?, medicalConditions),
      gender = COALESCE(?, gender), weight = COALESCE(?, weight), height = COALESCE(?, height),
      dateOfBirth = COALESCE(?, dateOfBirth), updatedAt = datetime('now') WHERE userId = ?`,
      [fitnessGoals, medicalConditions, gender, weight, height, dateOfBirth, req.user.id]);
    const member = queryOne(`SELECT m.*, u.name, u.email, u.phone, mp.name as planName
      FROM members m JOIN users u ON m.userId = u.id LEFT JOIN membership_plans mp ON m.membershipPlanId = mp.id WHERE m.userId = ?`, [req.user.id]);
    res.json({ success: true, data: member });
  } catch (error) { next(error); }
};
