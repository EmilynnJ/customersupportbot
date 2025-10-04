import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  listFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getFaq
} from '../repositories/faqRepository.js';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res) => {
  const faqs = listFaqs();
  res.json(faqs);
});

router.post('/', (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' });
  }
  const faq = createFaq({ question, answer });
  res.status(201).json(faq);
});

router.put('/:id', (req, res) => {
  const faq = getFaq(req.params.id);
  if (!faq) {
    return res.status(404).json({ error: 'FAQ not found' });
  }
  const { question, answer } = req.body;
  const updated = updateFaq(req.params.id, { question, answer });
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const faq = getFaq(req.params.id);
  if (!faq) {
    return res.status(404).json({ error: 'FAQ not found' });
  }
  deleteFaq(req.params.id);
  res.status(204).send();
});

export default router;

