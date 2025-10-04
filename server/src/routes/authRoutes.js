import { Router } from 'express';
import { authenticateAdmin, generateToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const isValid = await authenticateAdmin(email, password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(email);
  return res.json({ token });
});

export default router;

