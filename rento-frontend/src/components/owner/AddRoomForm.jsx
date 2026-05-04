import { useState } from 'react';
import { ROOM_TYPES, FURNISHING_TYPES, COMMON_AMENITIES, INDIAN_STATES } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';
import { validators } from '../../utils/validators';

const AddRoomForm = ({ room, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState(room || {
    title: '',
    description: '',
    price: '',
    location: '',
    city: '',
    state: '',
    pincode: '',
    roomType: 'ONE_BHK',
    furnishingType: 'SEMI_FURNISHED',
    amenities: [],
    images: '',
    depositAmount: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleAmenityToggle = (amenity) => {
    const amenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!validators.price(formData.price)) newErrors.price = 'Valid price required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (formData.pincode && !validators.pincode(formData.pincode)) newErrors.pincode = 'Invalid pincode';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) : null,
      images: formData.images ? formData.images.split(',').map(i => i.trim()).filter(i => i) : [],
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Room Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="e.g., Spacious 2BHK in Andheri"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-4 ${
            errors.description ? 'border-red-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-100'
          }`}
          placeholder="Describe your room..."
        />
        {errors.description && <p className="mt-1.5 text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-100"
          >
            {Object.entries(ROOM_TYPES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing *</label>
          <select
            name="furnishingType"
            value={formData.furnishingType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-100"
          >
            {Object.entries(FURNISHING_TYPES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Monthly Rent (₹)"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="15000"
          required
        />
        <Input
          label="Security Deposit (₹)"
          type="number"
          name="depositAmount"
          value={formData.depositAmount}
          onChange={handleChange}
          placeholder="30000"
        />
      </div>

      <Input
        label="Location/Area"
        name="location"
        value={formData.location}
        onChange={handleChange}
        error={errors.location}
        placeholder="Andheri West"
        required
      />

      <div className="grid md:grid-cols-3 gap-4">
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
          placeholder="Mumbai"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-4 ${
              errors.state ? 'border-red-500' : 'border-gray-300 focus:ring-primary-100'
            }`}
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <Input
          label="Pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          error={errors.pincode}
          placeholder="400058"
          maxLength="6"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {COMMON_AMENITIES.map(amenity => (
            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="rounded text-primary-600 focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <Input
        label="Image URLs (comma-separated)"
        name="images"
        value={formData.images}
        onChange={handleChange}
        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        helperText="Paste image URLs separated by commas"
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" fullWidth loading={loading}>
          {room ? 'Update Room' : 'Add Room'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddRoomForm;