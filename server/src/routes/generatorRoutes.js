import { Router } from 'express';
import { generateBotArchive } from '../generator/generatorService.js';

const router = Router();

router.post('/', async (req, res) => {
  const { platform, botName, personality } = req.body || {};
  if (!platform || !['discord', 'reddit', 'llm'].includes(platform)) {
    return res.status(400).json({ error: 'platform must be one of discord, reddit, llm' });
  }
  generateBotArchive(res, { platform, botName, personality });
});

export default router;

