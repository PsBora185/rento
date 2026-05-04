import { useEffect, useRef, useState } from 'react';
import { Send, Image } from 'lucide-react';
import chatSocket from '../../websocket/chatSocket';
import { uploadToCloudinary } from '../../api/cloudinary';

const ChatComposer = ({ conversation, roomId }) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  const sendTyping = (isTyping) => {
    chatSocket.sendTyping({ conversationId: conversation.id, isTyping });
  };

  const handleChange = (e) => {
    setText(e.target.value);
    sendTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => sendTyping(false), 1200);
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSend = async () => {
    if (!text.trim() && !file) return;
    setSending(true);
    try {
      let mediaUrl = null;
      let mediaType = 'NONE';
      if (file) {
        mediaUrl = await uploadToCloudinary(file);
        // Determine media type from file
        mediaType = file.type.startsWith('video') ? 'VIDEO' : 'IMAGE';
      }
      await chatSocket.sendMessage({
        conversationId: conversation.id,
        roomId,
        content: text.trim() || null,
        mediaUrl,
        mediaType,
      });
      setText('');
      setFile(null);
      sendTyping(false);
    } catch (e) {
      console.error('Send failed', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      {file && (
        <div className="mb-2 p-2 border rounded flex items-center justify-between">
          <div className="text-sm text-gray-700">{file.name}</div>
          <button onClick={() => setFile(null)} className="text-sm text-red-500">Remove</button>
        </div>
      )}
      <div className="flex items-center gap-3">
        <label className="cursor-pointer">
          <Image className="w-6 h-6 text-gray-500" />
          <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
        </label>
        <input
          className="flex-1 px-4 py-2 rounded-full border focus:outline-none"
          placeholder="Type a message"
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatComposer;
