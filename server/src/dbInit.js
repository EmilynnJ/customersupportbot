import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import { faqSeed } from './seedData.js';
import { DB_PATH } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ensureSchema = () => {
  const schemaPath = path.resolve(__dirname, './schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
};

export const ensureSeedData = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const count = db.prepare('SELECT COUNT(*) as count FROM faq').get();
  if (count.count === 0) {
    const insertStmt = db.prepare('INSERT INTO faq (question, answer) VALUES (?, ?)');
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insertStmt.run(row.question, row.answer);
      }
    });
    insertMany(faqSeed);
    console.log('Seeded FAQ entries');
  }
};

