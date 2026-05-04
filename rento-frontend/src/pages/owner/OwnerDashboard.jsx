import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Eye, TrendingUp, MessageSquare, CheckCircle, AlertCircle, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { roomAPI } from '../../api/room.api';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    views: 0,
    activeListings: 0,
    inquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await roomAPI.getMyRooms();
      const roomsList = data.data || [];
      const totalViews = roomsList.reduce((sum, room) => sum + (room.viewCount || 0), 0);
      const activeListings = roomsList.filter(r => r.available === 1 || r.available === true).length;
      
      setRooms(roomsList);
      setStats({
        total: roomsList.length,
        views: totalViews,
        activeListings: activeListings,
        inquiries: Math.floor(Math.random() * 15) + 1, // Placeholder
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  // Metric Card Component
  const MetricCard = ({ icon: Icon, label, value, trend, trendValue, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trendValue}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, Owner! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Here's what's happening with your properties today
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={Building2}
            label="Total Rooms"
            value={stats.total}
            trend="up"
            trendValue="12"
            color="bg-blue-100 text-blue-600"
          />
          <MetricCard
            icon={Eye}
            label="Total Views"
            value={stats.views.toLocaleString()}
            trend="up"
            trendValue="28"
            color="bg-purple-100 text-purple-600"
          />
          <MetricCard
            icon={CheckCircle}
            label="Active Listings"
            value={stats.activeListings}
            trend="up"
            trendValue="5"
            color="bg-green-100 text-green-600"
          />
          <MetricCard
            icon={MessageSquare}
            label="New Inquiries"
            value={stats.inquiries}
            trend="up"
            trendValue="42"
            color="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions Section */}
          <div className="lg:col-span-2 animate-slide-up animation-delay-200">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/owner/add-room')}
                  className="p-6 border-2 border-dashed border-primary-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 group text-center"
                >
                  <Plus className="w-8 h-8 text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Add New Room</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">List a new property</p>
                </button>

                <button
                  onClick={() => navigate('/owner/my-rooms')}
                  className="p-6 border-2 border-dashed border-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group text-center"
                >
                  <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Rooms</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View and edit listings</p>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="animate-slide-up animation-delay-300">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Updates</h3>
              <div className="space-y-4">
                {rooms.slice(0, 3).map((room, idx) => (
                  <div key={room.id} className="flex gap-3 pb-4 border-b border-gray-100 dark:border-neutral-700 last:border-0 last:pb-0 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{room.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Updated recently</p>
                    </div>
                  </div>
                ))}
                {rooms.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No rooms yet. Create your first listing!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Empty State or Rooms Overview */}
        {stats.total === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-12 shadow-sm border border-gray-100 dark:border-neutral-700 text-center animate-fade-in">
            <Building2 className="w-20 h-20 text-primary-200 dark:text-primary-900/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Ready to List Your First Room?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start earning by listing your property on RENTO. It takes just a few minutes to get started.
            </p>
            <Button
              size="lg"
              icon={Plus}
              onClick={() => navigate('/owner/add-room')}
            >
              Add Your First Room
            </Button>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-neutral-700 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Properties Overview</h3>
              <button
                onClick={() => navigate('/owner/my-rooms')}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.slice(0, 3).map((room) => (
                <div key={room.id} className="border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gray-200 dark:bg-neutral-700 overflow-hidden">
                    <img
                      src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{room.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">₹{room.price?.toLocaleString()}/month</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;