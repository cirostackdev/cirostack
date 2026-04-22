'use client';

import { useToastStore } from '@/lib/store/useToastStore';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]',
  error: 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]',
  warning: 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]',
  info: 'border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6]',
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md',
              'bg-[var(--color-surface)] animate-fade-in shadow-lg',
              'border-[var(--color-border)]'
            )}
          >
            <Icon
              className={cn('h-5 w-5 shrink-0 mt-0.5', toastStyles[t.type].split(' ')[2])}
            />
            <p className="text-sm text-[var(--color-text)] flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
