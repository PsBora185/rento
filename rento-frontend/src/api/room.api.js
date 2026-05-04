import api from "./axios";

export const roomAPI = {
  // Get all rooms with filters
  getRooms: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.city) queryParams.append("city", params.city);
    if (params.minPrice) queryParams.append("minPrice", params.minPrice);
    if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice);

    const response = await api.get(`/rooms/search?${queryParams.toString()}`);
    return response.data;
  },

  // Get single room
  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  // Get nearby rooms
  getNearbyRooms: async (latitude, longitude, radiusKm = 10) => {
    const response = await api.get("/rooms/nearby", {
      params: { latitude, longitude, radiusKm },
    });
    return response.data;
  },

  // Create room (OWNER) → application/json with Cloudinary URLs
  createRoom: async (formData) => {
    const response = await api.post("/rooms", formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  // Update room (OWNER) → application/json with Cloudinary URLs
  updateRoom: async (id, formData) => {
    const response = await api.put(`/rooms/${id}`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  // Delete room (OWNER)
  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },

  // Get rooms owned by current owner
  getMyRooms: async () => {
    const response = await api.get("/rooms/owner/my-rooms");
    return response.data;
  },
};
