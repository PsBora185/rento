import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, Home, Phone, Mail, ArrowLeft, Check, Heart, Share2, Calendar, AlertCircle, Shield, Wifi } from 'lucide-react';
import { roomAPI } from '../../api/room.api';
import { chatAPI } from '../../api/chat.api';
import { ROOM_TYPES, FURNISHING_TYPES } from '../../utils/constants';
import RoomGallery from '../../components/rooms/RoomGallery';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [contactingOwner, setContactingOwner] = useState(false);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const data = await roomAPI.getRoomById(id);
      setRoom(data.data);
    } catch (error) {
      toast.error('Room not found');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleContactOwner = async () => {
    try {
      setContactingOwner(true);
      const res = await chatAPI.startConversation(room.id);
      const conversation = res.data;
      if (conversation?.conversationId) {
        navigate(`/chat/${conversation.conversationId}`);
      } else {
        toast.error('Failed to start conversation');
      }
    } catch (e) {
      console.error(e);
      toast.error('Unable to start conversation');
    } finally {
      setContactingOwner(false);
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading room details..." />;
  }

  if (!room) {
    return null;
  }

  // Helper: Truncate description for "Read more" functionality
  const shouldTruncate = room.description && room.description.length > 300;
  const displayDescription = isDescriptionExpanded
    ? room.description
    : room.description?.substring(0, 300) + (shouldTruncate ? '...' : '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* ========== MAIN CONTENT ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        {/* Back Button - Non-sticky, scrolls naturally */}
        <div className="mb-6 animate-fade-in">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/rooms')}
            className="text-sm"
          >
            Back to Rooms
          </Button>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ========== LEFT COLUMN: MAIN CONTENT (65%) ========== */}
          <div className="lg:col-span-2 space-y-6">
            {/* --- GALLERY SECTION --- */}
            <section>
              <RoomGallery images={room.images} title={room.title} />
            </section>

            {/* --- ROOM TITLE, LOCATION & RATING --- */}
            <section className="animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 rounded-full text-xs sm:text-sm font-semibold border border-primary-200">
                      {ROOM_TYPES[room.roomType]}
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-xs sm:text-sm font-semibold border border-green-200">
                      {FURNISHING_TYPES[room.furnishingType]}
                    </span>
                    {room.verified && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 border border-blue-200">
                        <Shield className="w-4 h-4" /> Verified
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {room.title}
                  </h1>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span className="text-sm sm:text-base">
                      {room.location}, {room.city}, {room.state}
                      {room.pincode && ` - ${room.pincode}`}
                    </span>
                  </div>
                </div>

                {/* Share & Save Actions */}
                <div className="flex gap-3 sm:flex-col">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                      isSaved
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save this room'}
                    aria-label="Save room"
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    className="p-3 rounded-full bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 transition-all duration-300 hover:scale-110 active:scale-95"
                    title="Share this room"
                    aria-label="Share room"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700" />
            </section>

            {/* --- OWNER/HOST INFO CARD --- */}
            {room.owner && (
              <section className="animate-slide-up animation-delay-100">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {room.owner.name?.charAt(0).toUpperCase()}
                      </div>

                      {/* Host Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {room.owner.name}
                          </h3>
                          {room.owner.yearsHosting && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                              {room.owner.yearsHosting}+ yrs
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Property Owner</p>
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span>Verified Host</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Options */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-700 space-y-3">
                    {room.owner.email && (
                      <a
                        href={`mailto:${room.owner.email}`}
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                      >
                        <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">{room.owner.email}</span>
                      </a>
                    )}
                    {room.owner.phone && (
                      <a
                        href={`tel:${room.owner.phone}`}
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                      >
                        <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">{room.owner.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* --- DESCRIPTION SECTION --- */}
            <section className="animate-slide-up animation-delay-200">
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  About This Room
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-4">
                  {displayDescription}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm transition-colors"
                  >
                    {isDescriptionExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>
            </section>

            {/* --- AMENITIES SECTION --- */}
            {room.amenities && room.amenities.length > 0 && (
              <section className="animate-slide-up animation-delay-300">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Amenities
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {room.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors"
                      >
                        <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* --- HOUSE RULES SECTION --- */}
            {room.houseRules && (
              <section className="animate-slide-up animation-delay-400">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    House Rules
                  </h2>
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                      {room.houseRules}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* --- LOCATION SECTION --- */}
            <section className="animate-slide-up animation-delay-500">
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Location
                </h2>
                <div className="h-64 bg-gray-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      {room.location}, {room.city}, {room.state}
                    </p>
                    <a
                      href={`https://maps.google.com/maps?q=${room.location},${room.city},${room.state}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ========== RIGHT COLUMN: SIDEBAR (35%) ========== */}
          <div className="lg:col-span-1">
            {/* Sticky Booking Card */}
            <div className="sticky top-24 space-y-4">
              {/* PRICING CARD */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border-2 border-primary-100 dark:border-primary-900 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 hover:shadow-xl transition-shadow animate-slide-up">
                {/* Price Display */}
                <div className="mb-6 animate-pulse-soft">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                      ₹{room.price?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">per month</p>
                </div>

                {/* Deposit Info */}
                {room.depositAmount && (
                  <div className="mb-6 p-4 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 rounded-lg border border-primary-200 dark:border-primary-800">
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider mb-2">
                      Security Deposit
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹{room.depositAmount.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">due at check-in</span>
                    </div>
                  </div>
                )}

                {/* Room Details Summary */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Room Type</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {ROOM_TYPES[room.roomType]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Furnishing</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {FURNISHING_TYPES[room.furnishingType]}
                    </span>
                  </div>
                  {room.availableFrom && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Available
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {new Date(room.availableFrom).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleContactOwner}
                  disabled={contactingOwner}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <span>{contactingOwner ? 'Connecting...' : 'Contact Owner'}</span>
                </button>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="flex flex-col items-center gap-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600 dark:text-gray-400 text-xs">Verified</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Wifi className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600 dark:text-gray-400 text-xs">Secure</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Check className="w-4 h-4 text-accent-600" />
                    <span className="text-gray-600 dark:text-gray-400 text-xs">Approved</span>
                  </div>
                </div>
              </div>

              {/* Mobile CTA - Sticky Bottom */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 p-4 z-30 shadow-lg">
                <button
                  onClick={handleContactOwner}
                  disabled={contactingOwner}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 active:scale-95"
                >
                  {contactingOwner ? 'Connecting...' : 'Contact Owner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile spacing for sticky CTA */}
      <div className="lg:hidden h-20" />
    </div>
  );
};

export default RoomDetails;