import { useState, useRef } from 'react';
import { Send, Image, Video, X, Loader } from 'lucide-react';
import { uploadToCloudinary } from '../../utils/cloudinary';
import toast from 'react-hot-toast';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setMediaFile({ file, type });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!message.trim() && !mediaFile) return;

    setUploading(true);

    try {
      let mediaUrl = null;
      let mediaType = 'NONE';

      if (mediaFile) {
        mediaUrl = await uploadToCloudinary(mediaFile.file);
        mediaType = mediaFile.type === 'video' ? 'VIDEO' : 'IMAGE';
      }

      onSendMessage(message.trim() || null, mediaUrl, mediaType);

      setMessage('');
      removeMedia();
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setUploading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    // Auto-expand textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const hasMessage = message.trim().length > 0 || mediaFile;

  return (
    <div className="flex-shrink-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 px-4 sm:px-6 py-3 shadow-md">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-2">
        {/* Media Preview */}
        {mediaPreview && (
          <div className="flex items-end gap-2.5 pb-2">
            <div className="relative group">
              {mediaFile.type === 'video' ? (
                <video 
                  src={mediaPreview} 
                  className="h-20 w-20 object-cover rounded-xl shadow-sm transition-transform group-hover:scale-105" 
                />
              ) : (
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  className="h-20 w-20 object-cover rounded-xl shadow-sm transition-transform group-hover:scale-105" 
                />
              )}
              <button
                onClick={removeMedia}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-all active:scale-95"
                aria-label="Remove media"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                {mediaFile.type === 'video' ? '🎥 Video' : '📸 Image'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                {mediaFile.file.name}
              </p>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end gap-2.5">
          {/* Media Buttons */}
          <div className="flex gap-1 flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, 'image')}
              className="hidden"
              id="image-input"
              disabled={uploading}
            />
            <label
              htmlFor="image-input"
              className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full cursor-pointer transition-colors hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50"
              title="Attach image"
            >
              <Image className="w-5 h-5" />
            </label>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileSelect(e, 'video')}
              className="hidden"
              id="video-input"
              disabled={uploading}
            />
            <label
              htmlFor="video-input"
              className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full cursor-pointer transition-colors hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50"
              title="Attach video"
            >
              <Video className="w-5 h-5" />
            </label>
          </div>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows="1"
            disabled={uploading}
            className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-neutral-700 dark:text-white border border-gray-300 dark:border-neutral-600 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all max-h-24 text-sm font-medium disabled:opacity-50 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            style={{ maxHeight: '100px' }}
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!hasMessage || uploading}
            className={`p-2.5 rounded-full transition-all transform active:scale-95 flex-shrink-0 font-semibold ${
              hasMessage && !uploading
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-300 dark:bg-neutral-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            title={hasMessage ? 'Send message (Shift+Enter for new line)' : 'Type a message to send'}
            aria-label="Send message"
          >
            {uploading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;