import ScrollReveal from "@/components/ScrollReveal";
import WaitlistForm from "@/components/WaitlistForm";

export default function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
        <ScrollReveal>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-[#E53935] to-[#7C3AED] bg-clip-text text-transparent">
              build
            </span>
            ?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join the waitlist. Be first to get the app when it launches.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <WaitlistForm variant="light" />
        </ScrollReveal>

        {/* App store badges (greyed) */}
        <ScrollReveal delay={0.2}>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="relative">
              <div className="h-10 w-[135px] bg-muted rounded-lg flex items-center justify-center border border-border">
                <span className="text-[10px] text-muted-foreground font-medium">
                  App Store — Coming soon
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="h-10 w-[135px] bg-muted rounded-lg flex items-center justify-center border border-border">
                <span className="text-[10px] text-muted-foreground font-medium">
                  Google Play — Coming soon
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
