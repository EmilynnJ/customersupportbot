import db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { faqSeed } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.resolve(__dirname, './schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

const insertFaq = db.prepare('INSERT INTO faq (question, answer) VALUES (?, ?)');

const existingFaqCount = db.prepare('SELECT COUNT(*) as count FROM faq').get().count;

if (existingFaqCount === 0) {
  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      insertFaq.run(row.question, row.answer);
    }
  });
  insertMany(faqSeed);
  console.log('Seeded FAQ entries');
} else {
  console.log('FAQ table already has data. Skipping seeding.');
}

console.log('Database schema ensured.');

