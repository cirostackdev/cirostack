import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md';
  color?: 'brand' | 'success' | 'warning' | 'ai';
  className?: string;
}

const colorStyles = {
  brand: 'bg-[#E53935]',
  success: 'bg-[#10B981]',
  warning: 'bg-[#F59E0B]',
  ai: 'bg-[#7C3AED]',
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  size = 'md',
  color = 'success',
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
          )}
          {showPercent && (
            <span className="text-xs font-medium text-[var(--color-text)]">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-[var(--color-border)]',
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            'rounded-full transition-all duration-500',
            colorStyles[color],
            sizeStyles[size]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
