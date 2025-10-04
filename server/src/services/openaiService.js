import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config.js';

let client = null;

export const getOpenAIClient = () => {
  if (!client) {
    if (!OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY is not set. OpenAI calls will fail.');
    }
    client = new OpenAI({ apiKey: OPENAI_API_KEY });
  }
  return client;
};

export const getSupportResponse = async (messages) => {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful and friendly customer support assistant. Provide concise and accurate answers. If a question is outside the scope, gently redirect the user to contact human support.'
      },
      ...messages
    ]
  });

  return response.choices?.[0]?.message?.content?.trim() || 'I am sorry, I am unable to help with that right now.';
};

