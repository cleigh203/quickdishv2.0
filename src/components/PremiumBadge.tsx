import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  className?: string;
  text?: string;
  showIcon?: boolean;
  variant?: 'default' | 'compact';
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  className,
  text = "Premium",
  showIcon = true,
  variant = "default"
}) => {
  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        variant === "compact" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
        "animate-pulse-glow",
        className
      )}
    >
      {showIcon && <Sparkles className={variant === "compact" ? "w-2.5 h-2.5" : "w-3 h-3"} />}
      {text}
    </span>
  );
};
