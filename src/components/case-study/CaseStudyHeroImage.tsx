"use client";

import { motion } from "framer-motion";

interface CaseStudyHeroImageProps {
  image: string;
  title: string;
}

const CaseStudyHeroImage = ({ image, title }: CaseStudyHeroImageProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    className="relative rounded-2xl overflow-hidden aspect-video mb-10 glow-border"
  >
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
  </motion.div>
);

export default CaseStudyHeroImage;
