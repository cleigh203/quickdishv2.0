import { Loader2 } from "lucide-react";

interface InstacartButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  children?: React.ReactNode;
}

const InstacartCarrotIcon = ({
  width,
  height,
  className = '',
}: {
  width: number;
  height: number;
  className?: string;
}) => (
  <svg
    viewBox="0 0 42.3 52.9"
    width={width}
    height={height}
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M36.4,8.6c-2.3,0-4,1-5.5,3.2l-4.4,6.4V0H15.9v18.2l-4.4-6.4C9.9,9.6,8.2,8.6,5.9,8.6C2.4,8.6,0,11.2,0,14.4c0,2.7,1.3,4.5,4,6.3l17.1,11l17.1-11c2.7-1.8,4-3.5,4-6.3C42.3,11.2,39.9,8.6,36.4,8.6z"
      fill="#0AAD0A"
    />
    <path
      d="M21.1,34.4c10.2,0,18.5,7.6,18.5,18.5h-37C2.6,42,11,34.4,21.1,34.4z"
      fill="#FF7009"
    />
  </svg>
);

export const InstacartButton = ({
  onClick,
  loading = false,
  disabled = false,
  className = '',
  size = 'md',
  ariaLabel,
  children,
}: InstacartButtonProps) => {
  const sizeClasses = size === 'sm'
    ? 'h-10 px-4 text-sm'
    : size === 'lg'
      ? 'h-14 px-6 text-lg'
      : 'h-12 px-5 text-base';

  const iconDims = size === 'sm' ? { w: 20, h: 25 } : size === 'lg' ? { w: 28, h: 35 } : { w: 24, h: 30 };
  const label = ariaLabel || (typeof children === 'string' ? `${children} on Instacart` : 'Get ingredients on Instacart');

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={label}
      className={`
        inline-flex items-center justify-center gap-3
        rounded-xl font-semibold ${sizeClasses}
        bg-[#003D29] text-white shadow-md
        transition-all duration-150
        hover:brightness-105 active:brightness-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0AAD0A]
        disabled:opacity-50 disabled:cursor-not-allowed
        transform hover:scale-[1.02] active:scale-[0.99]
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <InstacartCarrotIcon width={iconDims.w} height={iconDims.h} className="flex-shrink-0" />
          <span>{children || 'Get Ingredients'}</span>
        </>
      )}
    </button>
  );
};

