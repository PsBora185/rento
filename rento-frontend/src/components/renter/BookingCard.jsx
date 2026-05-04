import { Calendar, MapPin, IndianRupee, Clock } from 'lucide-react';
import Button from '../common/Button';

const BookingCard = ({ booking }) => {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-blue-100 text-blue-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            {booking.room?.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{booking.room?.location}, {booking.room?.city}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-600">Move-in Date</div>
            <div className="font-medium">
              {booking.moveInDate ? new Date(booking.moveInDate).toLocaleDateString() : 'TBD'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <IndianRupee className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-gray-600">Monthly Rent</div>
            <div className="font-medium">₹{booking.monthlyRent?.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {booking.status === 'PENDING' && (
        <div className="flex gap-2 pt-4 border-t">
          <Button size="sm" variant="danger" fullWidth>
            Cancel Request
          </Button>
        </div>
      )}

      {booking.status === 'CONFIRMED' && (
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
            <Clock className="w-4 h-4" />
            <span>Booking confirmed! Contact owner for next steps.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;