import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';
export const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
export const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../data/supportbot.sqlite');
export const FAQ_MATCH_THRESHOLD = process.env.FAQ_MATCH_THRESHOLD ? Number(process.env.FAQ_MATCH_THRESHOLD) : 0.8;

