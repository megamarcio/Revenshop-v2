
import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Loader2, ZoomIn } from 'lucide-react';
import { useVehiclePhotoThumbnail } from '../../hooks/useVehiclePhotoThumbnail';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface OptimizedLazyImageProps {
  vehicleId?: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  showZoom?: boolean;
}

const OptimizedLazyImage: React.FC<OptimizedLazyImageProps> = ({ 
  vehicleId, 
  alt, 
  className = '', 
  placeholder, 
  showZoom = false 
}) => {
  const [isInView, setIsInView] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [fullImageLoaded, setFullImageLoaded] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Só buscar foto quando estiver visível
  const { thumbnailUrl, fullPhotoUrl, loading: photoLoading } = useVehiclePhotoThumbnail(
    isInView ? vehicleId || null : null
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('Vehicle', vehicleId, 'is now visible, loading optimized thumbnail...');
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

  const handleThumbnailLoad = () => {
    setThumbnailLoaded(true);
  };

  const handleThumbnailError = () => {
    setThumbnailError(true);
    setThumbnailLoaded(true);
  };

  const handleFullImageLoad = () => {
    setFullImageLoaded(true);
  };

  const shouldShowPlaceholder = !isInView || photoLoading || !thumbnailUrl || !thumbnailLoaded || thumbnailError;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {shouldShowPlaceholder && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          {placeholder || (
            <div className="text-center">
              {!isInView ? (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Carregando...</p>
                </>
              ) : photoLoading ? (
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
      
      {thumbnailUrl && isInView && (
        <>
          <img
            src={thumbnailUrl}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              thumbnailLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleThumbnailLoad}
            onError={handleThumbnailError}
            loading="lazy"
          />
          
          {/* Botão de zoom */}
          {showZoom && thumbnailLoaded && !thumbnailError && fullPhotoUrl && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 left-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  onClick={() => setShowFullImage(true)}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full">
                <div className="relative w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
                  {showFullImage && fullPhotoUrl && (
                    <>
                      {!fullImageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <p className="ml-2 text-sm text-gray-600">Carregando foto em alta qualidade...</p>
                        </div>
                      )}
                      <img
                        src={fullPhotoUrl}
                        alt={`${alt} - Visualização completa`}
                        className={`w-full h-full object-contain transition-opacity duration-300 ${
                          fullImageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={handleFullImageLoad}
                      />
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};

export default OptimizedLazyImage;
