import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getRecentConversations, getConversationMessages } from '../repositories/conversationRepository.js';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res) => {
  const conversations = getRecentConversations();
  res.json(conversations);
});

router.get('/:id/messages', (req, res) => {
  const messages = getConversationMessages(req.params.id);
  res.json(messages);
});

export default router;

