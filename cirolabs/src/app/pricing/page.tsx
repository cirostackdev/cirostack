import type { Metadata } from "next";
import PricingCard from "@/components/PricingCard";
import WaitlistForm from "@/components/WaitlistForm";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Pricing",
  description: "CiroLabs pricing — free preview, per-course, or all-access subscription.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Preview any course's first lesson.",
    features: [
      "Download the app free",
      "Browse full course catalog",
      "Preview first lesson of any course",
      "Community access",
    ],
  },
  {
    name: "Per Course",
    price: "From $15",
    description: "Own it forever.",
    features: [
      "Full course access",
      "AI Tutor (Cipher)",
      "Steal the Prompt library",
      "Certificate on completion",
      "Ship It capstone",
    ],
  },
  {
    name: "All-Access",
    price: "$9",
    period: "/mo",
    description: "Every course, always.",
    features: [
      "Every course included",
      "New courses on release day",
      "Full AI Tutor access",
      "Priority talent pipeline",
      "Ship It capstone reviews",
      "Cancel anytime",
    ],
    highlighted: true,
    badge: "Best value",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Simple pricing
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start free. Pay when you&apos;re ready to go deeper.
            </p>
          </div>
        </ScrollReveal>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <PricingCard {...plan} />
            </ScrollReveal>
          ))}
        </div>

        {/* Waitlist CTA */}
        <ScrollReveal>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Prices lock for early access members.
            </p>
            <div className="flex justify-center">
              <WaitlistForm variant="light" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
