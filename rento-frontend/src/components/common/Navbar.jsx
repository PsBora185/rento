import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Building2, User, LogOut, Menu, X, MessageCircle, Search, ChevronDown, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, isAuthenticated, logout, isOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const navLinks = [
    ...(isAuthenticated ? [
      {
        label: isOwner ? 'Dashboard' : 'Browse Rooms',
        path: isOwner ? '/owner/dashboard' : '/rooms',
        icon: Home,
      },
    ] : []),
    ...(isOwner && isAuthenticated ? [
      { label: 'View Rooms', path: '/rooms', icon: Eye },
      { label: 'My Rooms', path: '/owner/my-rooms', icon: Building2 },
    ] : []),
    ...(isAuthenticated ? [
      { label: 'Profile', path: '/profile', icon: User },
    ] : []),
  ];

  return (
    <>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white border-b border-gray-200 shadow-sm' 
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Sidebar toggle + Logo */}
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors lg:hidden"
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              )}

              <Link to="/" className="flex items-center gap-2 group hover:opacity-80 transition">
                <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">Rento</span>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map(({ label, path, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      isActive(path)
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Search Icon */}
                  <button className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors hidden sm:block">
                    <Search className="w-5 h-5" />
                  </button>

                  {/* Messages Icon */}
                  <Link
                    to="/chats"
                    className="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    aria-label="Messages"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </Link>

                  {/* Profile Dropdown */}
                  <div ref={dropdownRef} className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                      aria-label="Profile menu"
                    >
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </button>

                    {/* Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-1 animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{isOwner ? 'Property Owner' : 'Renter'}</p>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="fixed left-0 top-16 right-0 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 z-30 md:hidden max-h-[calc(100vh-64px)] overflow-y-auto animate-slide-down">
          <div className="p-4 space-y-2">
            {navLinks.map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  isActive(path)
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;