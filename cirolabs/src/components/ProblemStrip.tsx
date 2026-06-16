import ScrollReveal from "@/components/ScrollReveal";

const problems = [
  { bad: "Tutorial hell", good: "Structured paths with real projects" },
  { bad: "No career outcome", good: "Talent pipeline to CiroStack agency" },
  { bad: "AI as a crutch", good: "AI as a collaborator (AI vs Manual)" },
];

export default function ProblemStrip() {
  return (
    <section className="py-16 md:py-20 border-y border-border">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <ScrollReveal>
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            Not another tutorial app
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <ScrollReveal key={p.bad} delay={i * 0.1}>
              <div className="text-center">
                <p className="text-muted-foreground line-through text-sm mb-2">
                  {p.bad}
                </p>
                <p className="text-foreground font-medium text-sm">{p.good}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
