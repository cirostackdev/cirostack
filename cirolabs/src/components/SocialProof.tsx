import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  { value: "12,000+", label: "Students on web" },
  { value: "47", label: "Courses live" },
  { value: "94%", label: "Completion rate" },
];

const testimonials = [
  {
    name: "Tunde Okafor",
    role: "Frontend Dev, Lagos",
    quote:
      "The Prompt Lab feature changed how I think about AI tools. I can actually explain my prompts now.",
  },
  {
    name: "Amara Nwosu",
    role: "UX Designer, Abuja",
    quote:
      "Completed the UI/UX course in 3 weeks. The client brief simulator felt exactly like working with a real client.",
  },
  {
    name: "Emeka Eze",
    role: "Bootcamp grad, Port Harcourt",
    quote:
      "The AI vs Manual split view is genuinely something I've never seen anywhere else.",
  },
];

export default function SocialProof() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Stats */}
        <ScrollReveal>
          <div className="grid grid-cols-3 gap-6 mb-16 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                  {s.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Testimonials */}
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-border pt-3">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust badge */}
        <ScrollReveal>
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Same courses, same AI tutor, now in your pocket.{" "}
              <a
                href="https://cirostack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E53935] hover:underline font-medium"
              >
                Built by CiroStack →
              </a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
