import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../api/chat.api';
import chatSocket from '../websocket/chatSocket';
import { MessageCircle, Search, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const ChatListPage = () => {
  const navigate = useNavigate();
  const { isOwner } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    loadConversations();
    
    // Connect to WebSocket to receive real-time updates
    chatSocket.connect().catch(console.error);

    // Subscribe to message updates
    const onMessage = (message) => {
      // Reload conversations when a new message arrives
      loadConversations();
    };

    chatSocket.subscribeToMessages(onMessage);

    const interval = setInterval(() => {
      loadConversations();
    }, 5000); // Refresh every 5 seconds as fallback

    return () => {
      clearInterval(interval);
      chatSocket.subscribeToMessages(() => {});
    };
  }, []);

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations();
      // For renters: show ALL conversations they initiated
      // For owners: show only conversations where they have replied (ownerReplied = true)
      const filtered = isOwner 
        ? response.data?.filter(conv => conv.ownerReplied) || []
        : response.data || [];
      setConversations(filtered);
      setLoading(false);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.roomTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateTime) => {
    if (!dateTime) return '';
    try {
      return formatDistanceToNow(new Date(dateTime), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* ========== HEADER (FIXED) ========== */}
      <div className="flex-shrink-0 relative z-10 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 shadow-md">
        {/* Title Bar */}
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
            {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
          </p>
        </div>

        {/* Search Bar - Always visible */}
        <div className="px-4 sm:px-6 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========== CONVERSATIONS LIST ========== */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredConversations.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm">
                {searchQuery 
                  ? 'Try searching for a different name or room'
                  : isOwner 
                    ? 'New conversations will appear here when renters contact you'
                    : 'Chat with property owners to get started'}
              </p>
            </div>
          </div>
        ) : (
          // Chat List
          <div className="divide-y divide-gray-200 dark:divide-neutral-700">
            {filteredConversations.map((conversation, idx) => (
              <div
                key={conversation.id}
                onClick={() => navigate(`/chat/${conversation.id}`)}
                className="bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors duration-200 active:scale-[0.99] animate-fade-in group"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="px-4 sm:px-6 py-3.5 flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {conversation.otherUserAvatar ? (
                      <img
                        src={conversation.otherUserAvatar}
                        alt={conversation.otherUserName}
                        className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-gray-100 dark:ring-neutral-700"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm ring-2 ring-gray-100 dark:ring-neutral-700">
                        {conversation.otherUserName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    {/* Online Status Dot */}
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800 shadow-md"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Name & Time Row */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`font-semibold text-gray-900 dark:text-white truncate text-sm ${
                        conversation.unreadCount > 0 ? 'font-bold text-primary-600 dark:text-primary-400' : ''
                      }`}>
                        {conversation.otherUserName}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium flex-shrink-0">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>

                    {/* Room Title */}
                    <p className="text-xs text-gray-600 dark:text-gray-500 truncate mb-1.5 font-medium">
                      {conversation.roomTitle || 'Room inquiry'}
                    </p>

                    {/* Last Message Preview & Unread Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs truncate flex-1 line-clamp-1 ${
                        conversation.unreadCount > 0
                          ? 'font-semibold text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {conversation.lastMessage ? (
                          conversation.lastMessage
                        ) : (
                          <span className="italic opacity-50">No messages yet</span>
                        )}
                      </p>
                      {/* Unread Badge */}
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 px-2.5 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-full shadow-sm flex-shrink-0 animate-pulse">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                      )}
                    </div>
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

const formatTime = (dateTime) => {
  if (!dateTime) return '';
  try {
    const date = new Date(dateTime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return formatDistanceToNow(date, { addSuffix: false }).replace('about ', '');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return formatDistanceToNow(date, { addSuffix: true }).replace('about ', '');
    }
  } catch (error) {
    return '';
  }
};

export default ChatListPage;