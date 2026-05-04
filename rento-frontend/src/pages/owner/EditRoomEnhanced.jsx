import { useState, useEffect } from "react";
import { roomAPI } from "../../api/room.api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, CheckCircle, Upload, X, Plus, Trash2, ChevronRight, ChevronLeft, Check, Loader as LoaderIcon } from "lucide-react";
import { ROOM_TYPES, FURNISHING_TYPES } from "../../utils/constants";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const EditRoomEnhanced = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const existingRoom = location.state?.room;

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(!existingRoom);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  useEffect(() => {
    if (existingRoom) {
      setFormData(existingRoom);
    } else if (id) {
      fetchRoom();
    }
  }, [id, existingRoom]);

  const fetchRoom = async () => {
    try {
      const data = await roomAPI.getRoomById(id);
      setFormData(data.data || data);
    } catch (err) {
      setError("Failed to load room");
      toast.error("Failed to load room");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setUnsavedChanges(true);
  };

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

    handleFormChange({
      images: [...formData.images, ...urls],
    });

    setUploadingImages(false);
    if (urls.length > 0) toast.success(`${urls.length} image(s) uploaded`);
  };

  const removeImage = (url) => {
    handleFormChange({
      images: formData.images.filter(img => img !== url),
    });
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

    handleFormChange({
      amenities: [...formData.amenities, ...newAmenities],
    });

    setCustomAmenityInput("");
    toast.success(`Added ${newAmenities.length} amenity/ies`);
  };

  const toggleAmenity = (amenity) => {
    handleFormChange({
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter(a => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim() || !formData.city.trim() || !formData.roomType || !formData.furnishingType) {
          setError("Please fill all required fields");
          return false;
        }
        break;
      case 1:
        if (!formData.price || formData.price <= 0 || !formData.availableFrom) {
          setError("Please fill all required fields");
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

  const handleUpdate = async () => {
    if (!validateStep()) return;

    setLoading(true);
    const payload = {
      ...formData,
      price: Number(formData.price),
      depositAmount: Number(formData.depositAmount) || 0,
      available: formData.available === 1 || formData.available === true ? 1 : 0,
    };

    try {
      const res = await roomAPI.updateRoom(id, payload);
      setSuccess(true);
      setUnsavedChanges(false);
      toast.success("✅ Room updated successfully!");
      setTimeout(() => navigate("/owner/my-rooms"), 1500);
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Failed to update room";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await roomAPI.deleteRoom(id);
      toast.success("Room deleted successfully!");
      setTimeout(() => navigate("/owner/my-rooms"), 1000);
    } catch (err) {
      setError("Failed to delete room");
      toast.error("Failed to delete room");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading && !existingRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <LoaderIcon className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading room details...</p>
        </div>
      </div>
    );
  }

  // Step Components (same as AddRoom)
  const Step0 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h3>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Room Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleFormChange({ title: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleFormChange({ description: e.target.value })}
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
            onChange={(e) => handleFormChange({ roomType: e.target.value })}
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
            onChange={(e) => handleFormChange({ furnishingType: e.target.value })}
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
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Location <span className="text-red-600">*</span></label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleFormChange({ location: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">City <span className="text-red-600">*</span></label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleFormChange({ city: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleFormChange({ state: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Pincode</label>
          <input
            type="text"
            value={formData.pincode}
            onChange={(e) => handleFormChange({ pincode: e.target.value })}
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
              value={formData.price}
              onChange={(e) => handleFormChange({ price: e.target.value })}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Security Deposit</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
            <input
              type="number"
              value={formData.depositAmount}
              onChange={(e) => handleFormChange({ depositAmount: e.target.value })}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Available From <span className="text-red-600">*</span></label>
        <input
          type="date"
          min={today}
          value={formData.availableFrom}
          onChange={(e) => handleFormChange({ availableFrom: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">House Rules</label>
        <textarea
          value={formData.houseRules}
          onChange={(e) => handleFormChange({ houseRules: e.target.value })}
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
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Review Your Changes</h3>

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Room</h1>
          <p className="text-gray-600 dark:text-gray-400">Update your property listing</p>
          {unsavedChanges && (
            <div className="mt-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded text-sm">
              ⚠️ You have unsaved changes
            </div>
          )}
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
          <div className="flex gap-2 mt-4">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
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
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3 animate-slide-down">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex gap-3 animate-slide-down">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 dark:text-green-300">Room updated successfully!</p>
            </div>
          )}

          <CurrentStep />
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mb-8 animate-fade-in">
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
              onClick={handleUpdate}
              disabled={loading}
              className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              {loading ? "Updating..." : "Save Changes"}
              {!loading && <Check className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Danger Zone - Delete Room */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-700 dark:text-red-400 mb-4">
            Deleting this room will remove it permanently from your listings and cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
          >
            Delete This Room
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-sm w-full p-6 shadow-xl border border-gray-100 dark:border-neutral-700 animate-scale-in">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Delete Room?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm">
                Are you sure you want to delete this room? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRoomEnhanced;
