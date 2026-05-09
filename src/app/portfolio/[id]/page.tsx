import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/caseStudies";
import CaseStudy from "@/pages-src/CaseStudy";
import { HIDE_CASE_STUDIES } from "@/lib/feature-flags";

type Props = { params: Promise<{ id: string }> };

const PORTFOLIO_OG: Record<string, { ogTitle: string; ogDesc: string }> = {
  healthflow: {
    ogTitle: "HealthFlow Dashboard \u2014 Patient Management Case Study",
    ogDesc: "How we built a real-time patient management dashboard with AI-powered diagnostics for a healthcare startup. Multi-clinic sync, role-based access, and HIPAA-ready architecture \u2014 shipped in 12 weeks.",
  },
  shoplocal: {
    ogTitle: "ShopLocal Marketplace \u2014 E-Commerce Case Study",
    ogDesc: "We built a multi-vendor marketplace that connects local businesses with their community. Unified checkout, delivery tracking, and vendor analytics \u2014 all on one platform.",
  },
  autotask: {
    ogTitle: "AutoTask AI \u2014 Workflow Automation Case Study",
    ogDesc: "How we cut manual processes by 75% with AI-driven document extraction, business rule validation, and seamless ERP integration. Built for enterprise scale.",
  },
  fittrack: {
    ogTitle: "FitTrack Pro \u2014 Fitness App Case Study",
    ogDesc: "A cross-platform fitness app with AI coaching, wearable sync, and social features. We built it for iOS and Android with personalized workout plans that actually keep users engaged.",
  },
  greenleaf: {
    ogTitle: "GreenLeaf Website \u2014 Eco-Tech Startup Case Study",
    ogDesc: "An interactive website with carbon calculators, animated infographics, and an investor portal for an eco-tech startup. Resulted in 2x more qualified leads and 4-minute average time on page.",
  },
  docai: {
    ogTitle: "DocAI Processor \u2014 Legal AI Case Study",
    ogDesc: "AI-powered contract analysis that identifies 50+ clause types, flags risks, and generates executive summaries in seconds. We built it for a legal firm that processes thousands of contracts monthly.",
  },
  retailmax: {
    ogTitle: "RetailMax Smart POS \u2014 Retail Case Study",
    ogDesc: "A next-generation point-of-sale system for a 120-store retail chain. Touch-first interface, real-time inventory across all locations, customer profiles at the register, and full offline capability.",
  },
  finguard: {
    ogTitle: "FinGuard Security Platform \u2014 Fintech Case Study",
    ogDesc: "Security audit and real-time fraud detection for a digital bank processing \u00A32B annually. We found and patched 200+ vulnerabilities, blocked \u00A34.2M in fraud, and passed FCA audit with zero findings.",
  },
  propview: {
    ogTitle: "PropView Real Estate Platform \u2014 Cloud Case Study",
    ogDesc: "Cloud-native property listing platform with virtual tours, serving 5,000+ agents across Texas. We migrated from on-premise to AWS with zero downtime and cut infrastructure costs by 45%.",
  },
  eduspark: {
    ogTitle: "EduSpark Learning Platform \u2014 EdTech Case Study",
    ogDesc: "An enterprise LMS supporting 50,000+ concurrent students with AI-driven learning paths. Adaptive curriculum, live video, and auto-scaling infrastructure that never crashes during exams.",
  },
  travelease: {
    ogTitle: "TravelEase Booking App \u2014 Travel Case Study",
    ogDesc: "An all-in-one travel booking app with AI itinerary planning for East African tourism operators. Multi-currency payments, offline maps, and real-time availability \u2014 built for how people actually travel.",
  },
  factoryiq: {
    ogTitle: "FactoryIQ Smart Manufacturing \u2014 IoT Case Study",
    ogDesc: "IoT-connected smart factory platform with predictive maintenance and CI/CD deployment across 14 manufacturing plants. Real-time production monitoring that drives real decisions on the floor.",
  },
  legalshield: {
    ogTitle: "LegalShield Practice Management \u2014 Audit Case Study",
    ogDesc: "Full software audit and modernization roadmap for a 200-lawyer firm's legacy practice management system. We mapped every risk, prioritized the fixes, and gave them a clear path forward.",
  },
  streamdeck: {
    ogTitle: "StreamDeck Media Platform \u2014 Streaming Case Study",
    ogDesc: "A streaming platform with adaptive bitrate and edge caching serving 2M+ viewers across Africa. We built the infrastructure to deliver high-quality video at scale, even on slow connections.",
  },
  givehub: {
    ogTitle: "GiveHub Donation Platform \u2014 Non-Profit Case Study",
    ogDesc: "End-to-end digital transformation for a major non-profit \u2014 from paper-based donor management to a modern cloud platform. Online donations, campaign tracking, and automated reporting.",
  },
  launchpad: {
    ogTitle: "LaunchPad MVP \u2014 Startup Case Study",
    ogDesc: "Rapid MVP development for a Y Combinator-backed startup. We took them from idea to launched product in 8 weeks with a senior engineering team, clean architecture, and a clear path to scale.",
  },
  agriconnect: {
    ogTitle: "AgriConnect Smart Farming \u2014 AgTech Case Study",
    ogDesc: "IoT data pipeline and analytics platform for precision agriculture across 10,000+ hectares. Sensor integration, weather data, and yield predictions that help farmers make better decisions.",
  },
  buildsite: {
    ogTitle: "BuildSite Pro \u2014 Construction IoT Case Study",
    ogDesc: "Embedded software for IoT-connected construction site monitoring. Safety compliance, equipment tracking, and environmental sensors \u2014 reliable firmware that runs on job sites without babysitting.",
  },
  logistrack: {
    ogTitle: "LogisTrack Fleet Platform \u2014 Logistics Case Study",
    ogDesc: "Fleet management platform with comprehensive automated testing ensuring 99.99% uptime for a 2,000-vehicle logistics fleet. Route optimization, driver management, and real-time tracking.",
  },
  govportal: {
    ogTitle: "GovPortal Citizen Services \u2014 Government Case Study",
    ogDesc: "Unified citizen identity and services portal with biometric authentication serving 5M+ residents. We built secure, accessible digital government services that people actually use.",
  },
  sportspulse: {
    ogTitle: "SportsPulse Analytics \u2014 Sports Tech Case Study",
    ogDesc: "AI-powered sports analytics generating match insights, performance reports, and fan engagement content. We built the platform that turns raw game data into stories coaches and fans care about.",
  },
  beautybook: {
    ogTitle: "BeautyBook Platform \u2014 Beauty Industry Case Study",
    ogDesc: "All-in-one salon management and booking platform serving 3,000+ beauty professionals across the US. Online booking, client management, and payment processing \u2014 built by our nearshore team.",
  },
  autodrive: {
    ogTitle: "AutoDrive Connected Car Platform \u2014 Automotive Case Study",
    ogDesc: "Connected vehicle platform with OTA updates, diagnostics, and fleet management for a European automaker's 50,000-vehicle fleet. Secure firmware updates delivered over the air at scale.",
  },
  smallbizos: {
    ogTitle: "SmallBizOS All-in-One Platform \u2014 Small Business Case Study",
    ogDesc: "AI-powered business management for small businesses \u2014 invoicing, CRM, bookkeeping, and smart insights in one platform. We built the operating system that helps small businesses run without the overhead.",
  },
  cloudops: {
    ogTitle: "CloudOps Multi-Cloud Dashboard \u2014 DevOps Case Study",
    ogDesc: "Unified multi-cloud management across AWS, Azure, and GCP. Cost optimization, security monitoring, and governance in one dashboard \u2014 built for teams managing complex cloud environments.",
  },
};

export async function generateStaticParams() {
  if (HIDE_CASE_STUDIES) return [];
  return Object.keys(projects).map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projects[id];
  if (!project) return { title: "Case Study | CiroStack" };

  const og = PORTFOLIO_OG[id];
  const ogTitle = og?.ogTitle ?? `${project.title} \u2014 Case Study | CiroStack`;
  const ogDesc = og?.ogDesc ?? project.description;

  return {
    title: `${project.title} - Case Study | CiroStack`,
    description: project.description,
    alternates: { canonical: `https://cirostack.com/portfolio/${id}` },
    openGraph: {
      url: `https://cirostack.com/portfolio/${id}`,
      title: ogTitle,
      description: ogDesc,
      images: [{ url: `https://cirostack.com/og/portfolio/${id}.jpg`, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: [`https://cirostack.com/og/portfolio/${id}.jpg`],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  if (HIDE_CASE_STUDIES) notFound();
  void params;
  return <CaseStudy />;
}
