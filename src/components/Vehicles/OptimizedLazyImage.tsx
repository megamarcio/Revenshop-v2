
import React from 'react';
import ProgressiveImage from './ProgressiveImage';

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
  // Usar o componente ProgressiveImage otimizado para cards de veículos
  return (
    <ProgressiveImage
      vehicleId={vehicleId}
      alt={alt}
      className={className}
      placeholder={placeholder}
      showZoom={showZoom}
      autoLoadMedium={true}
      threshold={0.2} // Carrega quando 20% da imagem está visível
      rootMargin="150px" // Começa a carregar 150px antes de ficar visível
    />
  );
};

export default OptimizedLazyImage;
