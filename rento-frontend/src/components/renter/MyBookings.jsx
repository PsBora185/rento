import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import BookingCard from './BookingCard';
import Loader from '../common/Loader';
// import { bookingAPI } from '../../api/booking.api'; // Future implementation

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Future: Fetch bookings from API
    // fetchBookings();
    
    // Mock data for now
    setBookings([]);
    setLoading(false);
  }, []);

  if (loading) {
    return <Loader message="Loading your bookings..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Track your room booking requests</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600">
            Start by browsing rooms and making your first booking request
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;