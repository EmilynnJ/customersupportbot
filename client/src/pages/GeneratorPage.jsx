import { useState } from 'react';
import api from '../lib/api.js';

const presets = [
  { id: 'friendly', name: 'Friendly Support', text: 'You are a friendly support assistant. Answer clearly and concisely.' },
  { id: 'professional', name: 'Professional Expert', text: 'You are a professional product expert. Provide accurate, concise guidance.' },
  { id: 'creative', name: 'Creative Helper', text: 'You are creative and encouraging. Offer helpful suggestions and positive tone.' }
];

const GeneratorPage = () => {
  const [platform, setPlatform] = useState('discord');
  const [botName, setBotName] = useState('MyChatbot');
  const [personality, setPersonality] = useState(presets[0].text);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePreset = (id) => {
    const p = presets.find((x) => x.id === id);
    if (p) setPersonality(p.text);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/generator', { platform, botName, personality }, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${botName}-${platform}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <header className="border-b border-gray-200 bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold text-primary">SupportBot</a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Chatbot Generator</h1>
            <p className="text-sm text-gray-600 mt-1">Generate packaged bots for Discord, Reddit, or an LLM wrapper.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm">
                <option value="discord">Discord Bot</option>
                <option value="reddit">Reddit Bot</option>
                <option value="llm">LLM Wrapper</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Bot Name</label>
              <input value={botName} onChange={(e) => setBotName(e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {presets.map((p) => (
              <button key={p.id} onClick={() => handlePreset(p.id)} className="border border-gray-200 rounded-2xl px-4 py-2 text-sm hover:border-primary hover:bg-blue-50 transition">
                {p.name}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Personality / System Prompt</label>
            <textarea value={personality} onChange={(e) => setPersonality(e.target.value)} rows={6} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm" />
            <p className="text-xs text-gray-500">Used as the system prompt for the bot.</p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex items-center gap-3">
            <button onClick={handleGenerate} disabled={loading} className="px-4 py-2 bg-primary text-white rounded-2xl font-semibold disabled:opacity-60">
              {loading ? 'Generating...' : 'Generate and Download'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GeneratorPage;

