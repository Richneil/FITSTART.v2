import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import assessmentRoutes from './routes/assessments.js';
import resultRoutes from './routes/results.js';
import chatRoutes from './routes/chat.js';
import glossaryRoutes from './routes/glossary.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'FitStart Full-Stack Backend API', time: new Date() });
});

// Mount Routes (supporting both /api/* and root paths)
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

app.use('/assessments', assessmentRoutes);
app.use('/api/assessments', assessmentRoutes);

app.use('/results', resultRoutes);
app.use('/api/results', resultRoutes);

app.use('/chat', chatRoutes);
app.use('/api/chat', chatRoutes);

app.use('/glossary', glossaryRoutes);
app.use('/api/glossary', glossaryRoutes);

// Start Server and Initialize DB
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`🚀 FitStart Backend API running on http://localhost:${PORT}`);
      console.log(`📡 Endpoints: /auth, /assessments, /results, /chat, /glossary`);
      console.log(`===================================================`);
    });
  } catch (err) {
    console.error('Failed to start FitStart server:', err);
  }
}

startServer();
