export default function DashboardScreen() {
  return (
    <div className="h-full bg-[#0A0E1A] p-4 text-white font-sans text-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/50 text-[10px]">Good morning</p>
          <p className="font-semibold text-sm">Tunde O.</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#E53935] to-[#7C3AED]" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#0F1629] rounded-xl p-2 text-center border border-[#1E2A45]/50">
          <p className="text-[#10B981] font-bold text-sm">2,450</p>
          <p className="text-white/50 text-[9px]">XP</p>
        </div>
        <div className="bg-[#0F1629] rounded-xl p-2 text-center border border-[#1E2A45]/50">
          <p className="text-[#F59E0B] font-bold text-sm">12</p>
          <p className="text-white/50 text-[9px]">Day streak</p>
        </div>
        <div className="bg-[#0F1629] rounded-xl p-2 text-center border border-[#1E2A45]/50">
          <p className="text-[#7C3AED] font-bold text-sm">Lv 5</p>
          <p className="text-white/50 text-[9px]">Level</p>
        </div>
      </div>

      {/* Continue learning */}
      <p className="text-white/70 font-medium mb-2 text-[11px]">Continue learning</p>
      <div className="bg-[#0F1629] rounded-xl p-3 border border-[#1E2A45]/50 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">⚡</span>
          <p className="font-medium text-[11px]">AI-Assisted Frontend Dev</p>
        </div>
        <div className="w-full h-1.5 bg-[#1E2A45] rounded-full overflow-hidden">
          <div className="h-full w-[65%] bg-gradient-to-r from-[#E53935] to-[#7C3AED] rounded-full" />
        </div>
        <p className="text-white/50 text-[9px] mt-1">Lesson 12 of 18</p>
      </div>

      {/* Course cards */}
      <div className="bg-[#0F1629] rounded-xl p-3 border border-[#1E2A45]/50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">🎨</span>
          <p className="font-medium text-[11px]">Figma to Code with AI</p>
        </div>
        <div className="w-full h-1.5 bg-[#1E2A45] rounded-full overflow-hidden">
          <div className="h-full w-[30%] bg-gradient-to-r from-[#E53935] to-[#7C3AED] rounded-full" />
        </div>
        <p className="text-white/50 text-[9px] mt-1">Lesson 5 of 16</p>
      </div>
    </div>
  );
}
