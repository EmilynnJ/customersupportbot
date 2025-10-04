import db from '../db.js';

const createConversationStmt = db.prepare(
  'INSERT INTO conversations (id, user_email) VALUES (?, ?)' 
);
const addMessageStmt = db.prepare(
  'INSERT INTO messages (id, conversation_id, sender, message) VALUES (?, ?, ?, ?)'
);
const getRecentConversationsStmt = db.prepare(
  `SELECT c.id, c.user_email, c.created_at,
          GROUP_CONCAT(m.sender || ': ' || m.message, CHAR(10)) AS transcript
   FROM conversations c
   LEFT JOIN messages m ON c.id = m.conversation_id
   GROUP BY c.id
   ORDER BY c.created_at DESC
   LIMIT ?`
);
const getConversationMessagesStmt = db.prepare(
  'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
);

export const createConversation = ({ id, userEmail }) => {
  createConversationStmt.run(id, userEmail || null);
};

export const addMessage = ({ id, conversationId, sender, message }) => {
  addMessageStmt.run(id, conversationId, sender, message);
};

export const getRecentConversations = (limit = 20) => {
  return getRecentConversationsStmt.all(limit);
};

export const getConversationMessages = (conversationId) => {
  return getConversationMessagesStmt.all(conversationId);
};

