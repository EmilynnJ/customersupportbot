import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  JWT_SECRET,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_PASSWORD_HASH
} from '../config.js';

const DEFAULT_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

const resolveAdminHash = () => {
  if (ADMIN_PASSWORD_HASH) {
    return ADMIN_PASSWORD_HASH;
  }
  return DEFAULT_HASH;
};

export const generateToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = payload;
  return next();
};

export const authenticateAdmin = async (email, password) => {
  if (email !== ADMIN_EMAIL) {
    return false;
  }
  const hash = resolveAdminHash();
  return bcrypt.compare(password, hash);
};

