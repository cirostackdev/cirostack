/**
 * Script to generate all startup category and subcategory page files.
 * Run with: npx ts-node --esm scripts/generate-startups.ts
 * Or: bun run scripts/generate-startups.ts
 */

import * as fs from "fs";
import * as path from "path";

const BASE = path.resolve(__dirname, "../src/app/startups");

interface SubCategory {
  slug: string;
  label: string;
  componentName: string;
}

interface Category {
  id: string;
  label: string;
  slug: string;
  subcategories: SubCategory[];
}

const categories: Category[] = [
  {
    id: "by-stage",
    label: "By Stage",
    slug: "by-stage",
    subcategories: [
      { slug: "pre-idea", label: "Pre-Idea Exploration", componentName: "PreIdeaPage" },
      { slug: "validation", label: "Validation Stage", componentName: "ValidationPage" },
      { slug: "mvp", label: "MVP Development", componentName: "MvpPage" },
      { slug: "early-traction", label: "Early Traction", componentName: "EarlyTractionPage" },
      { slug: "seed-stage", label: "Seed Stage", componentName: "SeedStagePage" },
      { slug: "series-a", label: "Series A", componentName: "SeriesAPage" },
      { slug: "series-b-plus", label: "Series B & Beyond", componentName: "SeriesBPlusPage" },
      { slug: "bootstrapped", label: "Bootstrapped", componentName: "BootstrappedPage" },
      { slug: "growth", label: "Growth Stage", componentName: "GrowthPage" },
      { slug: "scale-up", label: "Scale-Up", componentName: "ScaleUpPage" },
    ],
  },
  {
    id: "by-vertical",
    label: "By Vertical",
    slug: "by-vertical",
    subcategories: [
      { slug: "fintech", label: "Fintech Startups", componentName: "FintechPage" },
      { slug: "healthtech", label: "Healthtech Startups", componentName: "HealthtechPage" },
      { slug: "edtech", label: "Edtech Startups", componentName: "EdtechPage" },
      { slug: "proptech", label: "Proptech Startups", componentName: "ProptechPage" },
      { slug: "legaltech", label: "Legaltech Startups", componentName: "LegaltechPage" },
      { slug: "agritech", label: "Agritech Startups", componentName: "AgritechPage" },
      { slug: "logistics-tech", label: "Logistics & Supply Chain", componentName: "LogisticsTechPage" },
      { slug: "ecommerce", label: "E-commerce & Retail", componentName: "EcommercePage" },
      { slug: "b2b-saas", label: "B2B SaaS", componentName: "B2bSaasPage" },
      { slug: "consumer-apps", label: "Consumer Apps", componentName: "ConsumerAppsPage" },
    ],
  },
  {
    id: "by-product",
    label: "By Product Type",
    slug: "by-product",
    subcategories: [
      { slug: "web-app", label: "Web Application", componentName: "WebAppPage" },
      { slug: "mobile-app", label: "Mobile App", componentName: "MobileAppPage" },
      { slug: "ai-product", label: "AI-Powered Product", componentName: "AiProductPage" },
      { slug: "saas-platform", label: "SaaS Platform", componentName: "SaasPlatformPage" },
      { slug: "marketplace", label: "Marketplace", componentName: "MarketplacePage" },
      { slug: "api-product", label: "API Product", componentName: "ApiProductPage" },
      { slug: "data-platform", label: "Data Platform", componentName: "DataPlatformPage" },
      { slug: "iot", label: "IoT Product", componentName: "IotPage" },
      { slug: "internal-tools", label: "Internal Tools", componentName: "InternalToolsPage" },
      { slug: "embedded", label: "Embedded Software", componentName: "EmbeddedPage" },
    ],
  },
  {
    id: "by-founder",
    label: "By Founder Type",
    slug: "by-founder",
    subcategories: [
      { slug: "non-technical-founder", label: "Non-Technical Founder", componentName: "NonTechnicalFounderPage" },
      { slug: "first-time-founder", label: "First-Time Founder", componentName: "FirstTimeFounderPage" },
      { slug: "solo-founder", label: "Solo Founder", componentName: "SoloFounderPage" },
      { slug: "repeat-founder", label: "Repeat Founder", componentName: "RepeatFounderPage" },
      { slug: "student-startup", label: "Student Startup", componentName: "StudentStartupPage" },
      { slug: "corporate-innovator", label: "Corporate Innovator", componentName: "CorporateInnovatorPage" },
      { slug: "female-led", label: "Female-Led Startup", componentName: "FemaleLedPage" },
      { slug: "african-startup", label: "African Startup", componentName: "AfricanStartupPage" },
      { slug: "diaspora-founder", label: "Diaspora Founder", componentName: "DiasporaFounderPage" },
      { slug: "social-enterprise", label: "Social Enterprise", componentName: "SocialEnterprisePage" },
    ],
  },
  {
    id: "by-challenge",
    label: "By Challenge",
    slug: "by-challenge",
    subcategories: [
      { slug: "fast-mvp", label: "Need an MVP Fast", componentName: "FastMvpPage" },
      { slug: "scaling-tech", label: "Outgrowing Current Tech", componentName: "ScalingTechPage" },
      { slug: "agency-rescue", label: "Agency Rescue", componentName: "AgencyRescuePage" },
      { slug: "fundraising-ready", label: "Preparing for Funding", componentName: "FundraisingReadyPage" },
      { slug: "ai-integration", label: "Adding AI Features", componentName: "AiIntegrationPage" },
      { slug: "tech-debt", label: "Crushing Tech Debt", componentName: "TechDebtPage" },
      { slug: "security-compliance", label: "Security & Compliance", componentName: "SecurityCompliancePage" },
      { slug: "post-pivot", label: "Post-Pivot Rebuild", componentName: "PostPivotPage" },
      { slug: "no-tech-team", label: "No In-House Tech Team", componentName: "NoTechTeamPage" },
      { slug: "africa-launch", label: "Launching in Africa", componentName: "AfricaLaunchPage" },
    ],
  },
  {
    id: "by-engagement",
    label: "By Engagement",
    slug: "by-engagement",
    subcategories: [
      { slug: "fixed-price-mvp", label: "Fixed-Price MVP Build", componentName: "FixedPriceMvpPage" },
      { slug: "dedicated-team", label: "Dedicated Dev Team", componentName: "DedicatedTeamPage" },
      { slug: "tech-cofounder", label: "Tech Co-Founder", componentName: "TechCofounderPage" },
      { slug: "cto-as-a-service", label: "CTO as a Service", componentName: "CtoAsAServicePage" },
      { slug: "design-sprint", label: "Design Sprint", componentName: "DesignSprintPage" },
      { slug: "code-audit", label: "Code & Architecture Audit", componentName: "CodeAuditPage" },
      { slug: "staff-augmentation", label: "Staff Augmentation", componentName: "StaffAugmentationPage" },
      { slug: "retainer", label: "Ongoing Retainer", componentName: "RetainerPage" },
      { slug: "nearshore", label: "Nearshore Partnership", componentName: "NearshorePage" },
      { slug: "outsourcing", label: "Outsourced Engineering", componentName: "OutsourcingPage" },
    ],
  },
];

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Generate category landing pages
function generateCategoryPage(cat: Category) {
  const dir = path.join(BASE, cat.slug);
  ensureDir(dir);

  const content = `import type { Metadata } from "next";
import StartupCategory from "@/pages-src/StartupCategory";

export const metadata: Metadata = {
  title: "${cat.label} - Startup Software Solutions | CiroStack",
  description:
    "CiroStack builds custom software for startups. Explore our ${cat.label.toLowerCase()} offerings with fixed-price engagements and senior engineers.",
  alternates: { canonical: "https://cirostack.com/startups/${cat.slug}" },
  openGraph: {
    url: "https://cirostack.com/startups/${cat.slug}",
    title: "${cat.label} - Software for Startups | CiroStack",
    description:
      "Fixed-price startup software development. Senior engineers. Shipped in weeks.",
  },
};

export default function ${cat.id.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join("")}Page() {
  return <StartupCategory categoryId="${cat.id}" />;
}
`;

  fs.writeFileSync(path.join(dir, "page.tsx"), content);
  console.log(`  Created category page: startups/${cat.slug}/page.tsx`);
}

