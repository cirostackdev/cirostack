"use client";

import { cn } from "@/lib/utils";
import PhoneMockup from "@/components/PhoneMockup";
import ScrollReveal from "@/components/ScrollReveal";

interface FeatureSectionProps {
  title: string;
  description: string;
  benefit: string;
  phoneContent: React.ReactNode;
  reversed?: boolean;
  alt?: boolean;
  id?: string;
}

export default function FeatureSection({
  title,
  description,
  benefit,
  phoneContent,
  reversed = false,
  alt = false,
  id,
}: FeatureSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "min-h-screen flex items-center py-20 md:py-28 lg:py-32",
        alt && "bg-[#F5EFE7] dark:bg-[#0D1220]"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 w-full">
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center",
            reversed && "lg:[direction:rtl]"
          )}
        >
          {/* Text */}
          <ScrollReveal
            direction={reversed ? "right" : "left"}
            className={cn(reversed && "lg:[direction:ltr]")}
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-6">
              {description}
            </p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#10B981]" />
              <p className="text-sm font-medium text-foreground">{benefit}</p>
            </div>
          </ScrollReveal>

          {/* Phone */}
          <ScrollReveal
            direction={reversed ? "left" : "right"}
            delay={0.15}
            className={cn("flex justify-center", reversed && "lg:[direction:ltr]")}
          >
            <PhoneMockup>{phoneContent}</PhoneMockup>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
