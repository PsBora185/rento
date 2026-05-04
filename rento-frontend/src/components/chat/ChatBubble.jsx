import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

const ChatBubble = ({ message, isOwn, isGroupStart = true, isGroupEnd = true }) => {
  const formatTime = (dateTime) => {
    try {
      return format(new Date(dateTime), 'HH:mm');
    } catch (error) {
      return '';
    }
  };

  const renderMedia = () => {
    if (!message.mediaUrl) return null;

    if (message.mediaType === 'IMAGE') {
      return (
        <div className="relative group rounded-lg overflow-hidden max-w-xs mb-2">
          <img
            src={message.mediaUrl}
            alt="Shared image"
            className="w-full max-h-96 object-cover group-hover:opacity-90 transition-opacity cursor-pointer rounded-lg"
            onClick={() => window.open(message.mediaUrl, '_blank')}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors"></div>
        </div>
      );
    }

    if (message.mediaType === 'VIDEO') {
      return (
        <div className="max-w-xs mb-2">
          <video
            src={message.mediaUrl}
            controls
            className="w-full max-h-96 object-cover rounded-lg"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2.5 transition-all duration-150 ${
          isOwn
            ? `bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg ${
                isGroupStart ? 'rounded-3xl' : 'rounded-2xl rounded-tr-sm'
              } ${isGroupEnd ? 'rounded-3xl' : 'rounded-tr-sm'}`
            : `bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm hover:shadow-md border border-gray-100 dark:border-neutral-600 ${
                isGroupStart ? 'rounded-3xl' : 'rounded-2xl rounded-tl-sm'
              } ${isGroupEnd ? 'rounded-3xl' : 'rounded-tl-sm'}`
        }`}
      >
        {renderMedia()}
        
        {message.content && (
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed font-medium">
            {message.content}
          </p>
        )}

        <div
          className={`flex items-center justify-end gap-1.5 mt-1 text-xs transition-all ${
            isOwn 
              ? 'text-primary-100' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <span className="opacity-70 text-xs">{formatTime(message.createdAt)}</span>
          {isOwn && (
            <span className="opacity-80">
              {message.seen ? (
                <CheckCheck className="w-3.5 h-3.5 text-primary-100" />
              ) : (
                <Check className="w-3.5 h-3.5 text-primary-100" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;