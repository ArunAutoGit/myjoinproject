import express from 'express';
import cors from 'cors';
import pool from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve __dirname since ES modules don't support it directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// --- Initialize DB (Create Table if not exists) ---
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS joined_devices (
        id SERIAL PRIMARY KEY,
        device_id VARCHAR(255) UNIQUE,
        user_agent TEXT,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized ✅');
  } catch (error) {
    console.error('Error initializing DB:', error);
  }
};
initDB();

// --- API Routes ---

// Join endpoint
app.post('/join', async (req, res) => {
  const { deviceId, userAgent } = req.body;
  if (!deviceId) return res.status(400).json({ error: 'No deviceId provided' });

  try {
    await pool.query(
      `INSERT INTO joined_devices (device_id, user_agent) 
       VALUES ($1, $2) 
       ON CONFLICT (device_id) DO NOTHING`,
      [deviceId, userAgent]
    );
    res.json({ message: 'Joined successfully' });
  } catch (err) {
    console.error('Join error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Dashboard data
app.get('/dashboard-data', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM joined_devices ORDER BY joined_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
