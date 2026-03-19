import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { analyzeMedia } from './utils/analysisEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Simple In-memory Store
const history = [];

// API Endpoints
app.post('/api/analyze', upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Analyzing: ${req.file.originalname}`);
    const result = await analyzeMedia(req.file);
    
    // Save to history
    history.unshift(result);
    
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

app.get('/api/history', (req, res) => {
  res.json(history.slice(0, 50));
});

app.get('/api/results/:id', (req, res) => {
  const result = history.find(item => item.id === req.params.id);
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.json(result);
});

// Serve uploaded files
app.use('/uploads', express.static('server/uploads'));

app.listen(PORT, () => {
  console.log(`DeepTrust Forensic Server running at http://localhost:${PORT}`);
});
