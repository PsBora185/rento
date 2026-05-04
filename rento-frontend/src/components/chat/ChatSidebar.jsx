import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatAPI } from '../../api/chat.api';
import chatSocket from '../../websocket/chatSocket';
import { getUser } from '../../utils/token';
import Loader from '../common/Loader';
import { formatDistanceToNow } from 'date-fns';

const Avatar = ({ name }) => (
  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
    {name ? name[0].toUpperCase() : '?'}
  </div>
);

const ConversationItem = ({ conv, active, onClick }) => {
  const lastMsg = conv.lastMessage;
  const currentUser = getUser();
  const preview = lastMsg ? (lastMsg.text || (lastMsg.mediaUrl ? '📷 Media' : '')) : 'No messages yet';
  
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition ${
        active ? 'bg-gray-100' : ''
      }`}
    >
      <Avatar name={lastMsg?.sender?.name || 'User'} />
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-900 truncate">{lastMsg?.sender?.name || 'User'}</div>
          <div className="text-xs text-gray-400 ml-2">{lastMsg ? formatDistanceToNow(new Date(lastMsg.timestamp), { addSuffix: true }) : ''}</div>
        </div>
        <div className="text-sm text-gray-500 truncate">{preview}</div>
      </div>
    </div>
  );
};

const ChatSidebar = ({ onSelect, selectedConversationId, className = '' }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await chatAPI.getConversations();
      const user = getUser();
      const list = (res.data || []).map((c) => ({ ...c, currentUserId: user?.id }));
      setConversations(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();

    // subscribe to real-time messages to update conversation preview
    chatSocket.subscribeToMessages((message) => {
      setConversations((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((c) => c.id === message.conversationId);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], lastMessage: message };
        } else {
          // new conversation - push to list
          updated.unshift({ id: message.conversationId, lastMessage: message });
        }
        // sort by last message timestamp desc
        updated.sort((a, b) => {
          const ta = a.lastMessage?.timestamp || 0;
          const tb = b.lastMessage?.timestamp || 0;
          return new Date(tb) - new Date(ta);
        });
        return updated;
      });
    });

    // reload when component mounts
  }, []);

  if (loading) return <Loader message="Loading conversations..." />;

  return (
    <div className={`w-full md:w-80 bg-white border-r border-gray-100 ${className}`}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Messages</h3>
      </div>
      <div className="p-4 space-y-2 overflow-y-auto h-[72vh]">
        {conversations.length === 0 && <div className="text-gray-500">No conversations yet</div>}
        {conversations.map((c) => (
          <ConversationItem
            key={c.id}
            conv={c}
            active={String(c.id) === String(selectedConversationId || params.id)}
            onClick={() => {
              if (onSelect) onSelect(c);
              navigate(`/chat/${c.id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
