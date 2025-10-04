import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api.js';
import AdminLogin from '../components/AdminLogin.jsx';
import FaqEditor from '../components/FaqEditor.jsx';
import ConversationList from '../components/ConversationList.jsx';
import ConversationDetail from '../components/ConversationDetail.jsx';

const AdminPage = () => {
  const [token, setToken] = useState(() => localStorage.getItem('supportbot_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [savingFaq, setSavingFaq] = useState(false);

  useEffect(() => {
    if (token) {
      fetchInitialData();
    }
  }, [token]);

  const fetchInitialData = async () => {
    try {
      const [faqRes, convoRes] = await Promise.all([
        api.get('/api/faqs'),
        api.get('/api/conversations')
      ]);
      setFaqs(faqRes.data);
      setConversations(convoRes.data);
      if (convoRes.data.length > 0) {
        selectConversation(convoRes.data[0].id);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const selectConversation = async (conversationId) => {
    setSelectedConversationId(conversationId);
    try {
      const response = await api.get(`/api/conversations/${conversationId}/messages`);
      setSelectedMessages(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: jwt } = response.data;
      localStorage.setItem('supportbot_token', jwt);
      setToken(jwt);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('supportbot_token');
    setToken(null);
    setFaqs([]);
    setConversations([]);
    setSelectedMessages([]);
  };

  const saveFaq = async (faq) => {
    setSavingFaq(true);
    const hasId = Boolean(faq.id);
    try {
      if (hasId) {
        await api.put(`/api/faqs/${faq.id}`, faq);
      } else {
        await api.post('/api/faqs', faq);
      }
      await fetchFaqs();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingFaq(false);
    }
  };

  const fetchFaqs = async () => {
    try {
      const response = await api.get('/api/faqs');
      setFaqs(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFaq = async (id) => {
    try {
      await api.delete(`/api/faqs/${id}`);
      await fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <header className="border-b border-gray-200 bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-primary">
            SupportBot
          </Link>
          {token && (
            <button onClick={handleLogout} className="text-sm font-medium text-primary hover:underline">
              Logout
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {!token ? (
          <div className="flex justify-center">
            <AdminLogin onSubmit={handleLogin} loading={loading} error={error} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
            <div className="space-y-8">
              <FaqEditor faqs={faqs} onSave={saveFaq} onDelete={deleteFaq} saving={savingFaq} />
            </div>
            <div className="space-y-8">
              <ConversationList conversations={conversations} onSelect={selectConversation} />
              <ConversationDetail messages={selectedMessages} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;

