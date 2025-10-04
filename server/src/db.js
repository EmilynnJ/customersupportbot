import Database from 'better-sqlite3';
import { DB_PATH } from './config.js';
import fs from 'fs';
import path from 'path';

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

export default db;

