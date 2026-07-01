const { queryAll, queryOne } = require('../config/db');

exports.getStats = (req, res, next) => {
  try {
    const totalMembers = queryOne("SELECT COUNT(*) as count FROM members WHERE status = 'active'").count;
    const totalTrainers = queryOne('SELECT COUNT(*) as count FROM trainers').count;
    const totalClasses = queryOne('SELECT COUNT(*) as count FROM classes WHERE isActive = 1').count;
    const totalBookings = queryOne("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'").count;
    const totalRevenue = queryOne("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'").total;

    const monthlyRevenue = queryAll(`SELECT strftime('%m', createdAt) as month, strftime('%Y', createdAt) as year, SUM(amount) as total
      FROM payments WHERE status = 'completed' GROUP BY year, month ORDER BY year DESC, month DESC LIMIT 12`);

    const recentBookings = queryAll(`SELECT b.*, u.name as memberName, c.name as className, tu.name as trainerName
      FROM bookings b JOIN members m ON b.memberId = m.id JOIN users u ON m.userId = u.id
      JOIN classes c ON b.classId = c.id JOIN trainers t ON c.trainerId = t.id JOIN users tu ON t.userId = tu.id
      ORDER BY b.createdAt DESC LIMIT 5`);

    const recentPayments = queryAll(`SELECT p.*, u.name as memberName
      FROM payments p JOIN members m ON p.memberId = m.id JOIN users u ON m.userId = u.id
      ORDER BY p.createdAt DESC LIMIT 5`);

    const membersByPlan = queryAll(`SELECT mp.name as planName, COUNT(m.id) as count
      FROM membership_plans mp LEFT JOIN members m ON mp.id = m.membershipPlanId GROUP BY mp.id`);

    const popularClasses = queryAll(`SELECT c.name as className, COUNT(b.id) as bookingCount
      FROM bookings b JOIN classes c ON b.classId = c.id GROUP BY c.id ORDER BY bookingCount DESC LIMIT 5`);

    res.json({
      success: true,
      data: { totalMembers, totalTrainers, totalClasses, totalBookings, totalRevenue, monthlyRevenue, recentBookings, recentPayments, membersByPlan, popularClasses }
    });
  } catch (error) { next(error); }
};
