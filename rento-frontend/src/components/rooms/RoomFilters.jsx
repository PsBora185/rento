import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

const RoomFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  // ================= STATE =================
  const [openSections, setOpenSections] = useState({
    price: true,
    roomType: true,
    amenities: false,
    location: false,
  });

  // ================= CONSTANTS =================
  // Backend enum values: SINGLE, SHARED, STUDIO, ONE_BHK, TWO_BHK, THREE_BHK
  const ROOM_TYPES = [
    { value: 'STUDIO', label: 'Studio' },
    { value: 'SINGLE', label: 'Single Room' },
    { value: 'SHARED', label: 'Shared Room' },
    { value: 'ONE_BHK', label: '1 BHK' },
    { value: 'TWO_BHK', label: '2 BHK' },
    { value: 'THREE_BHK', label: '3 BHK' },
  ];
  const AMENITY_OPTIONS = [
    { id: 'wifi', label: 'WiFi', icon: '📡' },
    { id: 'ac', label: 'Air Conditioning', icon: '❄️' },
    { id: 'parking', label: 'Parking', icon: '🅿️' },
    { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { id: 'gym', label: 'Gym', icon: '💪' },
    { id: 'pool', label: 'Pool', icon: '🏊' },
    { id: 'laundry', label: 'Laundry', icon: '🧺' },
    { id: 'security', label: '24/7 Security', icon: '🔒' },
    { id: 'desk', label: 'Work Desk', icon: '🖥️' },
  ];

  // ================= TOGGLE SECTION =================
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ================= HANDLE PRICE CHANGE =================
  const handlePriceChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value) || 0;
    onFiltersChange({
      ...filters,
      priceRange: newRange,
    });
  };

  // ================= HANDLE ROOM TYPE TOGGLE =================
  const handleRoomTypeToggle = (type) => {
    const newRoomTypes = filters.roomType.includes(type)
      ? filters.roomType.filter((t) => t !== type)
      : [...filters.roomType, type];
    onFiltersChange({
      ...filters,
      roomType: newRoomTypes,
    });
  };

  // ================= HANDLE AMENITY TOGGLE =================
  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onFiltersChange({
      ...filters,
      amenities: newAmenities,
    });
  };

  // ================= HANDLE LOCATION CHANGE =================
  const handleLocationChange = (value) => {
    onFiltersChange({
      ...filters,
      location: value,
    });
  };

  return (
    <div className="sticky top-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
        {(filters.roomType.length > 0 || filters.amenities.length > 0 || filters.location) && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      {/* ================= PRICE RANGE ================= */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <button
          onClick={() => toggleSection('price')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
          aria-label="Toggle price filter"
          aria-expanded={openSections.price}
        >
          <h3 className="font-semibold text-neutral-900">Price Range</h3>
          <ChevronDown
            className={`w-5 h-5 text-neutral-600 transition-transform ${
              openSections.price ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.price && (
          <div className="px-4 py-4 border-t border-neutral-200 space-y-4">
            {/* Min Price */}
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-2">
                Min Price: ₹{filters.priceRange[0].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                aria-label="Minimum price"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-2">
                Max Price: ₹{filters.priceRange[1].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                aria-label="Maximum price"
              />
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { label: 'Under 10K', min: 0, max: 10000 },
                { label: '10K - 20K', min: 10000, max: 20000 },
                { label: '20K - 40K', min: 20000, max: 40000 },
                { label: '40K+', min: 40000, max: 100000 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      priceRange: [preset.min, preset.max],
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    filters.priceRange[0] === preset.min && filters.priceRange[1] === preset.max
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= ROOM TYPE ================= */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <button
          onClick={() => toggleSection('roomType')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
          aria-label="Toggle room type filter"
          aria-expanded={openSections.roomType}
        >
          <h3 className="font-semibold text-neutral-900">Room Type</h3>
          <ChevronDown
            className={`w-5 h-5 text-neutral-600 transition-transform ${
              openSections.roomType ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.roomType && (
          <div className="px-4 py-4 border-t border-neutral-200 space-y-2">
            {ROOM_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.roomType.includes(type.value)}
                  onChange={() => handleRoomTypeToggle(type.value)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 cursor-pointer accent-primary-600"
                  aria-label={`Filter by ${type.label}`}
                />
                <span className="text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ================= AMENITIES ================= */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <button
          onClick={() => toggleSection('amenities')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
          aria-label="Toggle amenities filter"
          aria-expanded={openSections.amenities}
        >
          <h3 className="font-semibold text-neutral-900">Amenities</h3>
          <ChevronDown
            className={`w-5 h-5 text-neutral-600 transition-transform ${
              openSections.amenities ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.amenities && (
          <div className="px-4 py-4 border-t border-neutral-200 grid grid-cols-2 gap-3">
            {AMENITY_OPTIONS.map((amenity) => (
              <label key={amenity.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity.id)}
                  onChange={() => handleAmenityToggle(amenity.id)}
                  className="w-4 h-4 rounded border-neutral-300 text-accent-600 cursor-pointer accent-accent-600"
                  aria-label={`Filter by ${amenity.label}`}
                />
                <span className="text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  {amenity.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ================= LOCATION ================= */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <button
          onClick={() => toggleSection('location')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
          aria-label="Toggle location filter"
          aria-expanded={openSections.location}
        >
          <h3 className="font-semibold text-neutral-900">Location</h3>
          <ChevronDown
            className={`w-5 h-5 text-neutral-600 transition-transform ${
              openSections.location ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.location && (
          <div className="px-4 py-4 border-t border-neutral-200">
            <input
              type="text"
              placeholder="Search location..."
              value={filters.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              aria-label="Search locations"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomFilters;