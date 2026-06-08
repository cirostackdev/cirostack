"use client";

interface Props {
  id: string;
  value: boolean;
  onLabel: string;
  offLabel: string;
  onClass: string;
  offClass: string;
  onChange: (id: string, newValue: boolean) => void;
  saving?: boolean;
  className?: string;
}

export function CmsBooleanToggle({
  id, value, onLabel, offLabel, onClass, offClass, onChange, saving, className,
}: Props) {
  return (
    <button
      onClick={() => !saving && onChange(id, !value)}
      disabled={saving}
      title={`Click to mark as ${value ? offLabel : onLabel}`}
      className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:opacity-75 transition-opacity disabled:opacity-40 ${
        value ? onClass : offClass
      }${className ? ` ${className}` : ""}`}
    >
      {value ? onLabel : offLabel}
    </button>
  );
}
