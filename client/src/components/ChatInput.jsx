const ChatInput = ({ message, onChange, onSubmit, disabled }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 bg-white rounded-3xl border border-gray-200 shadow-sm p-3 flex items-center gap-3">
      <input
        type="text"
        placeholder="Ask about shipping, refunds, order status..."
        value={message}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm md:text-base"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="px-4 py-2 bg-primary text-white rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;

