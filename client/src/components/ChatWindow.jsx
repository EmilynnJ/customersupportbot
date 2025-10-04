import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage.jsx';

const ChatWindow = ({ messages, loading }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-blue-50/60 rounded-3xl border border-blue-100">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} />
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm text-sm">
            <p className="font-semibold text-xs uppercase tracking-wide mb-1">SupportBot</p>
            <div className="flex space-x-1">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                  style={{ animationDelay: `${dot * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default ChatWindow;

