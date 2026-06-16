"use client";

import { motion } from "framer-motion";
import PhoneMockup from "@/components/PhoneMockup";
import WaitlistForm from "@/components/WaitlistForm";
import DashboardScreen from "@/components/screens/DashboardScreen";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0A0E1A] overflow-hidden pt-16">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#E53935]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#7C3AED]/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 md:px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Learn to build.{" "}
              <span className="bg-gradient-to-r from-[#E53935] to-[#7C3AED] bg-clip-text text-transparent">
                Ship with AI.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-white/60 text-base lg:text-lg max-w-lg mb-10 leading-relaxed"
            >
              The mobile learning app by CiroStack. Real dev skills, AI-powered
              workflows, a direct path into the industry.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              id="waitlist"
            >
              <WaitlistForm variant="dark" />
            </motion.div>
          </div>

          {/* Right — Phone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <PhoneMockup>
                <DashboardScreen />
              </PhoneMockup>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
