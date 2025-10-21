import React from 'react';

interface InstacartAttributionProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InstacartAttribution: React.FC<InstacartAttributionProps> = ({
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`inline-flex items-center gap-1 text-green-600 ${sizeClasses[size]} ${className}`}>
      <span>Powered by</span>
      <span className="font-semibold">Instacart</span>
    </div>
  );
};
