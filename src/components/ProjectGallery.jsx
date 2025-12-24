import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  Grid,
  List,
  Play,
  Pause,
  Image as ImageIcon,
  MoveLeft,
  MoveRight
} from 'lucide-react';
import './ProductGallery.css';

const ProjectGallery = ({ images, projectTitle, featuredImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' or 'grid'
  const [fullscreen, setFullscreen] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const galleryRef = useRef(null);
  const lightboxRef = useRef(null);

  // Combine featured image with other images
  const allImages = [
    ...(featuredImage ? [{ id: 'featured', image: featuredImage, caption: 'Featured Image' }] : []),
    ...(images || [])
  ];

  // Auto-play slideshow
  useEffect(() => {
    let interval;
    if (isPlaying && lightboxOpen) {
      interval = setInterval(() => {
        handleNext();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, lightboxOpen, currentIndex]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          closeLightbox();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoomLevel(prev => Math.min(prev + 0.25, 3));
          break;
        case '-':
          e.preventDefault();
          setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, isPlaying]);

  // Close lightbox on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (lightboxRef.current && !lightboxRef.current.contains(e.target) && lightboxOpen) {
        closeLightbox();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [lightboxOpen]);

  // Handle drag for slider
  const handleDragStart = (e) => {
    setDragStartX(e.clientX || e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    
    const dragEndX = e.clientX || e.changedTouches[0].clientX;
    const dragDistance = dragStartX - dragEndX;
    
    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
    
    setIsDragging(false);
  };

  const openLightbox = (index) => {
    setSelectedImage(allImages[index]);
    setCurrentIndex(index);
    setLightboxOpen(true);
    setZoomLevel(1);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    setZoomLevel(1);
    setIsPlaying(false);
    document.body.style.overflow = 'auto';
    if (fullscreen) {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % allImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(allImages[nextIndex]);
    setZoomLevel(1);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(allImages[prevIndex]);
    setZoomLevel(1);
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      document.documentElement.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  // const downloadImage = () => {
  //   if (!selectedImage) return;
    
  //   const link = document.createElement('a');
  //   link.href = selectedImage.image;
  //   link.download = `${projectTitle?.replace(/\s+/g, '_') || 'image'}_${currentIndex + 1}.jpg`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleZoom = (type) => {
    if (type === 'in') {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    } else {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = 300;
      galleryRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (allImages.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          No Images Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Screenshots and media for this project will be added soon
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Project Gallery
          </h2>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              {allImages.length} image{allImages.length !== 1 ? 's' : ''}
            </span>
            <span className="text-gray-400">•</span>
            <span>Click to view fullscreen</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
            View:
          </div>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('slider')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'slider'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
              title="Slider View"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
              title="Grid View"
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider View (Default) */}
      {viewMode === 'slider' ? (
        <div className="relative group">
          {/* Scroll buttons */}
          {allImages.length > 3 && (
            <>
              <button
                onClick={() => scrollGallery('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                title="Scroll left"
              >
                <MoveLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollGallery('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                title="Scroll right"
              >
                <MoveRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Horizontal Image Slider */}
          <div 
            ref={galleryRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            {allImages.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-64 md:w-72 lg:w-80 group cursor-pointer"
              >
                <div 
                  className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={img.image}
                    alt={img.caption || `Project screenshot ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium text-sm">
                        {img.caption || `Screenshot ${index + 1}`}
                      </p>
                      {index === 0 && img.id === 'featured' && (
                        <span className="inline-block mt-2 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* View button */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-colors">
                      <Maximize2 className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Index badge */}
                  <div className="absolute top-3 left-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Scroll indicator */}
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: Math.min(allImages.length, 5) }).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === 0 ? 'bg-blue-600 dark:bg-blue-400 w-6' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allImages.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl"
              onClick={() => openLightbox(index)}
            >
              <img
                src={img.image}
                alt={img.caption || `Project screenshot ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium truncate">
                    {img.caption || `Screenshot ${index + 1}`}
                  </p>
                  {index === 0 && img.id === 'featured' && (
                    <span className="inline-block mt-1 px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              {/* View icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <Maximize2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <div 
              ref={lightboxRef}
              className="relative w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Navigation buttons */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-7 h-7 text-white" />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-7 h-7 text-white" />
              </button>

              {/* Image container */}
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: zoomLevel }}
                  exit={{ scale: 0.9 }}
                  className="relative max-w-7xl max-h-[85vh]"
                >
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.caption || 'Project image'}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg select-none"
                    draggable={false}
                  />
                  
                  {/* Image caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                    <p className="text-white text-lg font-medium text-center">
                      {selectedImage.caption}
                    </p>
                    <p className="text-gray-300 text-sm text-center mt-1">
                      {currentIndex + 1} of {allImages.length}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Controls toolbar */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                {/* Play/Pause */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-3 rounded-full transition-all duration-200 hover:bg-white/20 ${isPlaying ? 'text-blue-400' : 'text-white'}`}
                  title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                <div className="w-px h-6 bg-white/30"></div>

                {/* Zoom controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleZoom('out')}
                    className="p-3 rounded-full hover:bg-white/20 transition-colors"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-5 h-5 text-white" />
                  </button>
                  
                  <button
                    onClick={resetZoom}
                    className="px-4 py-2 text-sm text-white bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                  
                  <button
                    onClick={() => handleZoom('in')}
                    className="p-3 rounded-full hover:bg-white/20 transition-colors"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="w-px h-6 bg-white/30"></div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-3 rounded-full hover:bg-white/20 transition-colors"
                  title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {fullscreen ? (
                    <Minimize2 className="w-5 h-5 text-white" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* <div className="w-px h-6 bg-white/30"></div> */}

                {/* Download
                <button
                  onClick={downloadImage}
                  className="p-3 rounded-full hover:bg-white/20 transition-colors"
                  title="Download image"
                >
                  <Download className="w-5 h-5 text-white" />
                </button> */}
              </div>

              {/* Thumbnail strip */}
              <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto p-2 scrollbar-hide">
                {allImages.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setCurrentIndex(index);
                      setSelectedImage(img);
                      setZoomLevel(1);
                    }}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentIndex
                        ? 'border-blue-500 scale-110 ring-2 ring-blue-500/30'
                        : 'border-transparent hover:border-white/50 hover:scale-105'
                    }`}
                  >
                    <img
                      src={img.image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && img.id === 'featured' && (
                      <div className="absolute top-1 left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Counter */}
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
                <span className="text-white text-sm font-medium">
                  {currentIndex + 1} / {allImages.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectGallery;