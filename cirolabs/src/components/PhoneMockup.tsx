import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
}

export default function PhoneMockup({ children, className, glowing = true }: PhoneMockupProps) {
  return (
    <div className={cn("relative mx-auto", className)}>
      {/* Glow effect */}
      {glowing && (
        <div className="absolute inset-0 -m-4 rounded-[3rem] blur-3xl opacity-40 pointer-events-none bg-gradient-to-br from-[#E53935]/20 to-[#7C3AED]/20" />
      )}

      {/* Phone frame */}
      <div className="relative w-[280px] h-[580px] rounded-[2.5rem] border-[6px] border-[#1a1a2e] bg-[#0A0E1A] shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#1a1a2e] rounded-b-2xl z-10" />

        {/* Screen content */}
        <div className="relative w-full h-full overflow-hidden pt-7">
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/20 rounded-full" />
      </div>
    </div>
  );
}
