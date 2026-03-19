import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool, { initDB } from './db.js';
import { analyzeMedia } from './utils/analysisEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

// Middleware
app.use(cors());
app.use(express.json());

// Database is initialized asynchronously in startServer() at the bottom of this file

// Ensure uploads directory exists
const isVercel = process.env.VERCEL === '1';
const uploadsDir = isVercel ? os.tmpdir() : path.join(__dirname, 'uploads');
if (!isVercel && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// --- AUTH ENDPOINTS ---

app.post('/api/auth/signup', async (req, res) => {
  const { email, name, password } = req.body;
  
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);

    await pool.query(
      'INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)',
      [userId, email, name, hashedPassword]
    );

    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: userId, email, name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- MOCK OAUTH TRIGGER ---
// In a real app, this would redirect to Google/GitHub
app.post('/api/auth/oauth', async (req, res) => {
  const { email, name, provider, providerId } = req.body;
  
  try {
    let [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    let user;

    if (users.length === 0) {
      const userId = 'user_oauth_' + Math.random().toString(36).substr(2, 9);
      await pool.query(
        'INSERT INTO users (id, email, name, provider, provider_id) VALUES (?, ?, ?, ?, ?)',
        [userId, email, name, provider, providerId]
      );
      user = { id: userId, email, name };
    } else {
      user = users[0];
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OAuth failed' });
  }
});

// --- ANALYSIS ENDPOINTS ---

app.post('/api/analyze', upload.single('media'), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file || !userId) {
      return res.status(400).json({ error: 'Missing file or userId' });
    }

    console.log(`Analyzing for user ${userId}: ${req.file.originalname}`);
    const result = await analyzeMedia(req.file);
    
    // Save to Forensic History in MySQL
    await pool.query(
      `INSERT INTO forensic_history 
       (id, user_id, file_name, type, size, authenticity_score, confidence, forensic_breakdown, flags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        result.id, 
        userId, 
        result.file_name, 
        result.type, 
        result.size, 
        result.authenticity_score, 
        result.confidence, 
        JSON.stringify(result.forensic_breakdown), 
        JSON.stringify(result.flags)
      ]
    );
    
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

app.get('/api/history', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM forensic_history WHERE user_id = ? ORDER BY timestamp DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.get('/api/results/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM forensic_history WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

// Serve uploads
app.use('/uploads', express.static(uploadsDir));

// Initialize Database before starting server
const startServer = async () => {
  await initDB();

  if (!isVercel) {
    app.listen(PORT, () => {
      console.log(`DeepTrust Intelligence Server running at http://localhost:${PORT}`);
    });
  }
};

startServer();

export default app;
