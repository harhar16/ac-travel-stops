const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DB setup
const db = require('./db');

// Routes

// Add favorite
app.post('/api/favorite', (req, res) => {
  const { place_id, name, address } = req.body;
  if (!place_id || !name) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const stmt = db.prepare(`INSERT INTO favorites (place_id, name, address) VALUES (?, ?, ?)`);
  stmt.run(place_id, name, address, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Favorite added.' });
  });
});

// Add recommendation
app.post('/api/recommend', (req, res) => {
  const { place_id } = req.body;
  if (!place_id) return res.status(400).json({ error: 'Missing place_id.' });

  const stmt = db.prepare(`UPDATE favorites SET is_recommended = 1 WHERE place_id = ?`);
  stmt.run(place_id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Place marked as recommended.' });
  });
});

// Get all favorites
app.get('/api/favorites', (req, res) => {
  db.all(`SELECT * FROM favorites`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
