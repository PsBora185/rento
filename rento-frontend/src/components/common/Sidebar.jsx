import { MessageSquare, Home, User, Mail, LogOut, Building2, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isOwner, logout } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState({ dashboard: true });

  const isActive = (path) => location.pathname.startsWith(path);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (!sidebarOpen) setSidebarOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setSidebarOpen(false);
  };

  const navigationGroups = [
    {
      id: 'dashboard',
      title: sidebarOpen ? 'Dashboard' : undefined,
      items: [
        {
          path: isOwner ? '/owner/dashboard' : '/rooms',
          label: isOwner ? 'Dashboard' : 'Browse Rooms',
          icon: Home,
          badge: null,
        },
      ],
    },
    ...(isOwner ? [{
      id: 'rooms',
      title: sidebarOpen ? 'Rooms' : undefined,
      items: [
        {
          path: '/rooms',
          label: 'View Rooms',
          icon: Home,
          badge: null,
        },
        {
          path: '/owner/my-rooms',
          label: 'My Rooms',
          icon: Building2,
          badge: null,
        },
      ],
    }] : []),
    {
      id: 'messaging',
      title: sidebarOpen ? 'Messaging' : undefined,
      items: [
        ...(isOwner ? [{
          path: '/chat-requests',
          label: 'Chat Requests',
          icon: Mail,
          badge: '3',
        }] : []),
        {
          path: '/chats',
          label: 'Messages',
          icon: MessageSquare,
          badge: '2',
        },
      ],
    },
    {
      id: 'account',
      title: sidebarOpen ? 'Account' : undefined,
      items: [
        {
          path: '/profile',
          label: 'Profile',
          icon: User,
          badge: null,
        },
      ],
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-neutral-800 transition-all duration-300 z-30 flex-col border-r border-gray-200 dark:border-neutral-700 overflow-y-auto ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo/Brand Section */}
        <div className={`flex-shrink-0 px-4 py-6 border-b border-gray-200 dark:border-neutral-700 flex items-center ${
          sidebarOpen ? 'justify-between' : 'justify-center'
        }`}>
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'gap-0'}`}>
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">RENTO</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isOwner ? 'Owner' : 'Renter'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Section */}
        {sidebarOpen && (
          <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {navigationGroups.map((group) => (
            <div key={group.id}>
              {sidebarOpen && group.title && (
                <div className="px-3 py-2 mt-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {group.title}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center rounded-lg transition-all duration-200 group relative ${
                        sidebarOpen ? 'gap-3 px-3 py-2.5 text-left' : 'justify-center p-2.5'
                      } ${
                        active
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                      }`}
                      title={sidebarOpen ? '' : item.label}
                    >
                      {active && !sidebarOpen && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-600 rounded-r-lg" />
                      )}
                      <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                        active 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }`} />
                      {sidebarOpen && (
                        <>
                          <span className="truncate text-sm">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto flex-shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Section */}
        <div className={`flex-shrink-0 py-3 px-2 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 space-y-2`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-lg transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ${
              sidebarOpen ? 'gap-3 px-3 py-2.5 text-left' : 'justify-center p-2.5'
            }`}
            title={sidebarOpen ? '' : 'Logout'}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        {/* Copyright */}
        {sidebarOpen && (
          <div className="flex-shrink-0 px-4 py-2 text-center border-t border-gray-200 dark:border-neutral-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              © 2025 RENTO
            </p>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed top-16 inset-0 bg-black/40 dark:bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <aside className="lg:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white dark:bg-neutral-800 shadow-xl z-30 flex flex-col border-r border-gray-200 dark:border-neutral-700 overflow-y-auto animate-slide-in-left">
          {/* User Info */}
          <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
            {navigationGroups.map((group) => (
              <div key={group.id}>
                {group.title && (
                  <div className="px-3 py-2 mt-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {group.title}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          handleNavigation(item.path);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                          active
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${
                          active 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`} />
                        <span className="truncate text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto flex-shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="flex-shrink-0 py-3 px-2 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

          {/* Copyright */}
          <div className="flex-shrink-0 px-4 py-2 text-center border-t border-gray-200 dark:border-neutral-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              © 2025 RENTO
            </p>
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
