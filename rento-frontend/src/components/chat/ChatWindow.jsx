import { useEffect, useRef, useState } from 'react';
import { chatAPI } from '../../api/chat.api';
import chatSocket from '../../websocket/chatSocket';
import MessageBubble from './MessageBubble';
import ChatComposer from './ChatComposer';

const ChatWindow = ({ conversationId /* , roomId (unused) */ }) => {
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const listRef = useRef(null);

  const loadMessages = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await chatAPI.getMessages(id);
      const msgs = res.data || [];
      setMessages(msgs);
      scrollToBottom();
    } catch (e) {
      console.error('Failed to load messages:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!conversationId) return;
    loadMessages(conversationId);

    // ensure socket connected
    chatSocket.connect().catch(console.error);

    // message handler
    const onMessage = (msg) => {
      if (msg.conversationId === Number(conversationId)) {
        setMessages((m) => {
          const exists = m.some(existing => existing.id === msg.id);
          if (exists) return m;
          return [...m, msg];
        });
        scrollToBottom();
      }
    };

    const onTyping = (payload) => {
      if (payload.conversationId === Number(conversationId)) {
        setTypingUser(payload.isTyping ? 'Someone' : null);
        if (payload.isTyping) {
          setTimeout(() => setTypingUser(null), 2500);
        }
      }
    };

    chatSocket.subscribeToMessages(onMessage);
    chatSocket.subscribeToTyping(onTyping);
    // Subscribe to this conversation's topic
    chatSocket.subscribeToConversation(conversationId);

    return () => {
      // clear handlers
      chatSocket.subscribeToMessages(() => {});
      chatSocket.subscribeToTyping(() => {});
      // Unsubscribe from conversation topic
      chatSocket.unsubscribeFromConversation(conversationId);
    };
  }, [conversationId]);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 h-[72vh] flex items-center justify-center text-gray-500">Select a conversation</div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 rounded-xl overflow-hidden">
      <div className="p-4 border-b bg-white">
        <div className="font-semibold">Conversation</div>
      </div>
      <div ref={listRef} className="p-4 overflow-y-auto flex-1">
        {loading && <div className="text-gray-500">Loading messages...</div>}
        {!loading && messages.length === 0 && (
          <div className="text-gray-500">No messages yet — send the first message 👋</div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {typingUser && <div className="text-sm text-gray-500">{typingUser} is typing…</div>}
      </div>

      <ChatComposer conversation={{ id: Number(conversationId) }} roomId={roomId} />
    </div>
  );
};

export default ChatWindow;
