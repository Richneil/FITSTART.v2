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
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'FitStart Full-Stack Backend API', time: new Date() });
});

// Friendly Root Page (Prevents "Cannot GET /" and redirects/links to frontend)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FitStart Backend API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 24px; padding: 36px; max-width: 540px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); text-align: center; }
        .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(16, 185, 129, 0.15); border: 1px solid #059669; color: #34d399; font-weight: 700; font-size: 12px; padding: 6px 14px; rounded-full; border-radius: 9999px; margin-bottom: 16px; }
        .pulse { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
        h1 { margin: 0 0 10px; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
        p { color: #94a3b8; font-size: 14px; margin: 0 0 24px; line-height: 1.5; }
        .btn { display: inline-block; background: #0d9488; color: white; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 28px; border-radius: 16px; transition: background 0.2s; box-shadow: 0 10px 15px -3px rgba(13, 148, 136, 0.4); }
        .btn:hover { background: #0f766e; }
        .endpoints { margin-top: 28px; padding-top: 20px; border-top: 1px solid #334155; text-align: left; }
        .endpoints h3 { font-size: 12px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px; }
        .endpoints code { display: block; font-family: monospace; font-size: 12px; color: #38bdf8; background: #0f172a; padding: 8px 12px; border-radius: 8px; margin-bottom: 6px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge"><div class="pulse"></div> Backend API Online & Healthy</div>
        <h1>FitStart REST API</h1>
        <p>This is the backend API server running on port 5000. The interactive web application UI is hosted on port 8080.</p>
        <a href="http://localhost:8080" class="btn">🚀 Open FitStart Web App (Port 8080)</a>
        <div class="endpoints">
          <h3>Active API Endpoints</h3>
          <code>GET  /api/health</code>
          <code>GET  /assessments/parq-template</code>
          <code>GET  /glossary</code>
          <code>POST /auth/login</code>
        </div>
      </div>
    </body>
    </html>
  `);
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
let serverHandle = null;

async function startServer() {
  try {
    await initDatabase();
    serverHandle = app.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`🚀 FitStart Backend API running on http://localhost:${PORT}`);
      console.log(`📡 Endpoints: /auth, /assessments, /results, /chat, /glossary`);
      console.log(`===================================================`);
    });

    // Keep event loop alive
    setInterval(() => {}, 60000);
  } catch (err) {
    console.error('Failed to start FitStart server:', err);
  }
}

startServer();

