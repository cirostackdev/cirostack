'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  id?: string;
  required?: boolean;
  /** Show password strength conditions */
  showConditions?: boolean;
}

const CONDITIONS = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { label: 'One number', test: (v: string) => /\d/.test(v) },
];

export default function PasswordInput({
  value,
  onChange,
  label = 'Password',
  placeholder = 'Enter password',
  error,
  id = 'password',
  required,
  showConditions = false,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text)]">
          {label}
          {required && <span className="text-[#EF4444] ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="current-password"
          className={cn(
            'w-full h-10 rounded-lg border bg-[var(--color-surface)] text-[var(--color-text)]',
            'px-3 pr-10 text-sm transition-colors duration-150',
            'placeholder:text-[var(--color-text-subtle)]',
            'focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935]',
            error
              ? 'border-[#EF4444] focus:ring-[#EF4444]'
              : 'border-[var(--color-border-2)]'
          )}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error && <p className="text-xs text-[#EF4444]">{error}</p>}

      {showConditions && value.length > 0 && (
        <ul className="mt-1 space-y-1">
          {CONDITIONS.map((c) => (
            <li
              key={c.label}
              className={cn(
                'text-xs flex items-center gap-1.5',
                c.test(value) ? 'text-[#10B981]' : 'text-[var(--color-text-muted)]'
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
              {c.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
