import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Building2, Phone, ArrowRight } from 'lucide-react';
import { chatAPI } from '../api/chat.api';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const ChatRequestsPage = () => {
  const navigate = useNavigate();
  const [chatRequests, setChatRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChatRequests();
  }, []);

  const loadChatRequests = async () => {
    try {
      setLoading(true);
      // Get all conversations and filter for pending (no owner reply/ownerReplied = false)
      const res = await chatAPI.getConversations();
      const pending = res.data?.filter(conv => !conv.ownerReplied) || [];
      setChatRequests(pending);
    } catch (error) {
      console.error('Failed to load chat requests', error);
      toast.error('Failed to load chat requests');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (conversationId) => {
    navigate(`/chat/${conversationId}`);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chat Requests</h1>
        <p className="text-gray-600 mt-2">
          Pending conversations waiting for owner response
        </p>
      </div>

      {chatRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No pending requests
          </h2>
          <p className="text-gray-600 mb-6">
            All your chat requests have been responded to
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {chatRequests.map((conv) => (
            <div
              key={conv.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer border-l-4 border-yellow-500"
              onClick={() => handleOpenChat(conv.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Room Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">
                      {conv.room?.title || 'Room'}
                    </h3>
                  </div>

                  {/* Owner Info */}
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{conv.owner?.name}</span>
                    {conv.owner?.phone && (
                      <>
                        <Phone className="w-4 h-4 ml-2" />
                        <span>{conv.owner.phone}</span>
                      </>
                    )}
                  </div>

                  {/* Last Message */}
                  <p className="text-sm text-gray-500 mb-2">
                    {conv.messages?.[conv.messages.length - 1]?.content ||
                      'No messages yet'}
                  </p>

                  {/* Status Badge */}
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                    Awaiting response
                  </span>
                </div>

                <div className="text-right ml-4 flex-shrink-0">
                  <span className="text-xs text-gray-500 block mb-3">
                    {new Date(conv.lastMessageAt).toLocaleDateString()}
                  </span>
                  <ArrowRight className="w-5 h-5 text-primary-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatRequestsPage;
