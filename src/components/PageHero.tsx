"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";

interface PageHeroProps {
  badge?: string;
  title: string;
  highlight?: string;
  description: string;
  image: string;
  icon?: LucideIcon;
  ctaText?: string;
  ctaLink?: string;
  /** @deprecated hero has a single CTA only */
  secondaryCtaText?: string;
  /** @deprecated hero has a single CTA only */
  secondaryCtaLink?: string;
  fullHeight?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const PageHero = ({
  badge,
  title,
  highlight,
  description,
  image,
  icon: Icon,
  ctaText = "Contact Us",
  ctaLink = "/contact",
}: PageHeroProps) => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden -mt-16 md:-mt-20 h-[calc(100dvh+4rem)] md:h-[calc(100dvh+5rem)]">
      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          {Icon && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center mb-8">
                <Icon className="w-9 h-9 text-white" />
              </div>
            </motion.div>
          )}
          {badge && !Icon && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-block px-4 py-1.5 mb-6 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-full bg-white/10 text-white/90 border border-white/15 backdrop-blur-sm">
                {badge}
              </span>
            </motion.div>
          )}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] mb-6"
          >
            {title}{" "}
            {highlight && <span className="text-gradient">{highlight}</span>}
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-base md:text-lg lg:text-xl text-white/60 mb-8 max-w-xl leading-relaxed tracking-wide font-light"
          >
            {description}
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Link href={ctaLink}>
              <Button size="lg" className="text-base px-10 rounded-full">
                {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
