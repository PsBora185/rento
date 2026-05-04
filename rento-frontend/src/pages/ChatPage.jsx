import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { chatAPI } from '../api/chat.api';
import ChatBubble from '../components/chat/ChatBubble';
import MessageInput from '../components/chat/MessageInput';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem('rento_token');
    if (!token) {
      navigate('/auth');
      return;
    }

    loadChatHistory();
    connectWebSocket(token);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [conversationId]);

  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getMessages(conversationId);
      setMessages(response.data || []);
      
      // Set other user info from first message
      if (response.data && response.data.length > 0) {
        const firstMessage = response.data[0];
        
        if (firstMessage.senderId !== user.id) {
          setOtherUser({
            name: firstMessage.senderName,
            avatar: firstMessage.senderAvatar,
          });
        } else {
          const otherMessage = response.data.find(msg => msg.senderId !== user.id);
          if (otherMessage) {
            setOtherUser({
              name: otherMessage.senderName,
              avatar: otherMessage.senderAvatar,
            });
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast.error('Failed to load chat history');
      setLoading(false);
    }
  };

  const connectWebSocket = (token) => {
    const socket = new SockJS('http://localhost:8080/ws-chat');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('WebSocket Connected');
      setConnected(true);

      client.subscribe(`/topic/chat/${conversationId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        console.log('Received message:', newMessage);
        
        setMessages((prevMessages) => {
          const exists = prevMessages.some(msg => msg.id === newMessage.id);
          if (exists) {
            return prevMessages;
          }
          return [...prevMessages, newMessage];
        });
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setConnected(false);
      toast.error('Connection lost. Reconnecting...');
    };

    client.activate();
    setStompClient(client);
  };

  const handleSendMessage = (content, mediaUrl, mediaType) => {
    if (!stompClient || !connected) {
      toast.error('Not connected to chat server');
      return;
    }

    const messagePayload = {
      conversationId: parseInt(conversationId),
      content: content || null,
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || 'NONE',
    };

    console.log('Sending message:', messagePayload);

    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(messagePayload),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* ========== HEADER (FIXED) ========== */}
      <div className="flex-shrink-0 relative z-10 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: Back button + User Info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/chats')}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full transition-colors flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            {/* User Avatar & Info */}
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {otherUser?.avatar ? (
                  <img
                    src={otherUser.avatar}
                    alt={otherUser?.name}
                    className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-gray-100 dark:ring-neutral-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-100 dark:ring-neutral-700">
                    {otherUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* Name & Status */}
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                  {otherUser?.name || 'User'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {connected ? '🟢 Online' : '🔄 Connecting...'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Options Button */}
          <button 
            className="p-2 -mr-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full transition-colors flex-shrink-0 ml-2"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* ========== MESSAGES CONTAINER (SCROLLABLE) ========== */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-4 sm:px-6 py-6 space-y-0.5 max-w-4xl mx-auto w-full">
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="mb-4 text-5xl opacity-20">💬</div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">No messages yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Start the conversation by sending a message
              </p>
            </div>
          )}

          {/* Messages List */}
          {messages.length > 0 && (
            <>
              {messages.map((message, idx) => {
                const isOwn = message.senderId === user.id;
                const prevMessage = idx > 0 ? messages[idx - 1] : null;
                const nextMessage = idx < messages.length - 1 ? messages[idx + 1] : null;
                
                // Check if this is the start of a message group
                const isGroupStart = !prevMessage || prevMessage.senderId !== message.senderId;
                const isGroupEnd = !nextMessage || nextMessage.senderId !== message.senderId;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${
                      isGroupStart ? 'mt-3' : 'mt-1'
                    } animate-fade-in`}
                  >
                    <ChatBubble
                      message={message}
                      isOwn={isOwn}
                      isGroupStart={isGroupStart}
                      isGroupEnd={isGroupEnd}
                    />
                  </div>
                );
              })}
            </>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} className="h-0" />
        </div>
      </div>

      {/* ========== INPUT AREA (FIXED) ========== */}
      <div className="flex-shrink-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;