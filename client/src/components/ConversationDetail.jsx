const ConversationDetail = ({ messages }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4 min-h-[300px]">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Conversation Detail</h3>
        <p className="text-sm text-gray-600 mt-1">Review user interactions.</p>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {messages.length === 0 && <p className="text-sm text-gray-500">Select a conversation to view messages.</p>}
        {messages.map((msg) => (
          <div key={msg.id} className="border border-gray-200 rounded-2xl px-4 py-3">
            <p className="text-xs uppercase tracking-wide font-semibold text-gray-500">{msg.sender === 'bot' ? 'SupportBot' : 'Customer'}</p>
            <p className="text-sm text-gray-700 whitespace-pre-line mt-1">{msg.message}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(msg.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationDetail;

