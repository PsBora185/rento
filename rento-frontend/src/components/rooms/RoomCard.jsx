import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, Wifi, Wind, Zap, Shield } from 'lucide-react';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

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

  // ================= GET IMAGE URL =================
  const getImageUrl = () => {
    if (room.image) return room.image;
    if (room.images && Array.isArray(room.images) && room.images.length > 0) {
      return room.images[0];
    }
    // Fallback image
    return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop';
  };

  const imageUrl = getImageUrl();
  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: <Wifi className="w-4 h-4" />,
      ac: <Wind className="w-4 h-4" />,
      parking: <Zap className="w-4 h-4" />,
      security: <Shield className="w-4 h-4" />,
    };
    return icons[amenity] || null;
  };

  // ================= HANDLE CARD CLICK =================
  const handleCardClick = () => {
    navigate(`/rooms/${room.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer h-full transition-all duration-300 transform hover:-translate-y-1"
      role="article"
      aria-label={`Room: ${room.title}`}
    >
      {/* ================= IMAGE SECTION ================= */}
      <div className="relative h-48 md:h-56 rounded-xl overflow-hidden bg-neutral-200 mb-4">
        {/* Image with zoom effect */}
        <img
          src={imageUrl}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop';
          }}
        />

        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-2">
          {room.isFeatured && (
            <span className="px-3 py-1.5 bg-accent-500 text-white text-xs md:text-sm font-bold rounded-lg shadow-lg">
              Featured
            </span>
          )}
          {room.isNew && (
            <span className="px-3 py-1.5 bg-primary-500 text-white text-xs md:text-sm font-bold rounded-lg shadow-lg">
              New
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 group-hover:scale-110 shadow-md"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-5 h-5 md:w-6 md:h-6 transition-all ${
              isFavorite ? 'fill-accent-500 text-accent-500' : 'text-neutral-600 hover:text-accent-500'
            }`}
          />
        </button>

        {/* Unavailable Badge - Only show if room is NOT available (0 or false) */}
        {room.isAvailable === 0 || room.isAvailable === false && (
          <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 px-3 py-1.5 bg-error text-white text-xs md:text-sm font-bold rounded-lg shadow-lg">
            Unavailable
          </div>
        )}
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="rounded-xl bg-white p-4 md:p-5 shadow-md group-hover:shadow-xl transition-shadow duration-300">
        {/* Title and Location */}
        <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {room.title}
        </h3>

        <div className="flex items-center gap-1 text-neutral-600 text-sm mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{room.location}</span>
        </div>

        {/* Room Type Badge */}
        <div className="mb-4">
          <span className="inline-block px-2.5 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full">
            {getRoomTypeLabel(room.roomType)}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
            <span className="font-semibold text-neutral-900">{room.rating}</span>
          </div>
          <span className="text-xs text-neutral-600">
            ({room.reviewCount} {room.reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        {/* Amenities Icons */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            {room.amenities.slice(0, 4).map((amenity, index) => (
              <div
                key={index}
                className="p-2 bg-neutral-100 rounded-lg text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                title={amenity}
                aria-label={amenity}
              >
                {getAmenityIcon(amenity) || (
                  <span className="text-xs font-medium">{amenity.substring(0, 2)}</span>
                )}
              </div>
            ))}
            {room.amenities.length > 4 && (
              <span className="text-xs font-medium text-neutral-600 px-2">
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Price and Button */}
        <div className="flex items-end justify-between border-t border-neutral-200 pt-4">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary-600">
              ₹{room.price.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-600">per month</p>
          </div>

          <button
            className="px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200"
            aria-label={`View details for ${room.title}`}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;