// Generate subcategory pages
function generateSubcategoryPage(cat: Category, sub: SubCategory) {
  const dir = path.join(BASE, `(${cat.id})`, sub.slug);
  ensureDir(dir);

  const content = `import type { Metadata } from "next";
import { startupsData } from "@/data/startups-generated";
import Startup from "@/pages-src/Startup";

const slug = "${sub.slug}";
const startup = startupsData[slug];

export const metadata: Metadata = {
  title: startup ? \`\${startup.title} | CiroStack\` : "Startups | CiroStack",
  description: startup?.tagline ?? "",
  alternates: { canonical: \`https://cirostack.com/startups/\${slug}\` },
  openGraph: {
    url: \`https://cirostack.com/startups/\${slug}\`,
    title: "${sub.label} - Software Development | CiroStack",
    description: startup?.tagline ?? "Fixed-price startup software development by senior engineers.",
  },
};

export default function ${sub.componentName}() {
  return <Startup />;
}
`;

  fs.writeFileSync(path.join(dir, "page.tsx"), content);
  console.log(`  Created subcategory page: startups/(${cat.id})/${sub.slug}/page.tsx`);
}

// Main
console.log("Generating startup pages...\n");

ensureDir(BASE);

for (const cat of categories) {
  console.log(`Category: ${cat.label}`);
  generateCategoryPage(cat);
  for (const sub of cat.subcategories) {
    generateSubcategoryPage(cat, sub);
  }
  console.log("");
}

console.log("Done! Generated 6 category pages + 60 subcategory pages.");
