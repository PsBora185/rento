import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import RoomCard from '../../components/rooms/RoomCard';
import RoomFilters from '../../components/rooms/RoomFilters';
import { roomAPI } from '../../api/room.api';
import toast from 'react-hot-toast';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    location: '',
    roomType: [],
    amenities: [],
  });
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const navigate = useNavigate();

  // ================= FETCH ROOMS FROM BACKEND =================
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // Call backend API
      const data = await roomAPI.getRooms();
      const roomsList = Array.isArray(data) ? data : (data.data || []);
      
      setRooms(roomsList);
      applyFilters(roomsList, searchQuery, filters);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
      toast.error('Failed to load rooms. Please check if backend is running.');
      setRooms([]);
      setFilteredRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= ROOM TYPE LABEL MAPPING =================
  const getRoomTypeLabel = (roomType) => {
    const typeMap = {
      STUDIO: 'Studio',
      SINGLE: 'Single Room',
      SHARED: 'Shared Room',
      ONE_BHK: '1 BHK',
      TWO_BHK: '2 BHK',
      THREE_BHK: '3 BHK',
    };
    return typeMap[roomType] || roomType;
  };

  // ================= APPLY FILTERS =================
  const applyFilters = useCallback((roomList, search, filterOptions = {}) => {
    let result = [...roomList];

    // Search filter
    if (search.trim()) {
      result = result.filter(
        (room) =>
          room.title?.toLowerCase().includes(search.toLowerCase()) ||
          room.location?.toLowerCase().includes(search.toLowerCase()) ||
          room.city?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Price filter
    result = result.filter(
      (room) =>
        room.price >= filterOptions.priceRange[0] &&
        room.price <= filterOptions.priceRange[1]
    );

    // Location filter
    if (filterOptions.location) {
      result = result.filter((room) =>
        (room.location?.toLowerCase() || '').includes(filterOptions.location.toLowerCase()) ||
        (room.city?.toLowerCase() || '').includes(filterOptions.location.toLowerCase())
      );
    }

    // Room type filter
    if (filterOptions.roomType.length > 0) {
      result = result.filter((room) =>
        filterOptions.roomType.includes(room.roomType)
      );
    }

    // Amenities filter
    if (filterOptions.amenities.length > 0) {
      result = result.filter((room) => {
        const roomAmenities = room.amenities || [];
        return filterOptions.amenities.every((amenity) => 
          roomAmenities.some(a => a?.toLowerCase() === amenity.toLowerCase())
        );
      });
    }

    setFilteredRooms(result);
    updateActiveFilterCount(filterOptions, search);
  }, []);

  // ================= UPDATE FILTER COUNT =================
  const updateActiveFilterCount = (filterOptions = {}, search = '') => {
    let count = 0;
    if (search.trim()) count++;
    if (filterOptions.priceRange && (filterOptions.priceRange[0] > 0 || filterOptions.priceRange[1] < 100000)) count++;
    if (filterOptions.location) count++;
    if (filterOptions.roomType && filterOptions.roomType.length > 0) count += filterOptions.roomType.length;
    if (filterOptions.amenities && filterOptions.amenities.length > 0) count += filterOptions.amenities.length;
    setActiveFilterCount(count);
  };

  // ================= HANDLE SEARCH =================
  const handleSearch = (value) => {
    setSearchQuery(value);
    applyFilters(rooms, value, filters);
  };

  // ================= HANDLE FILTERS CHANGE =================
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(rooms, searchQuery, newFilters);
  };

  // ================= HANDLE CLEAR FILTERS =================
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      priceRange: [0, 100000],
      location: '',
      roomType: [],
      amenities: [],
    });
    applyFilters(rooms, '', {
      priceRange: [0, 100000],
      location: '',
      roomType: [],
      amenities: [],
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ================= MAIN LAYOUT - SIDEBAR + CONTENT ================= */}
      {/* Sidebar Filters (Desktop) - Fixed with scroll isolation */}
      {!showFilters && (
        <div className="hidden md:fixed md:left-0 md:top-16 md:w-1/4 md:h-[calc(100vh-64px)] md:overflow-y-auto md:border-r md:border-neutral-200 md:bg-white md:z-10 md:overscroll-contain md:p-4">
          <RoomFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      )}

      {/* Main Content Area - Scroll isolated and offset for sidebar */}
      <div className="min-h-[calc(100vh-64px)] md:ml-1/4 flex flex-col overflow-y-auto overscroll-contain">
          {/* ================= HEADER - STICKY (scrolls with content) ================= */}
          <div className="sticky top-0 z-30 bg-white border-b border-neutral-200 shadow-sm">
            <div className="px-4 py-3 md:py-4">
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                {/* Title */}
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-neutral-900">
                    Browse Rooms
                  </h1>
                  <p className="text-neutral-600 text-xs md:text-sm mt-0.5">
                    {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} available
                  </p>
                </div>

                {/* Search Bar */}
                <div className="w-full md:flex-1 md:max-w-md flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search by location, room type..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      aria-label="Search rooms"
                    />
                  </div>

                  {/* Filters Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative px-4 py-2.5 bg-primary-50 text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-2 font-medium"
                    aria-label="Toggle filters"
                  >
                  <SlidersHorizontal className="w-5 h-5" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Active Filters Chips */}
            {activeFilterCount > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                {searchQuery && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    <span>"{searchQuery}"</span>
                    <button
                      onClick={() => handleSearch('')}
                      className="hover:text-primary-900"
                      aria-label="Remove search"
                    >
                      ×
                    </button>
                  </div>
                )}
                {filters.roomType.map((type) => (
                  <div
                    key={type}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-100 text-accent-700 rounded-full text-sm font-medium"
                  >
                    <span>{getRoomTypeLabel(type)}</span>
                    <button
                      onClick={() =>
                        handleFiltersChange({
                          ...filters,
                          roomType: filters.roomType.filter((t) => t !== type),
                        })
                      }
                      className="hover:text-accent-900"
                      aria-label={`Remove ${getRoomTypeLabel(type)} filter`}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {activeFilterCount > 2 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-neutral-600 hover:text-neutral-900 text-sm underline font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
            </div>
          </div>

          {/* ================= ROOM GRID ================= */}
          <div className="px-4 py-4">
            {/* Filters Modal - Mobile (Bottom Sheet) and Desktop (Popup) */}
            {showFilters && (
              <div className="fixed inset-0 z-50">
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/50 transition-opacity"
                  onClick={() => setShowFilters(false)}
                  aria-label="Close filters"
                />

                {/* Modal - Mobile (Bottom Sheet) */}
                <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden animate-slide-up flex flex-col">
                  <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-4 flex justify-between items-center z-10 flex-shrink-0">
                    <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-neutral-600 hover:text-neutral-900"
                      aria-label="Close filters"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="overflow-y-auto flex-1 p-4">
                    <RoomFilters
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={handleClearFilters}
                    />
                  </div>
                </div>

                {/* Modal - Desktop (Center Popup) */}
                <div className="hidden md:flex absolute inset-0 items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden animate-scale-in flex flex-col">
                    {/* Sticky Header - Always visible */}
                    <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center z-10 flex-shrink-0">
                      <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-neutral-600 hover:text-neutral-900 text-2xl leading-none"
                        aria-label="Close filters"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto flex-1 p-6">
                      <RoomFilters
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onClearFilters={handleClearFilters}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden bg-neutral-200 animate-pulse" aria-label="Loading room">
                    <div className="w-full h-48 bg-neutral-300" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-neutral-300 rounded w-3/4" />
                      <div className="h-3 bg-neutral-300 rounded w-1/2" />
                      <div className="h-4 bg-neutral-300 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6">
                  <MapPin className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">No rooms found</h3>
                <p className="text-neutral-600 mb-6 max-w-sm">
                  {searchQuery || activeFilterCount > 0
                    ? 'Try adjusting your search or filters to find more rooms'
                    : 'No rooms available at the moment. Check back soon!'}
                </p>
                {(searchQuery || activeFilterCount > 0) && (
                  <button onClick={handleClearFilters} className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredRooms.map((room, index) => {
                  const delay = `${index * 50}ms`;
                  return (
                    <div key={room.id} className="animate-fade-in" style={{ animationDelay: delay }}>
                      <RoomCard room={room} />
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && filteredRooms.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium text-neutral-600">Previous</button>
                <div className="flex gap-1">
                  {[1, 2, 3].map((page) => (
                    <button key={page} className={`px-3 py-2 rounded-lg font-medium transition-colors ${page === 1 ? 'bg-primary-500 text-white' : 'border border-neutral-300 text-neutral-600 hover:bg-neutral-50'}`}>
                      {page}
                    </button>
                  ))}
                </div>
                <button className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium text-neutral-600">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Rooms