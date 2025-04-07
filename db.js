const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Set up SQLite DB
const dbPath = path.resolve(__dirname, 'sip-happens.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_id TEXT NOT NULL,
      name TEXT NOT NULL,
      address TEXT,
      is_recommended INTEGER DEFAULT 0
    )
  `);
});

module.exports = db;
