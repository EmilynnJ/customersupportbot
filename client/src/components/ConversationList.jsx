const ConversationList = ({ conversations, onSelect }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Recent Conversations</h3>
        <p className="text-sm text-gray-600 mt-1">Preview transcripts for quality assurance.</p>
      </div>
      <div className="space-y-3">
        {conversations.length === 0 && (
          <p className="text-sm text-gray-500">No conversations yet. Chats will appear here once customers interact.</p>
        )}
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className="w-full text-left border border-gray-200 rounded-2xl px-4 py-3 hover:border-primary hover:bg-blue-50 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{conversation.user_email || 'Anonymous visitor'}</p>
                <p className="text-xs text-gray-500">{new Date(conversation.created_at).toLocaleString()}</p>
              </div>
            </div>
            {conversation.transcript && (
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-line max-h-20 overflow-hidden">
                {conversation.transcript}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;

