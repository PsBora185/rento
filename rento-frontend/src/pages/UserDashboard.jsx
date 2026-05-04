import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import chatSocket from '../websocket/chatSocket';
import { chatAPI } from '../api/chat.api';
import Button from '../components/common/Button';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await chatAPI.getConversations();
        setConversations(res.data || []);
      } catch (error) {
        console.error('Failed to load conversations', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
    chatSocket.connect();
    const subscription = chatSocket.subscribeToMessages(() => {
      loadConversations();
    });

    return () => {
      if (subscription && subscription.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  const handleOpenChat = (conversationId) => {
    navigate(`/chat/${conversationId}`);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mb-8">Your ongoing conversations with room owners</p>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
            </div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No conversations yet</h2>
            <p className="text-gray-600 mb-6">Start by browsing rooms and contacting owners</p>
            <Button onClick={() => navigate('/rooms')}>Browse Rooms</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleOpenChat(conv.id)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{conv.room?.title || 'Room'}</h3>
                    <p className="text-sm text-gray-600 mt-1">Owner: {conv.owner?.name}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {conv.messages?.[conv.messages.length - 1]?.content || 'No messages yet'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : ''}
                    </span>
                    {conv.unreadCount > 0 && (
                      <div className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-2">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
