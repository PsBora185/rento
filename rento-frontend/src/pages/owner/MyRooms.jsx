import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, X, AlertCircle, MapPin, DollarSign, Home, Search, Filter, Check } from 'lucide-react';
import { roomAPI } from '../../api/room.api';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const MyRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or table

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rooms, searchQuery, statusFilter]);

  const fetchRooms = async () => {
    try {
      const data = await roomAPI.getMyRooms();
      const roomsData = (data.data || data || []).map(room => ({
        ...room,
        isActive: room.available === 1 || room.available === true ? true : false
      }));
      setRooms(roomsData);
    } catch (error) {
      toast.error('Failed to fetch rooms');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = rooms;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => {
        if (statusFilter === 'active') return r.isActive;
        if (statusFilter === 'inactive') return !r.isActive;
        return true;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRooms(filtered);
  };

  const handleDeleteRoom = async (id) => {
    try {
      await roomAPI.deleteRoom(id);
      toast.success('Room deleted successfully!');
      setDeleteConfirm(null);
      setSelectedRoom(null);
      fetchRooms();
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Rooms</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your {rooms.length} property listing{rooms.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate('/owner/add-room')}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add New Room
          </button>
        </div>

        {/* Search & Filters */}
        {rooms.length > 0 && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-100 dark:border-neutral-700 p-4 mb-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || statusFilter !== 'all') && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center gap-2">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-primary-900">✕</button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('all')} className="hover:text-blue-900">✕</button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {rooms.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-12 text-center animate-fade-in">
            <Home className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No rooms yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Start by adding your first room to get started</p>
            <Button
              size="lg"
              icon={Plus}
              onClick={() => navigate('/owner/add-room')}
            >
              Add Your First Room
            </Button>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-12 text-center animate-fade-in">
            <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No rooms found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredRooms.map((room, idx) => (
                <div
                  key={room.id}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 overflow-hidden hover:shadow-lg hover:border-gray-200 dark:hover:border-neutral-600 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-300 dark:bg-neutral-700 overflow-hidden group">
                    <img
                      src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800';
                      }}
                    />
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        room.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {room.isActive ? <Check className="w-3 h-3" /> : null}
                        {room.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">{room.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{room.description}</p>

                    {/* Info */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-primary-600" />
                        <span className="line-clamp-1">{room.location}, {room.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Home className="w-4 h-4 text-primary-600" />
                        <span>{room.roomType}</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>₹{room.price?.toLocaleString()}/month</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-neutral-700">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/owner/edit-room/${room.id}`, { state: { room } });
                        }}
                        className="flex-1 px-3 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(room.id);
                        }}
                        className="flex-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-sm w-full p-6 shadow-xl border border-gray-100 dark:border-neutral-700 animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Delete Room?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm">
              Are you sure you want to delete this room? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRoom(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRooms;