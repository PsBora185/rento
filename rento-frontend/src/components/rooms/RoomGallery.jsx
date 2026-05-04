import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const RoomGallery = ({ images = [], title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const defaultImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200';
  const galleryImages = images.length > 0 ? images : [defaultImage];

  // Keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showLightbox) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') setShowLightbox(false);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showLightbox]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <>
      {/* Main Gallery - Single Image with Navigation */}
      <div className="space-y-3 animate-fade-in">
        {/* Main Image */}
        <div
          className="relative h-96 sm:h-[450px] rounded-xl overflow-hidden group cursor-pointer bg-gray-300 shadow-lg"
          onClick={() => setShowLightbox(true)}
        >
          <img
            src={galleryImages[currentIndex]}
            alt={`${title} - ${currentIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => (e.target.src = defaultImage)}
          />

          {/* Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {galleryImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {galleryImages.slice(0, 4).map((img, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative h-20 sm:h-24 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-110 ${
                  index === currentIndex ? 'ring-2 ring-primary-600' : ''
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = defaultImage)}
                />
                {index === 3 && galleryImages.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    +{galleryImages.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-2 rounded-full transition backdrop-blur-sm z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Main Image */}
          <div className="relative flex items-center justify-center max-w-4xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[currentIndex]}
              alt={`${title} - ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => (e.target.src = defaultImage)}
            />

            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute -left-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute -right-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-8 text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full">
            {currentIndex + 1} / {galleryImages.length}
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-4 text-white/60 text-xs text-center pointer-events-none">
            Press <kbd className="bg-white/10 px-2 py-1 rounded text-xs">ESC</kbd> to close
          </div>
        </div>
      )}
    </>
  );
};

export default RoomGallery;