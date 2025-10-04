import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { CLIENT_URL, PORT, NODE_ENV, DB_PATH } from './config.js';
import { ensureSchema, ensureSeedData } from './dbInit.js';
import { registerRoutes } from './routes/index.js';

ensureSchema();
ensureSeedData();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`Booting SupportBot API in ${NODE_ENV} mode`);
console.log(`Allowed client origins: ${CLIENT_URL}`);
console.log(`Database path: ${DB_PATH}`);

const allowedOrigins = CLIENT_URL.split(',').map((origin) => origin.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

registerRoutes(app);

if (NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

