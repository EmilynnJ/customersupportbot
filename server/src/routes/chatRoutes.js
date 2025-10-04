import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import stringSimilarity from 'string-similarity';
import {
  getAllFaqs
} from '../repositories/faqRepository.js';
import {
  createConversation,
  addMessage
} from '../repositories/conversationRepository.js';
import { getSupportResponse } from '../services/openaiService.js';
import { FAQ_MATCH_THRESHOLD } from '../config.js';

const router = Router();

router.post('/', async (req, res) => {
  const { conversationId, message, userEmail } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  let convoId = conversationId;
  if (!convoId) {
    convoId = uuid();
    createConversation({ id: convoId, userEmail });
  }

  const userMessageId = uuid();
  addMessage({ id: userMessageId, conversationId: convoId, sender: 'user', message });

  const faqs = getAllFaqs();
  let bestMatch = null;
  let bestScore = 0;
  if (faqs.length) {
    const { bestMatchIndex, bestMatch: matchResult } = stringSimilarity.findBestMatch(
      message.toLowerCase(),
      faqs.map((faq) => faq.question.toLowerCase())
    );
    if (matchResult?.rating >= FAQ_MATCH_THRESHOLD) {
      bestMatch = faqs[bestMatchIndex];
      bestScore = matchResult.rating;
    }
  }

  let responseText;
  if (bestMatch) {
    responseText = bestMatch.answer;
  } else {
    try {
      responseText = await getSupportResponse([
        { role: 'user', content: message }
      ]);
    } catch (error) {
      console.error('OpenAI error', error);
      responseText = 'Our support team is currently unavailable. Please try again later or email support@yourcompany.com.';
    }
  }

  const botMessageId = uuid();
  addMessage({ id: botMessageId, conversationId: convoId, sender: 'bot', message: responseText });

  res.json({
    conversationId: convoId,
    response: responseText,
    source: bestMatch ? 'faq' : 'openai',
    confidence: bestScore
  });
});

export default router;

