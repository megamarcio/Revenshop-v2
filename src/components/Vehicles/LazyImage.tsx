
import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface LazyImageProps {
  src?: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', placeholder }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const showPlaceholder = !src || !isInView || !isLoaded || hasError;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {showPlaceholder && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          {placeholder || (
            <div className="text-center">
              {!isInView ? (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Carregando...</p>
                </>
              ) : !isLoaded && !hasError ? (
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
      
      {src && isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
