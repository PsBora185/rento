export const USER_ROLES = {
  OWNER: 'OWNER',
  RENTER: 'RENTER',
};

export const ROOM_TYPES = {
  SINGLE: 'Single Room',
  SHARED: 'Shared Room',
  STUDIO: 'Studio',
  ONE_BHK: '1 BHK',
  TWO_BHK: '2 BHK',
  THREE_BHK: '3 BHK',
};

export const FURNISHING_TYPES = {
  FURNISHED: 'Fully Furnished',
  SEMI_FURNISHED: 'Semi Furnished',
  UNFURNISHED: 'Unfurnished',
};

export const COMMON_AMENITIES = [
  'WiFi',
  'AC',
  'Parking',
  'Gym',
  'Swimming Pool',
  'Power Backup',
  'Water Supply',
  'Security',
  'Lift',
  'Kitchen',
  'Balcony',
  'Washing Machine',
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];


export const PRICE_RANGES = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
  { label: '₹20,000 - ₹30,000', min: 20000, max: 30000 },
  { label: '₹30,000 - ₹50,000', min: 30000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: null },
];