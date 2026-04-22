/**
 * Generates individual page.tsx files for every service and industry route
 * inside Next.js Route Groups that mirror the Navbar menu hierarchy.
 *
 * Route Groups use (parentheses) directories — they organize the filesystem
 * without affecting URLs.  /services/websites stays /services/websites even
 * though the file lives at app/services/(ideate)/websites/page.tsx.
 *
 * Usage:  node scripts/generate-static-routes.mjs
 */

import { readFileSync, mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Helpers ──────────────────────────────────────────────────────────────────

function toPascalCase(slug) {
  return (
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("") + "Page"
  );
}

function emit(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

// ── Groupings (exact mirror of Navbar menuData) ──────────────────────────────

const SERVICE_GROUPS = {
  "(ideate)": ["ux-ui-design", "websites", "cloud-consulting"],
  "(build)": ["dedicated-teams", "cloud-engineering", "embedded-software", "apps"],
  "(improve)": ["digital-transformation", "ai", "ai-ml", "data-engineering"],
  "(operate)": ["iam", "automation-testing", "devops", "software-auditing", "security-audit"],
  "(scale)": ["nearshore", "outsourcing", "startups"],
};

const INDUSTRY_GROUPS = {
  "(retail-and-ecommerce)": [
    "online-retail-stores", "brick-and-mortar-retail", "fashion-and-apparel",
    "grocery-and-food-delivery", "electronics-and-gadgets", "furniture-and-home-decor",
    "beauty-and-cosmetics", "bookstores", "pharmacies", "automotive-parts",
  ],
  "(healthcare-and-medical)": [
    "hospitals-and-clinics", "telemedicine", "dental-practices", "mental-health",
    "pharmacies-medical", "fitness-and-wellness", "medical-equipment",
    "laboratories", "physical-therapy", "senior-care",
  ],
  "(financial-services)": [
    "banks-and-credit-unions", "investment-firms", "insurance", "fintech-startups",
    "accounting-firms", "personal-finance", "cryptocurrency", "microfinance",
    "real-estate-investment", "credit-unions",
  ],
  "(real-estate-and-property)": [
    "real-estate-agencies", "property-management", "real-estate-investment-prop",
    "commercial-real-estate", "vacation-rentals", "property-development",
    "real-estate-agents", "mortgage-brokers", "facility-management", "co-working-spaces",
  ],
  "(education-and-elearning)": [
    "schools-and-universities", "online-courses", "corporate-training",
    "tutoring-services", "test-preparation", "language-learning", "childcare",
    "vocational-training", "educational-publishers", "coding-bootcamps",
  ],
  "(hospitality-and-tourism)": [
    "hotels-and-resorts", "restaurants-and-cafes", "travel-agencies", "airlines",
    "tour-operators", "event-venues", "bed-and-breakfasts", "cruise-lines",
    "car-rentals", "travel-bloggers",
  ],
  "(manufacturing-and-industrial)": [
    "manufacturing-plants", "supply-chain-and-logistics", "warehousing",
    "quality-control", "equipment-maintenance", "factory-automation",
    "procurement", "distribution", "chemical-and-pharmaceutical", "automotive-manufacturing",
  ],
  "(professional-services)": [
    "law-firms", "accounting-firms-pro", "consulting-agencies", "marketing-agencies",
    "architecture-firms", "engineering-firms", "hr-consulting", "it-services",
    "recruiting-agencies", "business-coaching",
  ],
  "(media-and-entertainment)": [
    "film-and-video-production", "music-industry", "gaming", "photography",
    "publishing", "news-and-media", "podcasting", "event-production",
    "social-media-influencers", "art-galleries",
  ],
  "(nonprofit-and-social-enterprise)": [
    "charities", "ngos", "religious-organizations", "community-groups",
    "foundations", "social-enterprises", "environmental-groups",
    "educational-non-profits", "health-advocacy", "animal-welfare",
  ],
  "(technology-and-startups)": [
    "saas-companies", "tech-startups", "mobile-app-developers", "ai-companies",
    "blockchain-crypto", "iot-companies", "cybersecurity", "cloud-services",
    "devops-tools", "developer-tools",
  ],
  "(agriculture-and-farming)": [
    "farms", "agribusiness", "livestock-management", "farm-equipment",
    "produce-distribution", "organic-farming", "agricultural-co-ops",
    "precision-agriculture", "fisheries", "forestry",
  ],
  "(construction-and-engineering)": [
    "construction-companies", "architecture-firms-ce", "civil-engineering",
    "contractors", "subcontractors", "building-materials", "real-estate-development",
    "facility-management-ce", "renovation-services", "landscape-architecture",
  ],
  "(transportation-and-logistics)": [
    "trucking-companies", "delivery-services", "freight-forwarding", "warehousing-tl",
    "public-transportation", "ride-sharing", "courier-services", "shipping-lines",
    "railway-companies", "aviation",
  ],
  "(government-and-public-sector)": [
    "local-government", "federal-agencies", "public-safety", "education-departments",
    "health-departments", "transportation-departments", "parks-and-recreation",
    "libraries", "utilities", "tax-authorities",
  ],
  "(sports-and-recreation)": [
    "sports-teams", "fitness-centers", "gyms", "yoga-studios", "sports-leagues",
    "outdoor-recreation", "martial-arts-schools", "dance-studios", "golf-courses",
    "sports-events",
  ],
  "(beauty-and-personal-care)": [
    "salons", "spas", "barber-shops", "nail-salons", "estheticians",
    "tattoo-shops", "beauty-clinics", "cosmetics-brands", "hair-products", "skincare",
  ],
  "(automotive)": [
    "car-dealerships", "auto-repair-shops", "car-washes", "auto-parts-stores",
    "fleet-management", "rental-cars", "motorcycle-shops", "tire-shops",
    "body-shops", "automotive-detailing",
  ],
  "(legal-services)": [
    "law-firms-legal", "solo-practitioners", "corporate-law", "family-law",
    "criminal-defense", "immigration-law", "intellectual-property",
    "real-estate-law", "estate-planning", "legal-aid",
  ],
  "(small-business)": [
    "local-retail", "restaurants-sb", "salons-sb", "gyms-sb", "law-firms-sb",
    "accounting-firms-sb", "real-estate-agents-sb", "consultants",
    "contractors-sb", "freelancers",
  ],
};

// ── Page templates ───────────────────────────────────────────────────────────

function servicePageContent(slug) {
  const fn = toPascalCase(slug);
  return `import type { Metadata } from "next";
import { servicesData } from "@/data/services";
import ServiceDetail from "@/pages-src/ServiceDetail";

const slug = "${slug}";
const service = servicesData[slug];

export const metadata: Metadata = {
  title: service ? \`\${service.title} | CiroStack\` : "Service | CiroStack",
  description: service?.description ?? "",
};

export default function ${fn}() {
  return <ServiceDetail />;
}
`;
}

function industryPageContent(slug) {
  const fn = toPascalCase(slug);
  return `import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "${slug}";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? \`\${industry.title} | CiroStack\` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
};

export default function ${fn}() {
  return <Industry />;
}
`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

let serviceCount = 0;
let industryCount = 0;

for (const [group, slugs] of Object.entries(SERVICE_GROUPS)) {
  for (const slug of slugs) {
    const path = join(ROOT, `src/app/services/${group}/${slug}/page.tsx`).replace(/\\/g, "/");
    emit(path, servicePageContent(slug));
    serviceCount++;
  }
}

for (const [group, slugs] of Object.entries(INDUSTRY_GROUPS)) {
  for (const slug of slugs) {
    const path = join(ROOT, `src/app/industries/${group}/${slug}/page.tsx`).replace(/\\/g, "/");
    emit(path, industryPageContent(slug));
    industryCount++;
  }
}

console.log(`Services:   ${serviceCount} pages in ${Object.keys(SERVICE_GROUPS).length} groups`);
console.log(`Industries: ${industryCount} pages in ${Object.keys(INDUSTRY_GROUPS).length} groups`);
console.log(`\nDone — ${serviceCount + industryCount} static route files created.`);
console.log("Route groups (parentheses dirs) keep URLs unchanged.");
