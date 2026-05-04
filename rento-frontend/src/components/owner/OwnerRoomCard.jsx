import { Edit, Trash2, Eye, IndianRupee } from 'lucide-react';
import Button from '../common/Button';

const OwnerRoomCard = ({ room, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="h-48 bg-gray-200">
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
          alt={room.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{room.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-5 h-5 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">
              {room.price?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Eye className="w-4 h-4" />
            <span>{room.viewCount || 0} views</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" icon={Edit} onClick={() => onEdit(room)} className="flex-1">
            Edit
          </Button>
          <Button size="sm" variant="danger" icon={Trash2} onClick={() => onDelete(room.id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OwnerRoomCard;