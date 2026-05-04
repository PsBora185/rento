import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, Search, SkipForward, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { user, updateRole, isAuthenticated, loading, completeRoleSelection } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSelectRole = async (role) => {
    try {
      setSelectedRole(role);
      setIsProcessing(true);
      
      const res = await updateRole(role);
      if (res.success) {
        completeRoleSelection();
        const targetRoute = role === 'OWNER' ? '/owner/dashboard' : '/rooms';
        toast.success(`You are now ${role === 'OWNER' ? 'an Owner' : 'a Renter'}`);
        
        // Brief animation delay before navigation
        setTimeout(() => {
          navigate(targetRoute, { replace: true });
        }, 500);
      } else {
        toast.error('Failed to set role');
        setSelectedRole(null);
        setIsProcessing(false);
      }
    } catch (err) {
      toast.error('Failed to set role');
      setSelectedRole(null);
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    completeRoleSelection();
    toast.success('Welcome! You can update your role anytime in settings');
    navigate('/rooms', { replace: true });
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-neutral-600 font-medium">Preparing your onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          {/* Welcome Header - Animated Fade In */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="mb-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-clip-text text-transparent">
                  Welcome to RENTO
                </span>
              </h1>
              {user?.name && (
                <p className="text-2xl text-neutral-700 font-semibold">
                  Great to see you, <span className="text-primary-600">{user.name}</span>!
                </p>
              )}
            </div>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Choose how you want to use RENTO and start your journey with us
            </p>
          </div>

          {/* Role Selection Cards - Staggered Animation */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
            {/* RENTER Card */}
            <div
              onClick={() => !isProcessing && handleSelectRole('RENTER')}
              className={`group relative cursor-pointer transition-all duration-300 ${
                selectedRole === 'RENTER' ? 'scale-95' : 'hover:-translate-y-2'
              } ${isProcessing && selectedRole !== 'RENTER' ? 'opacity-50 cursor-not-allowed' : ''} animate-fade-in animation-delay-200`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-blue-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              
              <div className="relative glass-card p-8 md:p-10 rounded-3xl h-full flex flex-col items-center text-center backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-shadow">
                {/* Icon Circle */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-blue-400 rounded-full blur-lg opacity-20" />
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Search className="w-10 h-10 md:w-12 md:h-12 text-primary-600" />
                  </div>
                </div>

                {/* Content */}
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
                  Find Rooms
                </h2>
                <p className="text-neutral-600 mb-8 text-sm md:text-base leading-relaxed flex-grow">
                  Browse curated rooms, connect with owners, and find your perfect space effortlessly
                </p>

                {/* Feature List */}
                <div className="w-full space-y-3 mb-8 text-left">
                  {[
                    'Discover rooms in your area',
                    'Direct messaging with owners',
                    'Flexible booking options',
                    'Secure payments'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-neutral-700 text-sm md:text-base">
                      <Check className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  disabled={isProcessing && selectedRole !== 'RENTER'}
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedRole === 'RENTER'
                      ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white scale-95'
                      : 'bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:shadow-lg hover:scale-105'
                  } active:scale-95 disabled:opacity-50`}
                >
                  {selectedRole === 'RENTER' && isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                      Setting role...
                    </div>
                  ) : (
                    "I'm a Renter"
                  )}
                </button>
              </div>
            </div>

            {/* OWNER Card */}
            <div
              onClick={() => !isProcessing && handleSelectRole('OWNER')}
              className={`group relative cursor-pointer transition-all duration-300 ${
                selectedRole === 'OWNER' ? 'scale-95' : 'hover:-translate-y-2'
              } ${isProcessing && selectedRole !== 'OWNER' ? 'opacity-50 cursor-not-allowed' : ''} animate-fade-in animation-delay-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-green-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              
              <div className="relative glass-card p-8 md:p-10 rounded-3xl h-full flex flex-col items-center text-center backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-shadow">
                {/* Icon Circle */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-green-400 rounded-full blur-lg opacity-20" />
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent-100 to-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Home className="w-10 h-10 md:w-12 md:h-12 text-accent-600" />
                  </div>
                </div>

                {/* Content */}
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
                  List Rooms
                </h2>
                <p className="text-neutral-600 mb-8 text-sm md:text-base leading-relaxed flex-grow">
                  Rent out your space, manage bookings easily, and connect with quality tenants
                </p>

                {/* Feature List */}
                <div className="w-full space-y-3 mb-8 text-left">
                  {[
                    'List rooms in minutes',
                    'Smart booking management',
                    'Instant payment processing',
                    'Built-in messaging system'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-neutral-700 text-sm md:text-base">
                      <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  disabled={isProcessing && selectedRole !== 'OWNER'}
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedRole === 'OWNER'
                      ? 'bg-gradient-to-r from-accent-600 to-green-600 text-white scale-95'
                      : 'bg-gradient-to-r from-accent-600 to-green-600 text-white hover:shadow-lg hover:scale-105'
                  } active:scale-95 disabled:opacity-50`}
                >
                  {selectedRole === 'OWNER' && isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                      Setting role...
                    </div>
                  ) : (
                    "I'm an Owner"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Skip Link - Animated Fade In */}
          <div className="flex flex-col items-center gap-4 animate-fade-in animation-delay-400">
            <button
              onClick={handleSkip}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipForward className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="border-b border-transparent group-hover:border-primary-600 transition-colors">
                Skip for now
              </span>
            </button>
            <p className="text-sm text-neutral-500 text-center">
              You can change your role anytime in settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;