import React from 'react';

interface RecipeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const RecipeImage = ({ 
  src, 
  alt, 
  className = '',
  width,
  height 
}: RecipeImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      className={`bg-gray-200 ${className}`}
      style={{
        display: 'block',
        width: width || '100%',
        height: height || '100%',
        objectFit: 'cover'
      }}
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
      onError={(e) => {
        e.currentTarget.src = 'https://via.placeholder.com/400x300/10b981/ffffff?text=QuickDish';
      }}
    />
  );
};

