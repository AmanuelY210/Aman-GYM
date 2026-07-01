const bcrypt = require('bcryptjs');
const { initDB, run } = require('../config/db');

const seed = async () => {
  try {
    await initDB();
    console.log('Seeding database...');

    ['trainer_availability', 'class_schedules', 'bookings', 'payments', 'classes', 'trainers', 'members', 'membership_plans', 'users'].forEach(t => run(`DELETE FROM ${t}`));

    const salt = await bcrypt.genSalt(10);
    const hash = async (pw) => await bcrypt.hash(pw, salt);

    // Admin
    const adminP = await hash('admin123');
    run('INSERT INTO users (name, email, password, role, phone) VALUES (?,?,?,?,?)', ['Admin User', 'admin@fitzone.com', adminP, 'admin', '555-0100']);

    // ── Trainers (6) ──
    const tData = [
      ['Sarah Johnson', 'sarah@fitzone.com', ['Yoga', 'Pilates', 'Meditation'], 'Certified yoga instructor with 10+ years experience. Helped hundreds find inner peace through movement.', 75, 10, 4.8, [['Monday','06:00','12:00'],['Wednesday','06:00','12:00'],['Friday','06:00','12:00']]],
      ['Mike Williams', 'mike@fitzone.com', ['Strength Training', 'HIIT', 'CrossFit'], 'Former professional athlete turned fitness coach. Specializes in building functional strength.', 85, 8, 4.6, [['Tuesday','08:00','16:00'],['Thursday','08:00','16:00'],['Saturday','08:00','14:00']]],
      ['Emma Davis', 'emma@fitzone.com', ['Cardio', 'Dance Fitness', 'Aerobics'], 'Energetic fitness instructor who makes every workout feel like a party.', 65, 5, 4.9, [['Monday','14:00','20:00'],['Wednesday','14:00','20:00'],['Friday','14:00','20:00']]],
      ['Carlos Rivera', 'carlos@fitzone.com', ['Martial Arts', 'Kickboxing', 'Self-Defense'], 'Black belt martial artist bringing combat fitness to the mainstream. 12 years teaching.', 90, 12, 4.7, [['Monday','10:00','18:00'],['Wednesday','10:00','18:00'],['Saturday','10:00','16:00']]],
      ['Priya Patel', 'priya@fitzone.com', ['Yoga', 'Meditation', 'Flexibility'], 'Registered yoga therapist with a focus on recovery and mindful movement.', 70, 7, 4.9, [['Tuesday','06:00','14:00'],['Thursday','06:00','14:00'],['Sunday','08:00','14:00']]],
      ['Jake Thompson', 'jake@fitzone.com', ['Strength Training', 'Powerlifting', 'Bodybuilding'], 'Competitive powerlifter and certified personal trainer. Science-based approach to gains.', 95, 6, 4.5, [['Tuesday','12:00','20:00'],['Thursday','12:00','20:00'],['Saturday','08:00','16:00']]]
    ];

    const trainerIds = [];
    for (const [name, email, specs, bio, rate, exp, rating, availArr] of tData) {
      const u = run('INSERT INTO users (name, email, password, role, phone) VALUES (?,?,?,?,?)', [name, email, await hash('trainer123'), 'trainer', `555-${String(101+trainerIds.length).padStart(4,'0')}`]);
      const t = run('INSERT INTO trainers (userId, specialties, bio, hourlyRate, yearsExperience, rating) VALUES (?,?,?,?,?,?)', [u.lastInsertRowid, JSON.stringify(specs), bio, rate, exp, rating]);
      trainerIds.push(t.lastInsertRowid);
      for (const [day, s, e] of availArr) {
        run('INSERT INTO trainer_availability (trainerId, day, startTime, endTime) VALUES (?,?,?,?)', [t.lastInsertRowid, day, s, e]);
      }
    }
    console.log(`Created ${trainerIds.length} trainers`);

    // ── Plans (4) ──
    run('INSERT INTO membership_plans (name, description, price, duration, features) VALUES (?,?,?,?,?)', ['Basic', 'Access to gym equipment and basic classes', 29.99, 30, JSON.stringify(['Gym Equipment Access', 'Locker Room', 'Basic Classes', 'WiFi'])]);
    run('INSERT INTO membership_plans (name, description, price, duration, features) VALUES (?,?,?,?,?)', ['Standard', 'Full access with personal training sessions', 59.99, 30, JSON.stringify(['Everything in Basic', 'All Classes', '2 PT Sessions/Month', 'Sauna Access', 'Nutrition Consultation'])]);
    run('INSERT INTO membership_plans (name, description, price, duration, features) VALUES (?,?,?,?,?)', ['Premium', 'Unlimited access with premium perks', 99.99, 30, JSON.stringify(['Everything in Standard', 'Unlimited PT Sessions', 'Pool Access', 'Spa Access', 'Priority Booking', 'Guest Passes'])]);
    run('INSERT INTO membership_plans (name, description, price, duration, features) VALUES (?,?,?,?,?)', ['Annual', 'Best value - 2 months free!', 599.99, 365, JSON.stringify(['Everything in Premium', '2 Months Free', 'Exclusive Events', 'Merchandise Discount'])]);
    console.log('Created 4 plans');

    // ── Members (20) ──
    const mData = [
      ['John Smith', 'john@example.com', '555-0201', 2, 'active', '2026-01-01', '2026-12-31', ['Lose Weight','Build Muscle'], 'male', 85, 178],
      ['Lisa Brown', 'lisa@example.com', '555-0202', 3, 'active', '2026-03-01', '2027-02-28', ['Flexibility','Stress Relief'], 'female', 62, 165],
      ['David Wilson', 'david@example.com', '555-0203', 1, 'active', '2026-06-01', '2026-06-30', ['General Fitness'], 'male', 90, 182],
      ['Emma Thompson', 'emma.t@example.com', '555-0204', 3, 'active', '2026-02-15', '2027-01-31', ['Weight Loss','Toning'], 'female', 58, 160],
      ['James Garcia', 'james.g@example.com', '555-0205', 4, 'active', '2025-12-01', '2026-11-30', ['Marathon Training','Endurance'], 'male', 75, 180],
      ['Sophia Martinez', 'sophia@example.com', '555-0206', 2, 'active', '2026-04-01', '2026-12-31', ['Posture Correction','Core Strength'], 'female', 55, 162],
      ['Daniel Lee', 'daniel@example.com', '555-0207', 1, 'active', '2026-05-15', '2026-06-15', ['Weight Loss'], 'male', 95, 175],
      ['Olivia Johnson', 'olivia@example.com', '555-0208', 3, 'active', '2026-01-10', '2027-01-09', ['Yoga','Flexibility','Mental Health'], 'female', 52, 158],
      ['Ethan Brown', 'ethan@example.com', '555-0209', 2, 'active', '2026-03-20', '2026-12-19', ['Build Muscle','Strength'], 'male', 82, 183],
      ['Ava Williams', 'ava@example.com', '555-0210', 4, 'active', '2025-11-01', '2026-10-31', ['Athletic Performance','Speed'], 'female', 58, 168],
      ['Noah Davis', 'noah@example.com', '555-0211', 1, 'inactive', '2025-09-01', '2025-09-30', ['General Fitness'], 'male', 88, 177],
      ['Mia Anderson', 'mia@example.com', '555-0212', 2, 'active', '2026-02-01', '2026-11-30', ['Toning','Weight Loss'], 'female', 63, 164],
      ['Lucas Taylor', 'lucas@example.com', '555-0213', 3, 'active', '2026-04-15', '2027-03-15', ['Bodybuilding','Competition Prep'], 'male', 92, 185],
      ['Charlotte White', 'charlotte@example.com', '555-0214', 2, 'suspended', '2026-01-05', '2026-07-05', ['Cardio','Weight Loss'], 'female', 70, 160],
      ['Liam Harris', 'liam@example.com', '555-0215', 4, 'active', '2025-10-01', '2026-09-30', ['CrossFit','Endurance','Competition'], 'male', 78, 179],
      ['Isabella Clark', 'isabella@example.com', '555-0216', 1, 'active', '2026-05-01', '2026-05-31', ['Beginner Fitness'], 'female', 60, 163],
      ['Mason Lewis', 'mason@example.com', '555-0217', 2, 'active', '2026-03-10', '2026-12-09', ['Strength','Powerlifting'], 'male', 100, 188],
      ['Amelia Walker', 'amelia@example.com', '555-0218', 3, 'active', '2026-01-20', '2027-01-19', ['Pilates','Flexibility','Rehab'], 'female', 56, 159],
      ['Benjamin Hall', 'benjamin@example.com', '555-0219', 1, 'active', '2026-06-01', '2026-06-30', ['Weight Loss','Cardio'], 'male', 98, 176],
      ['Harper Allen', 'harper@example.com', '555-0220', 4, 'active', '2025-12-15', '2026-12-14', ['Martial Arts','Self-Defense','Fitness'], 'female', 57, 166],
    ];

    const memberIds = [];
    const memberUserIds = [];
    for (const [name, email, phone, planId, status, start, end, goals, gender, weight, height] of mData) {
      const u = run('INSERT INTO users (name, email, password, role, phone) VALUES (?,?,?,?,?)', [name, email, await hash('member123'), 'member', phone]);
      const m = run('INSERT INTO members (userId, membershipPlanId, membershipStartDate, membershipEndDate, status, fitnessGoals, gender, weight, height) VALUES (?,?,?,?,?,?,?,?,?)',
        [u.lastInsertRowid, planId, start, end, status, JSON.stringify(goals), gender, weight, height]);
      memberIds.push(m.lastInsertRowid);
      memberUserIds.push(u.lastInsertRowid);
    }
    console.log(`Created ${memberIds.length} members`);

    // ── Classes (12) ──
    const cData = [
      ['Morning Yoga Flow', 'Start your day with energizing yoga poses and breathing exercises', 0, 'yoga', 'beginner', 60, 0, [['Monday','06:00','07:00',20],['Wednesday','06:00','07:00',20],['Friday','06:00','07:00',20]]],
      ['Power HIIT', 'High-intensity interval training for maximum calorie burn', 1, 'hiit', 'advanced', 45, 15, [['Tuesday','08:00','08:45',15],['Thursday','08:00','08:45',15],['Saturday','09:00','09:45',15]]],
      ['Strength Fundamentals', 'Learn proper form and technique for major compound lifts', 1, 'strength', 'beginner', 60, 0, [['Tuesday','10:00','11:00',12],['Thursday','10:00','11:00',12]]],
      ['Dance Cardio Party', 'Fun dance workout with trending music - no experience needed!', 2, 'dance', 'beginner', 50, 0, [['Monday','17:00','17:50',25],['Wednesday','17:00','17:50',25],['Friday','17:00','17:50',25]]],
      ['Pilates Core', 'Core strengthening and flexibility through controlled movements', 0, 'pilates', 'intermediate', 55, 10, [['Monday','09:00','09:55',18],['Friday','09:00','09:55',18]]],
      ['Cardio Blast', 'Fast-paced cardio session combining running, jumping, and bodyweight exercises', 2, 'cardio', 'intermediate', 45, 0, [['Tuesday','17:00','17:45',20],['Thursday','17:00','17:45',20]]],
      ['Kickboxing Basics', 'Learn fundamental kickboxing techniques while getting an incredible workout', 3, 'martial-arts', 'beginner', 60, 12, [['Monday','12:00','13:00',20],['Wednesday','12:00','13:00',20],['Saturday','11:00','12:00',20]]],
      ['Power Yoga', 'Advanced yoga practice combining strength, balance, and flexibility', 4, 'yoga', 'advanced', 75, 15, [['Tuesday','07:00','08:15',15],['Thursday','07:00','08:15',15],['Sunday','09:00','10:15',15]]],
      ['Bodybuilding Sculpt', 'Hypertrophy-focused training for building muscle mass and definition', 5, 'strength', 'advanced', 75, 20, [['Tuesday','14:00','15:15',12],['Thursday','14:00','15:15',12],['Saturday','10:00','11:15',12]]],
      ['Zumba Fitness', 'Latin-inspired dance fitness party that burns calories and tones your body', 2, 'dance', 'beginner', 55, 0, [['Wednesday','18:00','18:55',30],['Saturday','14:00','14:55',30]]],
      ['CrossFit WOD', 'Constantly varied functional movements performed at high intensity', 1, 'hiit', 'advanced', 60, 18, [['Monday','16:00','17:00',15],['Wednesday','16:00','17:00',15],['Friday','16:00','17:00',15]]],
      ['Stretching & Recovery', 'Gentle stretching and foam rolling for muscle recovery and flexibility', 4, 'yoga', 'beginner', 40, 0, [['Sunday','11:00','11:40',20],['Wednesday','09:00','09:40',20]]],
    ];

    const classIds = [];
    for (const [name, desc, tIdx, cat, diff, dur, price, schedules] of cData) {
      const c = run('INSERT INTO classes (name, description, trainerId, category, difficulty, duration, price) VALUES (?,?,?,?,?,?,?)',
        [name, desc, trainerIds[tIdx], cat, diff, dur, price]);
      classIds.push(c.lastInsertRowid);
      for (const [day, s, e, cap] of schedules) {
        run('INSERT INTO class_schedules (classId, day, startTime, endTime, maxCapacity) VALUES (?,?,?,?,?)', [c.lastInsertRowid, day, s, e, cap]);
      }
    }
    console.log(`Created ${classIds.length} classes`);

    // ── Bookings (30) ──
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
    const bookingPairs = [
      [0, 0], [0, 3], [0, 4],   // John
      [1, 0], [1, 2], [1, 5],   // Lisa
      [3, 3], [3, 4], [3, 7],   // Emma T
      [4, 1], [4, 2], [4, 10],  // James G
      [5, 4], [5, 11],           // Sophia
      [7, 0], [7, 7], [7, 5],   // Olivia
      [8, 1], [8, 8],            // Ethan
      [9, 10], [9, 6], [9, 9],  // Ava
      [11, 3], [11, 4], [11, 9], // Mia
      [12, 8], [12, 1],          // Lucas
      [14, 10], [14, 6],         // Liam
      [15, 0], [15, 5],          // Isabella
    ];

    let bookingCount = 0;
    for (const [mIdx, cIdx] of bookingPairs) {
      const dayIdx = bookingCount % 5;
      const dateStr = `2026-07-${String(7 + dayIdx).padStart(2, '0')}`;
      run('INSERT INTO bookings (memberId, classId, date, status) VALUES (?,?,?,?)',
        [memberIds[mIdx], classIds[cIdx], dateStr, 'confirmed']);
      bookingCount++;
    }
    console.log(`Created ${bookingCount} bookings`);

    // ── Payments (25) ──
    const paymentTypes = ['membership', 'class', 'personal-training'];
    const methods = ['card', 'cash', 'bank-transfer', 'online'];
    const statuses = ['completed', 'completed', 'completed', 'completed', 'pending'];
    let invNum = 1000;

    // Membership payments
    for (let i = 0; i < 20; i++) {
      const amt = [29.99, 59.99, 99.99, 599.99][i % 4];
      const status = i < 17 ? 'completed' : 'pending';
      const paidAt = status === 'completed' ? `2026-0${(i % 6) + 1}-${String(10 + i).padStart(2,'0')}T10:00:00Z` : null;
      run('INSERT INTO payments (memberId, amount, type, status, paymentMethod, invoiceNumber, description, paidAt) VALUES (?,?,?,?,?,?,?,?)',
        [memberIds[i], amt, 'membership', status, methods[i % 4], `INV-${++invNum}`, `Membership payment - ${['Basic','Standard','Premium','Annual'][i%4]} Plan`, paidAt]);
    }

    // Class payments
    const classPayments = [
      [0, 15, 'card', 'completed', 'Power HIIT single class'],
      [1, 10, 'online', 'completed', 'Pilates Core single class'],
      [3, 15, 'card', 'completed', 'Power HIIT single class'],
      [5, 10, 'cash', 'completed', 'Pilates Core single class'],
      [7, 15, 'card', 'completed', 'Power Yoga single class'],
      [8, 20, 'online', 'completed', 'Bodybuilding Sculpt single class'],
      [12, 20, 'bank-transfer', 'completed', 'Bodybuilding Sculpt single class'],
      [14, 18, 'card', 'pending', 'CrossFit WOD single class'],
    ];

    for (const [mIdx, amt, method, status, desc] of classPayments) {
      const paidAt = status === 'completed' ? `2026-06-${String(10 + mIdx).padStart(2,'0')}T14:00:00Z` : null;
      run('INSERT INTO payments (memberId, amount, type, status, paymentMethod, invoiceNumber, description, paidAt) VALUES (?,?,?,?,?,?,?,?)',
        [memberIds[mIdx], amt, 'class', status, method, `INV-${++invNum}`, desc, paidAt]);
    }

    // Personal training payments
    const ptPayments = [
      [4, 85, 'completed', '1-on-1 session with Mike'],
      [7, 75, 'completed', '1-on-1 session with Sarah'],
      [9, 90, 'completed', '1-on-1 session with Carlos'],
      [12, 95, 'completed', '1-on-1 session with Jake'],
      [15, 70, 'completed', '1-on-1 session with Priya'],
    ];

    for (const [mIdx, amt, status, desc] of ptPayments) {
      run('INSERT INTO payments (memberId, amount, type, status, paymentMethod, invoiceNumber, description, paidAt) VALUES (?,?,?,?,?,?,?,?)',
        [memberIds[mIdx], amt, 'personal-training', status, 'card', `INV-${++invNum}`, desc, `2026-06-${String(15 + mIdx).padStart(2,'0')}T16:00:00Z`]);
    }

    console.log(`Created ${20 + 8 + 5} payments`);

    console.log('\n══════════════════════════════════════');
    console.log('  SEED COMPLETE');
    console.log('══════════════════════════════════════');
    console.log('  Admin:  admin@fitzone.com / admin123');
    console.log('  Member: john@example.com / member123');
    console.log('  Trainer: sarah@fitzone.com / trainer123');
    console.log('══════════════════════════════════════');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
