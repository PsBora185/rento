import { useState } from "react";
import { roomAPI } from "../../api/room.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, CheckCircle, Upload, X, Plus, Trash2, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { ROOM_TYPES, FURNISHING_TYPES } from "../../utils/constants";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const AddRoomEnhanced = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    city: "",
    state: "",
    pincode: "",
    roomType: "",
    furnishingType: "",
    availableFrom: "",
    amenities: [],
    houseRules: "",
    depositAmount: "",
    images: [],
  });

  const [customAmenityInput, setCustomAmenityInput] = useState("");

  const today = new Date().toISOString().split('T')[0];

  const steps = [
    { id: 0, label: "Basic Info", icon: "ℹ️" },
    { id: 1, label: "Pricing", icon: "💰" },
    { id: 2, label: "Amenities", icon: "✨" },
    { id: 3, label: "Images", icon: "📸" },
    { id: 4, label: "Review", icon: "✓" },
  ];

  const amenityOptions = [
    "WiFi", "Parking", "Air Conditioning", "Geyser", "Power Backup",
    "Bed", "Cupboard", "Kitchen", "Washer", "Dryer", "TV", "Balcony"
  ];

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd }
    );

    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");
    return data.secure_url;
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    setUploadingImages(true);
    const urls = [];

    for (const file of files) {
      try {
        const url = await uploadToCloudinary(file);
        urls.push(url);
      } catch (err) {
        toast.error("Failed to upload an image");
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls],
    }));

    setUploadingImages(false);
    if (urls.length > 0) toast.success(`${urls.length} image(s) uploaded`);
  };

  const removeImage = (url) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url),
    }));
  };

  const handleAddAmenity = () => {
    if (!customAmenityInput.trim()) {
      toast.error("Enter an amenity");
      return;
    }

    const newAmenities = customAmenityInput
      .split(",")
      .map(a => a.trim())
      .filter(a => a && !formData.amenities.includes(a));

    if (newAmenities.length === 0) {
      toast.error("Amenity already added");
      return;
    }

    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, ...newAmenities],
    }));

    setCustomAmenityInput("");
    toast.success(`Added ${newAmenities.length} amenity/ies`);
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.title.trim()) {
          setError("Title is required");
          return false;
        }
        if (!formData.description.trim()) {
          setError("Description is required");
          return false;
        }
        if (!formData.location.trim()) {
          setError("Location is required");
          return false;
        }
        if (!formData.city.trim()) {
          setError("City is required");
          return false;
        }
        if (!formData.roomType) {
          setError("Room type is required");
          return false;
        }
        if (!formData.furnishingType) {
          setError("Furnishing type is required");
          return false;
        }
        break;
      case 1:
        if (!formData.price || formData.price <= 0) {
          setError("Valid price is required");
          return false;
        }
        if (!formData.availableFrom) {
          setError("Available from date is required");
          return false;
        }
        break;
      case 3:
        if (formData.images.length === 0) {
          setError("At least one image is required");
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    const payload = {
      ...formData,
      price: Number(formData.price),
      depositAmount: Number(formData.depositAmount) || 0,
      available: 1,
      amenities: formData.amenities,
      images: formData.images,
    };

    try {
      const res = await roomAPI.createRoom(payload);
      if (res?.id) {
        setSuccess(true);
        toast.success("✅ Room added successfully!");
        setTimeout(() => navigate("/owner/my-rooms"), 1500);
      } else {
        setError("Failed to create room. Please try again.");
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Failed to add room";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step Components
  const Step0 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h3>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Room Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Cozy Studio in City Center"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          placeholder="Describe your room in detail..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows="4"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Room Type <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.roomType}
            onChange={(e) => setFormData(prev => ({ ...prev, roomType: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="">Select room type</option>
            {Object.entries(ROOM_TYPES).map(([key, val]) => (
              <option key={key} value={key}>{val}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Furnishing <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.furnishingType}
            onChange={(e) => setFormData(prev => ({ ...prev, furnishingType: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="">Select furnishing</option>
            {Object.entries(FURNISHING_TYPES).map(([key, val]) => (
              <option key={key} value={key}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Location <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Near Metro Station"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            City <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Mumbai"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            State
          </label>
          <input
            type="text"
            placeholder="e.g., Maharashtra"
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Pincode
          </label>
          <input
            type="text"
            placeholder="e.g., 400001"
            value={formData.pincode}
            onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>
    </div>
  );

  const Step1 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pricing & Availability</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Monthly Rent <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
            <input
              type="number"
              placeholder="0"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter the monthly rent amount</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Security Deposit
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
            <input
              type="number"
              placeholder="0"
              value={formData.depositAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, depositAmount: e.target.value }))}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave blank if not applicable</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Available From <span className="text-red-600">*</span>
        </label>
        <input
          type="date"
          min={today}
          value={formData.availableFrom}
          onChange={(e) => setFormData(prev => ({ ...prev, availableFrom: e.target.value }))}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          House Rules
        </label>
        <textarea
          placeholder="e.g., No parties, Quiet hours after 10 PM..."
          value={formData.houseRules}
          onChange={(e) => setFormData(prev => ({ ...prev, houseRules: e.target.value }))}
          rows="3"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
        />
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Amenities</h3>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">Select Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenityOptions.map(amenity => (
            <button
              key={amenity}
              onClick={() => toggleAmenity(amenity)}
              className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                formData.amenities.includes(amenity)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-300'
                  : 'border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {amenity}
              {formData.amenities.includes(amenity) && <Check className="w-4 h-4 inline ml-1" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Add Custom Amenities</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., Swimming Pool, Gym..."
            value={customAmenityInput}
            onChange={(e) => setCustomAmenityInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddAmenity()}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
          <button
            onClick={handleAddAmenity}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {formData.amenities.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">Selected Amenities</label>
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map(amenity => (
              <span
                key={amenity}
                className="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium flex items-center gap-2"
              >
                {amenity}
                <button
                  onClick={() => toggleAmenity(amenity)}
                  className="hover:text-primary-900"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Images</h3>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
        <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Drag & drop or click to upload</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Max 10 images, JPG/PNG format</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploadingImages}
          className="hidden"
          id="image-input"
        />
        <label
          htmlFor="image-input"
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all cursor-pointer inline-block"
        >
          {uploadingImages ? "Uploading..." : "Select Images"}
        </label>
      </div>

      {/* Image Previews */}
      {formData.images.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Uploaded Images ({formData.images.length}/10)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.images.map((img, idx) => (
              <div
                key={idx}
                className="relative group rounded-lg overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => removeImage(img)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Trash2 className="w-6 h-6 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Review Your Listing</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-1">Title</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{formData.title}</p>
        </div>

        <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-1">Price</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">₹{formData.price?.toLocaleString()}/month</p>
        </div>

        <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-1">Location</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{formData.location}, {formData.city}</p>
        </div>

        <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-1">Room Type</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{formData.roomType}</p>
        </div>

        <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 md:col-span-2">
          <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-1">Description</p>
          <p className="text-gray-700 dark:text-gray-300">{formData.description}</p>
        </div>

        {formData.amenities.length > 0 && (
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 md:col-span-2">
            <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map(a => (
                <span key={a} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {formData.images.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold mb-3">Images ({formData.images.length})</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {formData.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Room ${idx + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const stepComponents = [Step0, Step1, Step2, Step3, Step4];
  const CurrentStep = stepComponents[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New Room</h1>
          <p className="text-gray-600 dark:text-gray-400">Complete the form to list your property</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Step {currentStep + 1} of {steps.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{steps[currentStep].label}</p>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-primary-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          {/* Step Indicators */}
          <div className="flex gap-2 mt-4">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => {
                  if (idx < currentStep || (idx === currentStep)) {
                    setCurrentStep(idx);
                  }
                }}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                  idx < currentStep
                    ? 'bg-green-600 text-white'
                    : idx === currentStep
                    ? 'bg-primary-600 text-white ring-2 ring-primary-300'
                    : 'bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {idx < currentStep ? <Check className="w-5 h-5" /> : step.id + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-700 p-8 mb-8 animate-fade-in">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3 animate-slide-down">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex gap-3 animate-slide-down">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 dark:text-green-300">Room created successfully!</p>
            </div>
          )}

          {/* Form Step */}
          <CurrentStep />
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 animate-fade-in">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="ml-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              {loading ? "Publishing..." : "Publish Room"}
              {!loading && <Check className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddRoomEnhanced;
