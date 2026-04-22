import { cn } from '@/lib/utils';
import type { CourseLevel } from '@/types';

const config: Record<CourseLevel, { label: string; className: string }> = {
  beginner: {
    label: 'Beginner',
    className: 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20',
  },
  intermediate: {
    label: 'Intermediate',
    className: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20',
  },
  advanced: {
    label: 'Advanced',
    className: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20',
  },
};

export default function LevelBadge({
  level,
  className,
}: {
  level: CourseLevel;
  className?: string;
}) {
  const { label, className: styles } = config[level];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        styles,
        className
      )}
    >
      {label}
    </span>
  );
}
