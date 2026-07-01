const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'gym.db');

let db = null;

const getDb = () => {
  if (!db) throw new Error('Database not initialized. Call initDB() first.');
  return db;
};

const initDB = async () => {
  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'member',
      phone TEXT,
      profileImage TEXT DEFAULT 'no-photo.jpg',
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS membership_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      duration INTEGER NOT NULL,
      features TEXT DEFAULT '[]',
      isActive INTEGER DEFAULT 1,
      maxClasses INTEGER DEFAULT -1,
      maxTrainers INTEGER DEFAULT -1,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER UNIQUE NOT NULL,
      membershipPlanId INTEGER,
      membershipStartDate TEXT,
      membershipEndDate TEXT,
      status TEXT DEFAULT 'active',
      emergencyName TEXT,
      emergencyPhone TEXT,
      emergencyRelationship TEXT,
      fitnessGoals TEXT DEFAULT '[]',
      medicalConditions TEXT DEFAULT '',
      dateOfBirth TEXT,
      gender TEXT,
      weight REAL,
      height REAL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (membershipPlanId) REFERENCES membership_plans(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS trainers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER UNIQUE NOT NULL,
      specialties TEXT DEFAULT '[]',
      bio TEXT,
      hourlyRate REAL DEFAULT 0,
      rating REAL DEFAULT 0,
      totalClients INTEGER DEFAULT 0,
      yearsExperience INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS trainer_availability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trainerId INTEGER NOT NULL,
      day TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      FOREIGN KEY (trainerId) REFERENCES trainers(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS trainer_certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trainerId INTEGER NOT NULL,
      name TEXT,
      issuedBy TEXT,
      year INTEGER,
      FOREIGN KEY (trainerId) REFERENCES trainers(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      trainerId INTEGER NOT NULL,
      category TEXT DEFAULT 'other',
      difficulty TEXT DEFAULT 'beginner',
      duration INTEGER DEFAULT 60,
      price REAL DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      image TEXT DEFAULT 'no-class.jpg',
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (trainerId) REFERENCES trainers(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS class_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      classId INTEGER NOT NULL,
      day TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      maxCapacity INTEGER DEFAULT 20,
      currentEnrollment INTEGER DEFAULT 0,
      FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memberId INTEGER NOT NULL,
      classId INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'confirmed',
      notes TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE,
      FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memberId INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      paymentMethod TEXT NOT NULL,
      invoiceNumber TEXT UNIQUE,
      description TEXT,
      dueDate TEXT,
      paidAt TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE
    )
  `);

  saveDB();
  console.log('SQLite database initialized');
  return db;
};

const saveDB = () => {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
};

// sql.js helper: run a query and return results as array of objects
const queryAll = (sql, params = []) => {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
};

const queryOne = (sql, params = []) => {
  const results = queryAll(sql, params);
  return results.length > 0 ? results[0] : null;
};

const run = (sql, params = []) => {
  db.run(sql, params);
  const lastId = db.exec('SELECT last_insert_rowid() as id')[0]?.values[0][0];
  const changes = db.getRowsModified();
  saveDB();
  return { lastInsertRowid: lastId, changes };
};

module.exports = { initDB, getDb, queryAll, queryOne, run, saveDB };
