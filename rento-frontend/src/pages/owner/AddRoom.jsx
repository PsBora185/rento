import { useState } from "react";
import { roomAPI } from "../../api/room.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, CheckCircle, Upload, X, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROOM_TYPES, FURNISHING_TYPES, COMMON_AMENITIES, INDIAN_STATES } from "../../utils/constants";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const AddRoom = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isOwner } = useAuth();

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showTokenDebug, setShowTokenDebug] = useState(false);
  const token = localStorage.getItem("rento_token");
  const [customAmenitiesInput, setCustomAmenitiesInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    roomType: "",
    furnishingType: "",
    availableFrom: "",
    amenities: [],
    houseRules: "",
    depositAmount: "",
    images: [],
  });

  const today = new Date().toISOString().split('T')[0];

  // Add custom amenities to list
  const addCustomAmenity = () => {
    if (!customAmenitiesInput.trim()) {
      toast.error("Enter an amenity");
      return;
    }
    
    const newAmenities = customAmenitiesInput
      .split(",")
      .map(a => a.trim())
      .filter(a => a && !formData.amenities.includes(a));
    
    if (newAmenities.length === 0) {
      toast.error("Amenities already added or invalid input");
      return;
    }

    setFormData((p) => ({
      ...p,
      amenities: [...p.amenities, ...newAmenities],
    }));
    
    setCustomAmenitiesInput("");
    toast.success(`Added ${newAmenities.length} amenity/ies`);
  };

  const roomTypes = [
    "SINGLE",
    "SHARED",
    "STUDIO",
    "ONE_BHK",
    "TWO_BHK",
    "THREE_BHK",
  ];

  const furnishingTypes = ["FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"];

  const amenityOptions = [
    "WiFi",
    "Parking",
    "Air Conditioning",
    "Geyser",
    "Power Backup",
    "Bed",
    "Cupboard",
  ];

  // ================== IMAGE UPLOAD (CLOUDINARY) ==================
  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: fd,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploadingImages(true);

    const urls = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file);
      urls.push(url);
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
    }));

    setUploadingImages(false);
    toast.success("Images uploaded");
  };

  // ================== GET LOCATION ==================
  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location access not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((p) => ({
          ...p,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        toast.success("Location added");
      },
      () => toast.error("Location access denied")
    );
  };

  // ================== HANDLE SUBMIT ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setError("Valid price is required");
      return;
    }
    if (!formData.roomType) {
      setError("Room type is required");
      return;
    }
    if (!formData.furnishingType) {
      setError("Furnishing type is required");
      return;
    }
    if (!formData.availableFrom) {
      setError("Available from date is required");
      return;
    }
    if (formData.images.length === 0) {
      setError("At least one image is required");
      return;
    }

    if (uploadingImages) {
      setError("Please wait, images are still uploading");
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      depositAmount: Number(formData.depositAmount) || 0,
      amenities: formData.amenities,
      images: formData.images,
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
    };

    try {
      const res = await roomAPI.createRoom(payload);

      if (res?.id) {
        setSuccess(true);
        toast.success("✅ Room added successfully!");
        setTimeout(() => navigate("/owner/my-rooms"), 1500);
      } else {
        setError("Failed to create room. Please try again.");
        toast.error("Failed to add room");
      }
    } catch (err) {
      console.error("Room creation error:", err);
      console.log("Response status:", err?.response?.status);
      console.log("Response data:", err?.response?.data);
      console.log("Token in localStorage:", localStorage.getItem("rento_token"));
      
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to add room";
      
      // Handle authorization error
      if (err?.response?.status === 403) {
        setError("Access Denied: You don't have permission to add rooms. Make sure you're logged in as an owner.");
        toast.error("❌ You must be an owner to add rooms");
      } else if (err?.response?.status === 400) {
        setError(`Validation Error: ${errorMsg}`);
        toast.error(`Error: ${errorMsg}`);
      } else {
        setError(`Error: ${errorMsg}`);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ================== TOGGLE AMENITIES ==================
  const toggleAmenity = (a) => {
    setFormData((p) => {
      if (p.amenities.includes(a)) {
        return { ...p, amenities: p.amenities.filter((x) => x !== a) };
      } else {
        return { ...p, amenities: [...p.amenities, a] };
      }
    });
  };

  // ================== REMOVE IMAGE ==================
  const removeImage = (url) => {
    setFormData((p) => ({
      ...p,
      images: p.images.filter((img) => img !== url),
    }));
    toast.success("Image removed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Room</h1>
            <p className="text-gray-600">Fill in the details to list your room</p>
          </div>
          <button
            onClick={() => setShowTokenDebug(!showTokenDebug)}
            className="text-gray-500 hover:text-gray-700"
            title="Debug authentication"
          >
            {showTokenDebug ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Auth Debug Panel */}
        {showTokenDebug && (
          <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">🔐 Auth Debug Info</h3>
            <div className="text-sm text-purple-700 space-y-1">
              <p>
                <strong>Authenticated:</strong> {isAuthenticated ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <strong>Is Owner:</strong> {isOwner ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <strong>User:</strong> {user?.name || "No user"}
              </p>
              <p>
                <strong>User Role:</strong> {user?.role || "No role"}
              </p>
              <p>
                <strong>Token Present:</strong> {token ? "✅ Yes" : "❌ No"}
              </p>
              {token && (
                <p className="break-all">
                  <strong>Token:</strong> {token.substring(0, 20)}...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-green-800">Success!</h3>
              <p className="text-green-700 text-sm mt-1">Room added successfully. Redirecting...</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* TITLE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g., Spacious 2BHK in Andheri West"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                rows="4"
                placeholder="Describe your room in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* PRICE & DEPOSIT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Rent (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="15000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="30000"
                  value={formData.depositAmount}
                  onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                />
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location/Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Andheri West"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* CITY, STATE, PINCODE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="400058"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  maxLength="6"
                />
              </div>
            </div>

            {/* ROOM TYPE & FURNISHING */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Furnishing <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  value={formData.furnishingType}
                  onChange={(e) => setFormData({ ...formData, furnishingType: e.target.value })}
                >
                  <option value="">Select Furnishing</option>
                  {furnishingTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* AVAILABLE FROM */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.availableFrom}
                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                min={today}
              />
            </div>

            {/* AMENITIES */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Common Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {COMMON_AMENITIES.map((a) => (
                    <label
                      key={a}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{a}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SELECTED AMENITIES */}
              {formData.amenities.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-2">Selected Amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((a) => (
                      <div
                        key={a}
                        className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {a}
                        <button
                          type="button"
                          onClick={() => toggleAmenity(a)}
                          className="hover:text-green-900"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ADD CUSTOM AMENITIES */}
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add Custom Amenities
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="e.g., Gym, Pool, Garden (comma-separated)"
                    value={customAmenitiesInput}
                    onChange={(e) => setCustomAmenitiesInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()}
                  />
                  <button
                    type="button"
                    onClick={addCustomAmenity}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Tip: Enter multiple amenities separated by commas</p>
              </div>
            </div>

            {/* HOUSE RULES */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                House Rules
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                rows="3"
                placeholder="e.g., No smoking, quiet hours after 10 PM..."
                value={formData.houseRules}
                onChange={(e) => setFormData({ ...formData, houseRules: e.target.value })}
              />
            </div>

            {/* LOCATION AUTO-FILL */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                onClick={getLocation}
              >
                📍 Use Current Location
              </button>

              {formData.latitude && (
                <p className="text-xs text-gray-600 mt-2">
                  ✓ Location: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
                </p>
              )}
            </div>

            {/* IMAGE UPLOAD */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room Images <span className="text-red-500">*</span>
              </label>
              <div className="text-center">
                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                <label className="cursor-pointer">
                  <span className="text-blue-600 font-medium hover:text-blue-700">Click to upload</span>
                  {" "}
                  or drag and drop
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploadingImages}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
              </div>

              {uploadingImages && (
                <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded text-blue-700 text-sm flex items-center gap-2">
                  <div className="animate-spin">⏳</div>
                  Uploading images to Cloudinary...
                </div>
              )}

              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-600 mb-3">
                    {formData.images.length} image(s) uploaded
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {formData.images.map((url) => (
                      <div key={url} className="relative group">
                        <img
                          src={url}
                          alt="Room"
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition rounded-lg"
                          title="Remove image"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "⏳ Adding Room..." : "✅ Add Room"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
