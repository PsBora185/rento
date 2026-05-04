import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Building2, User, Settings, HelpCircle, Plus, Eye, MessageSquare, Mail, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../api/chat.api';
import chatSocket from '../../websocket/chatSocket';
import toast from 'react-hot-toast';

const OwnerSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
  const [ongoingChats, setOngoingChats] = useState([]);

  useEffect(() => {
    loadConversations();
    
    // Subscribe to real-time updates
    chatSocket.connect().catch(console.error);
    const onMessage = () => {
      loadConversations();
    };
    chatSocket.subscribeToMessages(onMessage);
    
    return () => {
      chatSocket.subscribeToMessages(() => {});
    };
  }, []);

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations();
      const allConversations = response.data || [];
      setConversations(allConversations);
      
      // Separate into contact requests and ongoing chats
      // Contact request: conversation with no messages from owner yet
      // Ongoing chat: conversation with messages from owner
      const requests = allConversations.filter(conv => {
        // A contact request is when renter initiated but owner hasn't replied
        // Check by looking at unread count and message content
        return conv.unreadCount > 0 || !conv.lastMessage || conv.lastMessage === 'No messages yet';
      });
      
      const ongoing = allConversations.filter(conv => {
        return conv.unreadCount === 0 && conv.lastMessage && conv.lastMessage !== 'No messages yet';
      });
      
      setContactRequests(requests);
      setOngoingChats(ongoing);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/owner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/owner/my-rooms', icon: Building2, label: 'My Rooms' },
    { path: '/rooms', icon: Eye, label: 'View Rooms' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleContactRequestClick = () => {
    if (contactRequests.length > 0) {
      navigate(`/chat/${contactRequests[0].id}`);
      setSidebarOpen(false);
    }
  };

  const handleOngoingChatClick = () => {
    if (ongoingChats.length > 0) {
      navigate(`/chat/${ongoingChats[0].id}`);
      setSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <>
      {/* User Info */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user?.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation (scrollable if needed) */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-4">
          Menu
        </div>

        <Link
          to="/owner/add-room"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-sm`}
        >
          <Plus className="w-5 h-5" />
          Add Room
        </Link>

        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              isActive(item.path)
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Contact Requests Section */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Requests</h3>
          <button 
            onClick={handleContactRequestClick}
            disabled={contactRequests.length === 0}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition group ${
              contactRequests.length === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
            }`}
          >
            <Mail className={`w-5 h-5 ${contactRequests.length > 0 ? 'group-hover:text-orange-600' : ''}`} />
            <span className="flex-1 text-left">Contact Requests</span>
            {contactRequests.length > 0 && (
              <span className="bg-orange-100 text-orange-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {contactRequests.length}
              </span>
            )}
          </button>
          {contactRequests.length > 0 && (
            <div className="mt-2 text-xs text-orange-600 px-4">
              💬 {contactRequests[0].otherUserName} wants to chat about {contactRequests[0].roomTitle}
            </div>
          )}
        </div>

        {/* Ongoing Chats Section */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Messages</h3>
          <button 
            onClick={handleOngoingChatClick}
            disabled={ongoingChats.length === 0}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition group ${
              ongoingChats.length === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <MessageSquare className={`w-5 h-5 ${ongoingChats.length > 0 ? 'group-hover:text-blue-600' : ''}`} />
            <span className="flex-1 text-left">Ongoing Chats</span>
            {ongoingChats.length > 0 && (
              <span className="bg-blue-100 text-blue-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {ongoingChats.length}
              </span>
            )}
          </button>
          {ongoingChats.length > 0 && (
            <div className="mt-2 text-xs text-blue-600 px-4">
              💬 Active chat with {ongoingChats[0].otherUserName}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t bg-gray-50">
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <Settings className="w-4 h-4" />
            Settings
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <HelpCircle className="w-4 h-4" />
            Help & Support
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r h-screen flex-col fixed left-0 top-16">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar - Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar - Drawer */}
      <aside
        className={`fixed left-0 top-16 w-64 bg-white h-[calc(100vh-64px)] flex flex-col z-50 transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>

      {/* Spacer for Desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0"></div>
    </>
  );
};

export default OwnerSidebar;
