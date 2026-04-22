"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const HeroSlider = () => {

  return (
    <section className="relative overflow-hidden -mt-16 md:-mt-20 h-[calc(100dvh+4rem)] md:h-[calc(100dvh+5rem)]">
      {/* Single background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
      </div>

      {/* Content — left-aligned, vertically centered */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-6 h-0.5 bg-primary" />
              <span className="text-primary text-[11px] font-semibold uppercase tracking-[0.25em]">
                Who We Are
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white leading-[1.05] mb-6"
            >
              Driven by Tech,
              <br />
              <span className="text-gradient">Empowered by People</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="text-base md:text-lg lg:text-xl text-white/60 mb-8 max-w-xl leading-relaxed tracking-wide font-light"
            >
              We are a remote-first software agency that ramps up engineering capacity to accelerate
              digital transformations, product launches, and business growth at scale.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link href="/about">
                <Button size="lg" className="rounded-full text-base px-8 group">
                  Discover our story
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="rounded-full text-base px-8 border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Book a demo
                </Button>
              </Link>
            </motion.div>

            {/* Stat pill */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <span className="text-primary font-display font-bold text-xl">50+</span>
              <span className="text-white/50 text-sm tracking-wide font-light">Projects Delivered</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
