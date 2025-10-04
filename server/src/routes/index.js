import authRoutes from './authRoutes.js';
import faqRoutes from './faqRoutes.js';
import chatRoutes from './chatRoutes.js';
import conversationRoutes from './conversationRoutes.js';

export const registerRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/faqs', faqRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/conversations', conversationRoutes);
};

