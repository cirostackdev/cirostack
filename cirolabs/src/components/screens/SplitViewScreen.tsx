export default function SplitViewScreen() {
  return (
    <div className="h-full bg-[#0D1117] p-3 text-white font-mono text-[9px]">
      {/* Tab bar */}
      <div className="flex gap-1 mb-3">
        <div className="px-2 py-1 rounded bg-[#7C3AED]/20 text-[#A78BFA] text-[9px] font-sans font-medium">
          AI Approach
        </div>
        <div className="px-2 py-1 rounded bg-[#E53935]/20 text-[#EF5350] text-[9px] font-sans font-medium">
          Manual
        </div>
      </div>

      {/* Code panel - AI */}
      <div className="bg-[#161B22] rounded-lg p-2 mb-2 border border-[#1E2A45]/50">
        <p className="text-[#7C3AED]/60 text-[8px] mb-1">{"// AI-generated"}</p>
        <p><span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">data</span> = <span className="text-[#FF7B72]">await</span> fetch(url)</p>
        <p><span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">parsed</span> = <span className="text-[#FF7B72]">await</span> data.json()</p>
        <p><span className="text-[#FF7B72]">return</span> parsed.filter(validItem)</p>
      </div>

      {/* Code panel - Manual */}
      <div className="bg-[#161B22] rounded-lg p-2 border border-[#1E2A45]/50">
        <p className="text-[#E53935]/60 text-[8px] mb-1">{"// Manual approach"}</p>
        <p><span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">xhr</span> = <span className="text-[#FF7B72]">new</span> XMLHttpRequest()</p>
        <p>xhr.open(<span className="text-[#A5D6FF]">&quot;GET&quot;</span>, url)</p>
        <p>xhr.onload = <span className="text-[#FF7B72]">function</span>() {"{"}</p>
        <p>  <span className="text-[#FF7B72]">const</span> d = JSON.parse(xhr...)</p>
        <p>  <span className="text-[#8B949E]">{"// manual validation..."}</span></p>
        <p>{"}"}</p>
      </div>

      {/* Bottom label */}
      <div className="mt-2 text-center">
        <p className="text-white/40 text-[8px] font-sans">See both approaches side by side</p>
      </div>
    </div>
  );
}
