export default function PromptLabScreen() {
  return (
    <div className="h-full bg-[#0A0E1A] p-3 text-white font-sans text-[10px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-5 rounded bg-[#7C3AED]/20 flex items-center justify-center">
          <span className="text-[#A78BFA] text-[10px]">P</span>
        </div>
        <p className="font-medium text-[11px]">Prompt Lab</p>
      </div>

      {/* Prompt card */}
      <div className="bg-[#0F1629] rounded-xl p-3 border border-[#7C3AED]/30 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] text-[#A78BFA] font-medium">Instructor Prompt</span>
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#7C3AED]/20 text-[#A78BFA]">Copy</span>
        </div>
        <p className="text-white/80 leading-relaxed text-[9px]">
          &quot;Create a responsive nav component using Tailwind. Include mobile hamburger menu with framer-motion animation. Use semantic HTML. Accessible.&quot;
        </p>
      </div>

      {/* Output */}
      <div className="bg-[#0F1629] rounded-xl p-3 border border-[#1E2A45]/50 mb-3">
        <p className="text-[9px] text-white/50 mb-1">AI Output Preview</p>
        <div className="h-16 bg-[#161B22] rounded-lg flex items-center justify-center">
          <p className="text-[8px] text-white/30">Generated component...</p>
        </div>
      </div>

      {/* Save to library button */}
      <div className="bg-[#7C3AED] rounded-lg py-2 text-center">
        <p className="text-white font-medium text-[10px]">Save to My Library</p>
      </div>
    </div>
  );
}
