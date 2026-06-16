export default function ShipItScreen() {
  return (
    <div className="h-full bg-[#0A0E1A] p-3 text-white font-sans text-[10px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-5 rounded bg-[#10B981]/20 flex items-center justify-center">
          <span className="text-[#10B981] text-[10px]">🚀</span>
        </div>
        <p className="font-medium text-[11px]">Ship It — Capstone</p>
      </div>

      {/* Project card */}
      <div className="bg-[#0F1629] rounded-xl p-3 border border-[#1E2A45]/50 mb-3">
        <p className="font-medium text-[11px] mb-1">AI Task Manager</p>
        <p className="text-white/50 text-[9px] mb-2">Next.js + OpenAI + PostgreSQL</p>
        <div className="flex gap-1.5 mb-2">
          <span className="px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] text-[8px]">Deployed</span>
          <span className="px-1.5 py-0.5 rounded bg-[#7C3AED]/10 text-[#A78BFA] text-[8px]">Under Review</span>
        </div>
        <div className="w-full h-1.5 bg-[#1E2A45] rounded-full overflow-hidden">
          <div className="h-full w-full bg-[#10B981] rounded-full" />
        </div>
      </div>

      {/* Review feedback */}
      <div className="bg-[#0F1629] rounded-xl p-3 border border-[#10B981]/30 mb-3">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[8px]">⭐</span>
          <p className="text-[9px] text-[#10B981] font-medium">Instructor Feedback</p>
        </div>
        <p className="text-white/70 text-[9px] leading-relaxed">
          &quot;Solid architecture. Clean API routes. Consider adding rate limiting to the OpenAI endpoint.&quot;
        </p>
      </div>

      {/* Talent pipeline badge */}
      <div className="bg-gradient-to-r from-[#E53935]/10 to-[#7C3AED]/10 rounded-xl p-3 border border-[#E53935]/20 text-center">
        <p className="text-[9px] font-medium text-white/90">🎯 Flagged for Talent Pipeline</p>
        <p className="text-[8px] text-white/50 mt-0.5">CiroStack may reach out for a project</p>
      </div>
    </div>
  );
}
