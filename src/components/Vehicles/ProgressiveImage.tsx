
import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Loader2, ZoomIn } from 'lucide-react';
import { useProgressiveImage } from '../../hooks/useProgressiveImage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ProgressiveImageProps {
  vehicleId?: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  showZoom?: boolean;
  autoLoadMedium?: boolean;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ 
  vehicleId, 
  alt, 
  className = '', 
  placeholder, 
  showZoom = false,
  autoLoadMedium = false
}) => {
  const [isInView, setIsInView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [hasLoadedMedium, setHasLoadedMedium] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { urls, currentUrl, loading, loadNextQuality } = useProgressiveImage(
    isInView ? vehicleId || null : null
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('Vehicle', vehicleId, 'is now visible, loading progressive photo...');
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [vehicleId]);

  // Auto-load medium quality when image is in view and autoLoadMedium is true
  useEffect(() => {
    if (isInView && autoLoadMedium && imageLoaded && !hasLoadedMedium && urls?.medium) {
      setTimeout(() => {
        loadNextQuality();
        setHasLoadedMedium(true);
      }, 500);
    }
  }, [isInView, autoLoadMedium, imageLoaded, hasLoadedMedium, urls, loadNextQuality]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    
    // Auto-advance from micro to small after a short delay
    if (currentUrl === urls?.micro) {
      setTimeout(() => {
        loadNextQuality();
      }, 200);
    }
  };

  const handleImageError = () => {
    setImageLoaded(true);
  };

  const shouldShowPlaceholder = !isInView || loading || !currentUrl || !imageLoaded;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {shouldShowPlaceholder && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          {placeholder || (
            <div className="text-center">
              {!isInView ? (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Carregando...</p>
                </>
              ) : loading ? (
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin mx-auto" />
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Sem foto</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
      
      {currentUrl && isInView && (
        <>
          <img
            src={currentUrl}
            alt={alt}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${currentUrl === urls?.micro ? 'filter blur-sm' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
          
          {/* Botão de zoom */}
          {showZoom && imageLoaded && urls?.original && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 left-2 h-8 w-8 p-0 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setShowFullImage(true)}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full">
                <div className="relative w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
                  {showFullImage && (
                    <img
                      src={urls.original}
                      alt={`${alt} - Visualização completa`}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {/* Indicador de qualidade */}
          {imageLoaded && currentUrl !== urls?.original && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {currentUrl === urls?.micro ? 'Baixa' : 
               currentUrl === urls?.small ? 'Média' : 'Alta'}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressiveImage;
