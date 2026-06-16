import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import ProblemStrip from "@/components/ProblemStrip";
import FeatureSection from "@/components/FeatureSection";
import SocialProof from "@/components/SocialProof";
import FinalCTA from "@/components/FinalCTA";
import SplitViewScreen from "@/components/screens/SplitViewScreen";
import PromptLabScreen from "@/components/screens/PromptLabScreen";
import CipherScreen from "@/components/screens/CipherScreen";
import ShipItScreen from "@/components/screens/ShipItScreen";

export const metadata: Metadata = {
  title: "CiroLabs — Learn to Build with AI | Mobile App",
  description:
    "The mobile learning app by CiroStack. Real dev skills, AI-powered workflows, and a direct path into the industry. Join the waitlist.",
};

export default function CiroLabsLandingPage() {
  return (
    <>
      <HeroSection />

      <ProblemStrip />

      <FeatureSection
        id="features"
        title="See both sides of the code"
        description="Every coding lesson shows you the AI-assisted approach and the manual approach side by side. Understand what AI does well, and what you still need to know."
        benefit="Build real understanding, not copy-paste dependence"
        phoneContent={<SplitViewScreen />}
      />

      <FeatureSection
        title="Steal the instructor's prompts"
        description="Every lesson ships with the exact prompts the instructor used to build it. Copy them, tweak them, save them to your personal library."
        benefit="Learn prompting by seeing what experts actually type"
        phoneContent={<PromptLabScreen />}
        reversed
        alt
      />

      <FeatureSection
        title="An AI tutor that knows where you are"
        description="Stuck? Ask Cipher. It knows which lesson you're on, what you've covered, and what's coming next. Context-aware answers, not generic ChatGPT."
        benefit="Get unstuck in seconds without leaving the lesson"
        phoneContent={<CipherScreen />}
      />

      <FeatureSection
        title="Build real projects. Get hired."
        description="Every track ends with a Ship It capstone: build and deploy a real project, get instructor review, and top graduates enter the CiroStack talent pipeline."
        benefit="Your learning leads somewhere real"
        phoneContent={<ShipItScreen />}
        reversed
        alt
      />

      <SocialProof />

      <FinalCTA />
    </>
  );
}
