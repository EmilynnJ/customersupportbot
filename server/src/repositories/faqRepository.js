import db from '../db.js';

const listStmt = db.prepare('SELECT * FROM faq ORDER BY updated_at DESC');
const findStmt = db.prepare('SELECT * FROM faq WHERE id = ?');
const insertStmt = db.prepare('INSERT INTO faq (question, answer) VALUES (?, ?)');
const updateStmt = db.prepare('UPDATE faq SET question = ?, answer = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
const deleteStmt = db.prepare('DELETE FROM faq WHERE id = ?');
const searchStmt = db.prepare('SELECT * FROM faq');

export const listFaqs = () => listStmt.all();

export const getFaq = (id) => findStmt.get(id);

export const createFaq = ({ question, answer }) => {
  const info = insertStmt.run(question, answer);
  return getFaq(info.lastInsertRowid);
};

export const updateFaq = (id, { question, answer }) => {
  updateStmt.run(question, answer, id);
  return getFaq(id);
};

export const deleteFaq = (id) => {
  return deleteStmt.run(id);
};

export const getAllFaqs = () => searchStmt.all();

