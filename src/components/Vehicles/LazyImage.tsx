
import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { useVehiclePhoto } from '../../hooks/useVehiclePhoto';

interface LazyImageProps {
  vehicleId?: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
}

const LazyImage: React.FC<LazyImageProps> = ({ vehicleId, alt, className = '', placeholder }) => {
  const [isInView, setIsInView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Só buscar foto quando estiver visível
  const { photoUrl, loading: photoLoading } = useVehiclePhoto(isInView ? vehicleId || null : null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('Vehicle', vehicleId, 'is now visible, loading photo...');
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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const shouldShowPlaceholder = !isInView || photoLoading || !photoUrl || !imageLoaded || imageError;

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
      
      {photoUrl && isInView && (
        <img
          src={photoUrl}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
