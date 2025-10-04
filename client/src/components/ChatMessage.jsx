import clsx from 'clsx';

const ChatMessage = ({ sender, text }) => {
  const isBot = sender === 'bot';
  return (
    <div className={clsx('flex w-full', isBot ? 'justify-start' : 'justify-end')}>
      <div
        className={clsx('max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-sm md:text-base', {
          'bg-white border border-gray-200 text-gray-800': isBot,
          'bg-primary text-white': !isBot
        })}
      >
        <p className="font-semibold text-xs uppercase tracking-wide mb-1">
          {isBot ? 'SupportBot' : 'You'}
        </p>
        <p className="whitespace-pre-line leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;

