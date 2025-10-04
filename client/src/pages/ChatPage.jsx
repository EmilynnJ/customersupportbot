import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import ChatWindow from '../components/ChatWindow.jsx';
import ChatInput from '../components/ChatInput.jsx';

const initialMessage = {
  id: 'welcome',
  sender: 'bot',
  text: 'Hi there! I’m SupportBot. Ask me anything about shipping, returns, hours, or account help.'
};

const ChatPage = () => {
  const [messages, setMessages] = useState([initialMessage]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [message]);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    const userMessage = { id: crypto.randomUUID(), sender: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/api/chat', {
        message: trimmed,
        conversationId
      });
      const { conversationId: newConversationId, response: botResponse } = response.data;
      setConversationId(newConversationId);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          text: botResponse
        }
      ]);
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong. Please try again or email support@yourcompany.com.');
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'bot',
          text: 'Our support team is currently unavailable. Please try again later or email support@yourcompany.com.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex flex-col">
      <header className="border-b border-gray-200 bg-white/70 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-primary">
            SupportBot
          </Link>
          <Link to="/admin" className="text-sm font-medium text-primary hover:underline">
            Admin Portal
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 flex flex-col gap-6">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col p-6 md:p-8">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Customer Support Chat</h1>
            <p className="text-gray-600 text-sm mt-2">
              Powered by your FAQs and OpenAI responses. Your conversations are securely stored for analytics.
            </p>
          </div>

          <ChatWindow messages={messages} loading={loading} />
          <ChatInput message={message} onChange={setMessage} onSubmit={handleSend} disabled={loading} />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default ChatPage;

