import imgHealthflow from "@/assets/portfolio-healthflow.jpg";
import imgShoplocal from "@/assets/portfolio-shoplocal.jpg";
import imgAutotask from "@/assets/portfolio-autotask.jpg";
import imgFittrack from "@/assets/portfolio-fittrack.jpg";
import imgGreenleaf from "@/assets/portfolio-greenleaf.jpg";
import imgDocai from "@/assets/portfolio-docai.jpg";
import imgRetailmax from "@/assets/portfolio-retailmax.jpg";
import imgFinguard from "@/assets/portfolio-finguard.jpg";
import imgPropview from "@/assets/portfolio-propview.jpg";
import imgEduspark from "@/assets/portfolio-eduspark.jpg";
import imgTravelease from "@/assets/portfolio-travelease.jpg";
import imgFactoryiq from "@/assets/portfolio-factoryiq.jpg";
import imgLegalshield from "@/assets/portfolio-legalshield.jpg";
import imgStreamdeck from "@/assets/portfolio-streamdeck.jpg";
import imgGivehub from "@/assets/portfolio-givehub.jpg";
import imgLaunchpad from "@/assets/portfolio-launchpad.jpg";
import imgAgriconnect from "@/assets/portfolio-agriconnect.jpg";
import imgBuildsite from "@/assets/portfolio-buildsite.jpg";
import imgLogistrack from "@/assets/portfolio-logistrack.jpg";
import imgGovportal from "@/assets/portfolio-govportal.jpg";
import imgSportspulse from "@/assets/portfolio-sportspulse.jpg";
import imgBeautybook from "@/assets/portfolio-beautybook.jpg";
import imgAutodrive from "@/assets/portfolio-autodrive.jpg";
import imgSmallbizos from "@/assets/portfolio-smallbizos.jpg";
import imgCloudops from "@/assets/portfolio-cloudops.jpg";

const imageMap: Record<string, string> = {
  healthflow: imgHealthflow, shoplocal: imgShoplocal, autotask: imgAutotask,
  fittrack: imgFittrack, greenleaf: imgGreenleaf, docai: imgDocai,
  retailmax: imgRetailmax, finguard: imgFinguard, propview: imgPropview,
  eduspark: imgEduspark, travelease: imgTravelease, factoryiq: imgFactoryiq,
  legalshield: imgLegalshield, streamdeck: imgStreamdeck, givehub: imgGivehub,
  launchpad: imgLaunchpad, agriconnect: imgAgriconnect, buildsite: imgBuildsite,
  logistrack: imgLogistrack, govportal: imgGovportal, sportspulse: imgSportspulse,
  beautybook: imgBeautybook, autodrive: imgAutodrive, smallbizos: imgSmallbizos,
  cloudops: imgCloudops,
};

export type ProjectEntry = {
  title: string;
  client: string;
  industry: string;
  category: string;
  service: string;
  country: string;
  location: string;
  size: string;
  duration: string;
  year: string;
  description: string;
  aboutClient: string;
  challenge: string;
  solution: string;
  keyFeatures: { feature: string; description: string; benefit: string }[];
  result: string;
  metrics: { value: string; label: string }[];
  technologies: { area: string; tools: string[] }[];
  process: { phase: string; activities: string; duration: string }[];
  whatClientLoved: string[];
  challengesOvercome: string[];
  testimonial?: { quote: string; author: string; role: string };
  relatedProjects: { id: string; title: string; description: string }[];
};

export const projectImages: Record<string, string> = {};
export const projects: Record<string, ProjectEntry> = {};

// Helper to register a project
function add(slug: string, p: ProjectEntry) {
  projects[slug] = p;
  projectImages[slug] = imageMap[slug] || imgHealthflow;
}

// ─── 1. HealthFlow Dashboard (Healthcare, Apps) ─────────────────────────
add("healthflow", {
  title: "HealthFlow Dashboard",
  client: "MedTech Startup",
  industry: "Healthcare",
  category: "Apps",
  service: "Custom software development",
  country: "Nigeria",
  location: "Lagos, Nigeria",
  size: "Startup",
  duration: "12 weeks",
  year: "2025",
  description: "A patient management dashboard with real-time analytics and AI-powered insights.",
  aboutClient: "MedTech Startup is a healthcare technology company building solutions to improve patient care across Nigerian clinics. They serve over 50 healthcare practitioners in the Lagos metro area.",
  challenge: "The client needed a centralized platform to manage patient data across multiple clinics with real-time updates and AI diagnostic support. Their existing paper-based system was causing delays, errors, and lost records.",
  solution: "We built a responsive web dashboard with real-time data syncing, role-based access control, and AI-powered diagnostic suggestions. The system integrates with existing EHR systems.",
  keyFeatures: [
    { feature: "Real-time Patient Sync", description: "Live data synchronization across all clinic locations", benefit: "Zero data discrepancies between clinics" },
    { feature: "AI Diagnostic Insights", description: "ML model suggests potential diagnoses based on symptoms", benefit: "30% faster diagnosis time" },
    { feature: "Role-based Access", description: "Granular permissions for doctors, nurses, and admin staff", benefit: "HIPAA-compliant data security" },
    { feature: "Analytics Dashboard", description: "Visual reports on patient flow, wait times, and outcomes", benefit: "Data-driven operational decisions" },
  ],
  result: "60% reduction in administrative time. 3x faster patient intake process. Deployed across 12 clinics with zero downtime.",
  metrics: [
    { value: "60%", label: "Less admin time" },
    { value: "3x", label: "Faster patient intake" },
    { value: "12", label: "Clinics deployed" },
    { value: "0", label: "Downtime incidents" },
  ],
  technologies: [
    { area: "Frontend", tools: ["React", "TypeScript", "Tailwind CSS"] },
    { area: "Backend", tools: ["Node.js", "Express"] },
    { area: "Database", tools: ["PostgreSQL"] },
    { area: "AI/ML", tools: ["OpenAI", "TensorFlow"] },
  ],
  process: [
    { phase: "Discovery", activities: "Requirements gathering, user interviews, technical planning", duration: "2 weeks" },
    { phase: "Design", activities: "Wireframing, UI design, client feedback and iteration", duration: "2 weeks" },
    { phase: "Development", activities: "Agile sprints, weekly demos, continuous integration", duration: "6 weeks" },
    { phase: "Testing", activities: "QA, user acceptance testing, bug fixes", duration: "1 week" },
    { phase: "Launch & Support", activities: "Deployment, training, post-launch support", duration: "1 week" },
  ],
  whatClientLoved: ["The transparency of weekly progress updates", "How intuitive the interface was", "The AI insights that exceeded expectations"],
  challengesOvercome: ["Integrating with legacy EHR systems — we built custom data bridges", "Ensuring real-time sync with unreliable internet — offline-first architecture"],
  testimonial: { quote: "CiroStack transformed our patient management workflow. The AI insights alone saved us countless hours.", author: "Dr. James Park", role: "CTO, MedTech Startup" },
  relatedProjects: [
    { id: "fittrack", title: "FitTrack Pro", description: "Cross-platform fitness tracking app with AI coaching" },
    { id: "autotask", title: "AutoTask AI", description: "AI-driven workflow automation for enterprises" },
  ],
});

// ─── 2. ShopLocal Marketplace (E-commerce, Websites) ────────────────────
add("shoplocal", {
  title: "ShopLocal Marketplace",
  client: "Retail Collective",
  industry: "E-commerce",
  category: "Websites",
  service: "Custom software development",
  country: "Nigeria",
  location: "Abuja, Nigeria",
  size: "Small Business",
  duration: "10 weeks",
  year: "2025",
  description: "Multi-vendor e-commerce platform connecting local businesses with their community.",
  aboutClient: "Retail Collective is a community-driven organization supporting local businesses in Abuja.",
  challenge: "Local businesses lacked online presence and needed a unified platform to reach customers without building individual stores.",
  solution: "We created a multi-vendor marketplace with individual storefronts, unified checkout, delivery tracking, and vendor analytics dashboards.",
  keyFeatures: [
    { feature: "Multi-vendor Storefronts", description: "Individual branded pages for each vendor", benefit: "Vendors maintain their identity" },
    { feature: "Unified Checkout", description: "Buy from multiple vendors in one transaction", benefit: "Higher cart values" },
    { feature: "Delivery Tracking", description: "Real-time order tracking for customers", benefit: "Reduced support inquiries by 40%" },
    { feature: "Vendor Analytics", description: "Sales reports, popular products, customer insights", benefit: "Data-driven vendor decisions" },
  ],
  result: "200+ vendors onboarded in first month. ₦60M in transactions within 90 days.",
  metrics: [
    { value: "200+", label: "Vendors onboarded" },
    { value: "₦60M", label: "In 90-day transactions" },
    { value: "4.7★", label: "User rating" },
    { value: "40%", label: "Fewer support tickets" },
  ],
  technologies: [
    { area: "Frontend", tools: ["Next.js", "Tailwind CSS"] },
    { area: "Backend", tools: ["Node.js"] },
    { area: "Payments", tools: ["Paystack", "Flutterwave"] },
    { area: "Hosting", tools: ["AWS"] },
  ],
  process: [
    { phase: "Discovery", activities: "Vendor interviews, market research, platform requirements", duration: "2 weeks" },
    { phase: "Design", activities: "Marketplace UX, vendor onboarding flow, mobile-first design", duration: "2 weeks" },
    { phase: "Development", activities: "Core marketplace, payment integration, vendor tools", duration: "5 weeks" },
    { phase: "Testing", activities: "End-to-end testing with real vendors, load testing", duration: "1 week" },
  ],
  whatClientLoved: ["Mobile-first approach", "The vendor onboarding was so simple", "On-time delivery despite the complexity"],
  challengesOvercome: ["Supporting multiple payment providers — we built an abstraction layer", "Handling high traffic on launch day — pre-scaled infrastructure"],
  testimonial: { quote: "Our local vendors finally have a digital home. We went from zero online sales to ₦60M in three months.", author: "Maria Rodriguez", role: "Founder, Retail Collective" },
  relatedProjects: [
    { id: "greenleaf", title: "GreenLeaf Website", description: "Award-winning website for an eco-tech startup" },
    { id: "retailmax", title: "RetailMax POS", description: "Smart POS system for retail chains" },
  ],
});

// ─── 3. AutoTask AI (Enterprise, AI) ────────────────────────────────────
add("autotask", {
  title: "AutoTask AI",
  client: "Operations Corp",
  industry: "Enterprise",
  category: "AI",
  service: "AI and ML development services",
  country: "UK",
  location: "London, UK",
  size: "Enterprise",
  duration: "8 weeks",
  year: "2024",
  description: "AI-driven workflow automation reducing manual processes by 75%.",
  aboutClient: "Operations Corp is a mid-size enterprise with over 500 employees processing thousands of documents monthly.",
  challenge: "The company spent hundreds of hours monthly on repetitive data entry and document processing across departments.",
  solution: "We built an AI pipeline that extracts data from documents, validates it against business rules, and feeds it into existing systems automatically.",
  keyFeatures: [
    { feature: "Document Extraction", description: "AI reads and extracts structured data from any document format", benefit: "Handles 10,000+ documents/month" },
    { feature: "Business Rule Validation", description: "Automated checks against company policies", benefit: "99.5% accuracy rate" },
    { feature: "System Integration", description: "Feeds data directly into ERP, CRM, and accounting systems", benefit: "Zero manual data entry" },
    { feature: "Exception Handling", description: "Flags uncertain items for human review", benefit: "Humans focus only on edge cases" },
  ],
  result: "75% reduction in manual work. ROI achieved in under 2 months.",
  metrics: [
    { value: "75%", label: "Less manual work" },
    { value: "<2mo", label: "ROI achieved" },
    { value: "10K+", label: "Docs processed/month" },
    { value: "99.5%", label: "Accuracy rate" },
  ],
  technologies: [
    { area: "AI/ML", tools: ["Python", "LangChain", "OpenAI"] },
    { area: "Automation", tools: ["Zapier", "Custom APIs"] },
    { area: "Backend", tools: ["FastAPI", "PostgreSQL"] },
    { area: "Hosting", tools: ["AWS Lambda"] },
  ],
  process: [
    { phase: "Discovery", activities: "Document audit, workflow mapping, stakeholder interviews", duration: "2 weeks" },
    { phase: "Design", activities: "AI pipeline architecture, integration planning", duration: "1 week" },
    { phase: "Development", activities: "Model training, pipeline building, system integration", duration: "4 weeks" },
    { phase: "Testing", activities: "Accuracy testing with real documents, edge case handling", duration: "1 week" },
  ],
  whatClientLoved: ["ROI was achieved before the project was even fully complete", "Staff were genuinely excited to stop doing data entry", "The exception handling meant they never lost control"],
  challengesOvercome: ["Handling poorly scanned documents — pre-processing and OCR enhancement", "Integrating with a 15-year-old ERP — we built a database bridge"],
  relatedProjects: [
    { id: "docai", title: "DocAI Processor", description: "AI-powered document analysis for legal firms" },
    { id: "healthflow", title: "HealthFlow Dashboard", description: "Patient management with AI insights" },
  ],
});

// ─── 4. FitTrack Pro (Health & Fitness, Apps) ───────────────────────────
add("fittrack", {
  title: "FitTrack Pro",
  client: "Fitness Brand",
  industry: "Health & Fitness",
  category: "Apps",
  service: "Custom software development",
  country: "Nigeria",
  location: "Lagos, Nigeria",
  size: "Startup",
  duration: "14 weeks",
  year: "2024",
  description: "Cross-platform fitness tracking app with personalized AI coaching.",
  aboutClient: "Fitness Brand is a health & wellness startup targeting young professionals in West Africa.",
  challenge: "Users wanted a seamless fitness experience that adapts to their progress, goals, and available equipment.",
  solution: "We built a React Native app with AI-powered workout plans, progress tracking, social features, and wearable device integration.",
  keyFeatures: [
    { feature: "AI Workout Plans", description: "Personalized routines based on goals, equipment, and progress", benefit: "Higher adherence rates" },
    { feature: "Progress Tracking", description: "Visual charts for weight, strength, and body measurements", benefit: "Motivation through visible progress" },
    { feature: "Social Features", description: "Challenges, leaderboards, and workout sharing", benefit: "Community-driven engagement" },
    { feature: "Wearable Sync", description: "Integration with Apple Watch, Fitbit, and Garmin", benefit: "Automatic activity logging" },
  ],
  result: "50K downloads in first quarter. 4.8★ average rating. 78% 30-day retention rate.",
  metrics: [
    { value: "50K", label: "Downloads in Q1" },
    { value: "4.8★", label: "Average rating" },
    { value: "78%", label: "30-day retention" },
    { value: "15min", label: "Avg daily usage" },
  ],
  technologies: [
    { area: "Mobile", tools: ["React Native"] },
    { area: "Backend", tools: ["Node.js", "Firebase"] },
    { area: "AI/ML", tools: ["TensorFlow"] },
    { area: "Other", tools: ["HealthKit", "Google Fit API"] },
  ],
  process: [
    { phase: "Discovery", activities: "User research, competitive analysis, feature prioritization", duration: "2 weeks" },
    { phase: "Design", activities: "App UX/UI design, prototype testing with users", duration: "3 weeks" },
    { phase: "Development", activities: "Core app, AI engine, integrations, social features", duration: "7 weeks" },
    { phase: "Testing", activities: "Beta testing with 200 users, performance optimization", duration: "2 weeks" },
  ],
  whatClientLoved: ["The AI that adapts to available equipment", "Beta users loved the social features", "App store submission was handled end-to-end"],
  challengesOvercome: ["Syncing across multiple wearable platforms — unified health data abstraction", "Keeping app size small — aggressive code splitting and lazy loading"],
  relatedProjects: [
    { id: "healthflow", title: "HealthFlow Dashboard", description: "Patient management with real-time analytics" },
    { id: "sportspulse", title: "SportsPulse Analytics", description: "Real-time sports analytics platform" },
  ],
});

// ─── 5. GreenLeaf Website (Clean Tech, Websites) ───────────────────────
add("greenleaf", {
  title: "GreenLeaf Website",
  client: "Sustainability Startup",
  industry: "Clean Tech",
  category: "Websites",
  service: "Custom software development",
  country: "Kenya",
  location: "Nairobi, Kenya",
  size: "Startup",
  duration: "6 weeks",
  year: "2024",
  description: "Award-winning website for an eco-tech startup with interactive data visualizations.",
  aboutClient: "Sustainability Startup is a clean tech company developing carbon offset solutions for African businesses.",
  challenge: "The startup needed a memorable web presence to attract investors and showcase their environmental impact data.",
  solution: "We designed a visually striking website with animated infographics, an interactive carbon calculator, and a secure investor portal.",
  keyFeatures: [
    { feature: "Interactive Carbon Calculator", description: "Users input business data to see potential carbon savings", benefit: "2x increase in qualified leads" },
    { feature: "Animated Infographics", description: "Data visualizations that tell the environmental impact story", benefit: "Average 4min time on page" },
    { feature: "Investor Portal", description: "Secure area with financial projections and impact reports", benefit: "Streamlined fundraising process" },
    { feature: "Impact Dashboard", description: "Public-facing real-time metrics on carbon offset", benefit: "Builds trust and transparency" },
  ],
  result: "300% increase in investor inquiries. Featured in TechCrunch.",
  metrics: [
    { value: "300%", label: "More investor inquiries" },
    { value: "4min", label: "Avg time on page" },
    { value: "2x", label: "Qualified leads" },
    { value: "1", label: "Webby nomination" },
  ],
  technologies: [
    { area: "Frontend", tools: ["React", "Three.js", "Framer Motion"] },
    { area: "Styling", tools: ["Tailwind CSS"] },
    { area: "Backend", tools: ["Node.js"] },
    { area: "Hosting", tools: ["Vercel"] },
  ],
  process: [
    { phase: "Discovery", activities: "Brand workshop, investor persona research, content strategy", duration: "1 week" },
    { phase: "Design", activities: "Creative direction, interactive prototypes, animation design", duration: "2 weeks" },
    { phase: "Development", activities: "Frontend build, 3D elements, calculator logic, portal", duration: "2 weeks" },
    { phase: "Testing", activities: "Cross-browser testing, performance optimization, SEO audit", duration: "1 week" },
  ],
  whatClientLoved: ["The carbon calculator became their #1 lead generation tool", "Investors commented on how professional the site was", "Page load speed was exceptional despite heavy animations"],
  challengesOvercome: ["Maintaining fast load times with 3D animations — progressive loading and LOD", "Making the carbon calculator accurate — collaborated with their data science team"],
  relatedProjects: [
    { id: "shoplocal", title: "ShopLocal Marketplace", description: "Multi-vendor e-commerce platform" },
    { id: "agriconnect", title: "AgriConnect Platform", description: "Smart farming management system" },
  ],
});

// ─── 6. DocAI Processor (Legal, AI) ─────────────────────────────────────
add("docai", {
  title: "DocAI Processor",
  client: "Legal Firm",
  industry: "Legal",
  category: "AI",
  service: "AI and ML development services",
  country: "Nigeria",
  location: "Lagos, Nigeria",
  size: "Medium",
  duration: "10 weeks",
  year: "2025",
  description: "AI-powered document analysis tool that processes legal contracts in minutes.",
  aboutClient: "A top-20 law firm in Lagos specializing in corporate law, handling hundreds of contracts monthly.",
  challenge: "Lawyers spent hours reviewing each contract for key clauses, obligations, and potential risks.",
  solution: "We built an AI tool that scans documents, highlights key clauses, flags risks, generates summaries, and compares against templates.",
  keyFeatures: [
    { feature: "Clause Detection", description: "AI identifies and categorizes 50+ types of legal clauses", benefit: "Nothing gets missed" },
    { feature: "Risk Flagging", description: "Automatically highlights potentially problematic terms", benefit: "Proactive risk management" },
    { feature: "Summary Generation", description: "Creates executive summaries of contracts in seconds", benefit: "Partners get quick overviews" },
    { feature: "Template Comparison", description: "Compares contracts against approved templates", benefit: "Consistent legal standards" },
  ],
  result: "90% faster contract review. Zero missed critical clauses. Adopted by 3 partner firms.",
  metrics: [
    { value: "90%", label: "Faster review" },
    { value: "0", label: "Missed clauses" },
    { value: "3", label: "Firms adopted" },
    { value: "500+", label: "Contracts processed" },
  ],
  technologies: [
    { area: "AI/ML", tools: ["Python", "OpenAI", "spaCy"] },
    { area: "Frontend", tools: ["React", "TypeScript"] },
    { area: "Backend", tools: ["FastAPI"] },
    { area: "Database", tools: ["PostgreSQL"] },
  ],
  process: [
    { phase: "Discovery", activities: "Legal workflow analysis, contract taxonomy, compliance requirements", duration: "2 weeks" },
    { phase: "Design", activities: "Legal-focused UX, annotation interface design", duration: "2 weeks" },
    { phase: "Development", activities: "AI model training, document pipeline, UI development", duration: "4 weeks" },
    { phase: "Testing", activities: "Testing with 200+ real contracts, accuracy validation with lawyers", duration: "2 weeks" },
  ],
  whatClientLoved: ["Junior associates now focus on analysis instead of reading entire contracts", "The risk flagging caught issues they would have missed", "Zero learning curve"],
  challengesOvercome: ["Handling contracts in multiple formats — universal document parser", "Ensuring AI accuracy met legal standards — human-in-the-loop validation"],
  testimonial: { quote: "This tool has completely changed how we handle contract review. It's like having a tireless associate who never misses a clause.", author: "Rebecca Lane", role: "Partner, Legal Firm" },
  relatedProjects: [
    { id: "autotask", title: "AutoTask AI", description: "AI-driven workflow automation for enterprises" },
    { id: "healthflow", title: "HealthFlow Dashboard", description: "Patient management with AI insights" },
  ],
});

// ─── 7. RetailMax POS (Retail & E-Commerce, UX/UI Design) ──────────────
add("retailmax", {
  title: "RetailMax Smart POS",
  client: "ChainStore Group",
  industry: "Retail & E-Commerce",
  category: "Apps",
  service: "UX & UI Design Services",
  country: "USA",
  location: "Chicago, USA",
  size: "Enterprise",
  duration: "16 weeks",
  year: "2025",
  description: "A next-generation point-of-sale system with inventory management and customer insights for a 120-store retail chain.",
  aboutClient: "ChainStore Group operates 120 retail stores across the Midwest, serving 2M+ customers annually with a focus on home goods and electronics.",
  challenge: "Their legacy POS was slow, crashed during peak hours, and lacked integration with their e-commerce channel. Staff training on the old system took 3 weeks per new hire.",
  solution: "We designed and built a modern, touch-first POS interface with real-time inventory sync, customer loyalty integration, and an intuitive UI that cut training time to 2 days.",
  keyFeatures: [
    { feature: "Touch-First Interface", description: "Intuitive tablet-based POS designed for speed", benefit: "50% faster checkout times" },
    { feature: "Omnichannel Inventory", description: "Real-time stock levels across online and all 120 stores", benefit: "Zero overselling incidents" },
    { feature: "Customer Profiles", description: "Purchase history and preferences at the register", benefit: "Personalized upselling increased AOV by 18%" },
    { feature: "Offline Mode", description: "Full POS functionality without internet connection", benefit: "Zero downtime during outages" },
  ],
  result: "50% faster checkout. 18% increase in average order value. Staff training reduced from 3 weeks to 2 days.",
  metrics: [
    { value: "50%", label: "Faster checkout" },
    { value: "18%", label: "Higher AOV" },
    { value: "120", label: "Stores deployed" },
    { value: "2 days", label: "Staff training time" },
  ],
  technologies: [
    { area: "Frontend", tools: ["React", "TypeScript", "Tailwind CSS"] },
    { area: "Backend", tools: ["Node.js", "Redis"] },
    { area: "Database", tools: ["PostgreSQL", "ElasticSearch"] },
    { area: "Infrastructure", tools: ["AWS", "Docker"] },
  ],
  process: [
    { phase: "Discovery", activities: "In-store observation, cashier interviews, competitor analysis", duration: "3 weeks" },
    { phase: "Design", activities: "UX research, touch-first prototyping, A/B testing with staff", duration: "4 weeks" },
    { phase: "Development", activities: "POS core, inventory sync, offline mode, integrations", duration: "7 weeks" },
    { phase: "Rollout", activities: "Pilot in 5 stores, full deployment, staff training", duration: "2 weeks" },
  ],
  whatClientLoved: ["Cashiers learned the system in hours, not weeks", "The offline mode was a lifesaver during an internet outage", "Customer insights at the register drove real upsells"],
  challengesOvercome: ["Syncing inventory across 120 stores in real-time — event-driven architecture with Redis", "Supporting legacy receipt printers — built a universal print adapter"],
  testimonial: { quote: "Our checkout lines move twice as fast and our staff actually enjoy using the system. The ROI was immediate.", author: "Karen Mitchell", role: "VP Operations, ChainStore Group" },
  relatedProjects: [
    { id: "shoplocal", title: "ShopLocal Marketplace", description: "Multi-vendor e-commerce platform" },
    { id: "beautybook", title: "BeautyBook", description: "Salon booking and management platform" },
  ],
});

// ─── 8. FinGuard Platform (Financial Services, Security Audit) ──────────
add("finguard", {
  title: "FinGuard Security Platform",
  client: "NexBank",
  industry: "Financial Services",
  category: "Security",
  service: "Security Audit & Governance",
  country: "UK",
  location: "London, UK",
  size: "Enterprise",
  duration: "10 weeks",
  year: "2025",
  description: "Comprehensive security audit and real-time fraud detection system for a digital banking platform processing £2B annually.",
  aboutClient: "NexBank is a UK-based digital bank serving 500K+ customers with mobile-first banking, lending, and investment products.",
  challenge: "Regulators flagged gaps in their security posture. They needed a full audit, penetration testing, and a real-time fraud detection system before their next FCA review.",
  solution: "We conducted a comprehensive security audit, implemented zero-trust architecture, and deployed ML-powered fraud detection that analyzes transactions in under 50ms.",
  keyFeatures: [
    { feature: "Security Audit", description: "Full infrastructure, application, and code-level security review", benefit: "200+ vulnerabilities identified and patched" },
    { feature: "Real-time Fraud Detection", description: "ML model analyzing transaction patterns in real-time", benefit: "Blocked £4.2M in fraudulent transactions" },
    { feature: "Zero-Trust Architecture", description: "Network segmentation and continuous authentication", benefit: "Passed FCA audit with zero findings" },
    { feature: "Compliance Dashboard", description: "Real-time compliance status across all regulations", benefit: "Audit-ready at any moment" },
  ],
  result: "Passed FCA audit with zero findings. Blocked £4.2M in fraud in first quarter.",
  metrics: [
    { value: "200+", label: "Vulnerabilities patched" },
    { value: "£4.2M", label: "Fraud blocked" },
    { value: "0", label: "FCA audit findings" },
    { value: "<50ms", label: "Detection latency" },
  ],
  technologies: [
    { area: "Security", tools: ["OWASP ZAP", "Burp Suite", "SonarQube"] },
    { area: "AI/ML", tools: ["Python", "scikit-learn", "TensorFlow"] },
    { area: "Infrastructure", tools: ["AWS", "Kubernetes", "Terraform"] },
    { area: "Monitoring", tools: ["Datadog", "PagerDuty"] },
  ],
  process: [
    { phase: "Audit", activities: "Penetration testing, code review, infrastructure assessment", duration: "3 weeks" },
    { phase: "Architecture", activities: "Zero-trust design, network segmentation planning", duration: "2 weeks" },
    { phase: "Implementation", activities: "Security hardening, fraud model training, dashboard", duration: "4 weeks" },
    { phase: "Validation", activities: "Red team exercise, compliance verification", duration: "1 week" },
  ],
  whatClientLoved: ["The depth of the audit report — nothing was overlooked", "Fraud detection ROI was immediate", "We were audit-ready within weeks"],
  challengesOvercome: ["Implementing zero-trust without disrupting live banking — phased rollout", "Training fraud models with limited historical data — synthetic data augmentation"],
  testimonial: { quote: "CiroStack turned our biggest regulatory risk into our strongest competitive advantage. The fraud detection system paid for itself in the first month.", author: "James Whitfield", role: "CISO, NexBank" },
  relatedProjects: [
    { id: "autotask", title: "AutoTask AI", description: "AI-driven workflow automation" },
    { id: "govportal", title: "GovPortal", description: "Citizen services platform" },
  ],
});

// ─── 9. PropView (Real Estate, Cloud Consulting) ────────────────────────
add("propview", {
  title: "PropView Real Estate Platform",
  client: "UrbanNest Realty",
  industry: "Real Estate & Property",
  category: "Cloud",
  service: "Cloud Consulting & Services",
  country: "USA",
  location: "Austin, USA",
  size: "Medium",
  duration: "12 weeks",
  year: "2025",
  description: "Cloud-native property listing and virtual tour platform serving 5,000+ real estate agents across Texas.",
  aboutClient: "UrbanNest Realty is a fast-growing real estate brokerage with 5,000+ agents across Texas, known for adopting technology to give their agents an edge.",
  challenge: "Their on-premise listing platform couldn't handle peak traffic, virtual tours were laggy, and infrastructure costs were spiraling. They needed a cloud migration strategy.",
  solution: "We migrated their entire platform to a cloud-native architecture with auto-scaling, CDN-delivered virtual tours, and a serverless backend that cut costs by 45%.",
  keyFeatures: [
    { feature: "Cloud Migration", description: "Full migration from on-premise to AWS with zero downtime", benefit: "45% reduction in infrastructure costs" },
    { feature: "Virtual Tour CDN", description: "360° property tours delivered via global CDN", benefit: "3x faster load times for tours" },
    { feature: "Auto-Scaling", description: "Automatic scaling during peak listing periods", benefit: "Zero performance degradation" },
    { feature: "Serverless Backend", description: "Event-driven architecture for listing management", benefit: "Pay only for actual usage" },
  ],
  result: "45% cost reduction. 3x faster virtual tours. Zero downtime during migration.",
  metrics: [
    { value: "45%", label: "Cost reduction" },
    { value: "3x", label: "Faster load times" },
    { value: "0", label: "Downtime during migration" },
    { value: "5K+", label: "Agents supported" },
  ],
  technologies: [
    { area: "Cloud", tools: ["AWS", "CloudFront", "S3"] },
    { area: "Backend", tools: ["Lambda", "API Gateway", "DynamoDB"] },
    { area: "Frontend", tools: ["React", "Next.js"] },
    { area: "DevOps", tools: ["Terraform", "GitHub Actions"] },
  ],
  process: [
    { phase: "Assessment", activities: "Infrastructure audit, cost analysis, migration planning", duration: "2 weeks" },
    { phase: "Architecture", activities: "Cloud-native design, serverless patterns, CDN strategy", duration: "2 weeks" },
    { phase: "Migration", activities: "Phased migration, data transfer, testing", duration: "6 weeks" },
    { phase: "Optimization", activities: "Performance tuning, cost optimization, monitoring", duration: "2 weeks" },
  ],
  whatClientLoved: ["Zero downtime during the entire migration", "Virtual tours now load instantly even on mobile", "Monthly costs dropped significantly"],
  challengesOvercome: ["Migrating 2TB of property images without downtime — incremental sync strategy", "Maintaining SEO rankings during domain changes — 301 redirect automation"],
  testimonial: { quote: "The migration was seamless. Our agents didn't even notice it happened, except that everything got faster.", author: "Greg Thompson", role: "CEO, UrbanNest Realty" },
  relatedProjects: [
    { id: "greenleaf", title: "GreenLeaf Website", description: "Award-winning eco-tech website" },
    { id: "cloudops", title: "CloudOps Dashboard", description: "Multi-cloud management platform" },
  ],
});

// ─── 10. EduSpark LMS (Education, Dedicated Teams) ──────────────────────
add("eduspark", {
  title: "EduSpark Learning Platform",
  client: "EduPrime",
  industry: "Education & E-Learning",
  category: "Platforms",
  service: "Dedicated Development Teams",
  country: "USA",
  location: "Boston, USA",
  size: "Enterprise",
  duration: "24 weeks",
  year: "2024",
  description: "Enterprise LMS supporting 50,000+ concurrent students with AI-driven personalized learning paths.",
  aboutClient: "EduPrime is a leading EdTech company serving universities and corporate training programs across North America.",
  challenge: "Their existing LMS crashed during peak exam periods and lacked modern features like adaptive learning. Their internal team was too small to rebuild it.",
  solution: "We embedded a 6-person dedicated team that rebuilt the LMS from the ground up with auto-scaling architecture, AI-powered learning paths, and real-time collaboration.",
  keyFeatures: [
    { feature: "AI Learning Paths", description: "Adaptive curriculum that adjusts based on student performance", benefit: "35% improvement in completion rates" },
    { feature: "Auto-Scaling", description: "Handles 50,000+ concurrent users without degradation", benefit: "Zero crashes during exams" },
    { feature: "Real-time Collaboration", description: "Live document editing, video rooms, and group projects", benefit: "Enhanced remote learning experience" },
    { feature: "Analytics Engine", description: "Student engagement and performance dashboards for educators", benefit: "Data-driven curriculum improvements" },
  ],
  result: "50,000 concurrent students supported. 35% better completion rates. Zero exam-period crashes.",
  metrics: [
    { value: "50K+", label: "Concurrent users" },
    { value: "35%", label: "Better completion" },
    { value: "0", label: "Exam crashes" },
    { value: "6", label: "Team members embedded" },
  ],
  technologies: [
    { area: "Frontend", tools: ["React", "TypeScript", "WebRTC"] },
    { area: "Backend", tools: ["Node.js", "GraphQL", "Redis"] },
    { area: "Database", tools: ["PostgreSQL", "MongoDB"] },
    { area: "Cloud", tools: ["AWS ECS", "CloudFront"] },
  ],
  process: [
    { phase: "Team Setup", activities: "Recruitment, onboarding, process alignment", duration: "2 weeks" },
    { phase: "Architecture", activities: "System design, tech stack selection, sprint planning", duration: "3 weeks" },
    { phase: "Development", activities: "8 agile sprints with bi-weekly releases", duration: "16 weeks" },
    { phase: "Handoff", activities: "Knowledge transfer, documentation, support transition", duration: "3 weeks" },
  ],
  whatClientLoved: ["The dedicated team felt like their own employees", "Bi-weekly releases meant they saw progress constantly", "The AI personalization exceeded all expectations"],
  challengesOvercome: ["Migrating 5 years of student data — incremental migration with zero data loss", "Building real-time collaboration at scale — custom WebRTC signaling server"],
  testimonial: { quote: "The CiroStack team integrated seamlessly with our engineers. The new LMS handles 50,000 students without breaking a sweat.", author: "Professor Laura Vance", role: "CTO, EduPrime" },
  relatedProjects: [
    { id: "healthflow", title: "HealthFlow Dashboard", description: "Patient management dashboard" },
    { id: "govportal", title: "GovPortal", description: "Citizen services platform" },
  ],
});

// ─── 11. TravelEase (Hospitality & Tourism, Mobile Apps) ────────────────
add("travelease", {
  title: "TravelEase Booking App",
  client: "Safari Adventures",
  industry: "Hospitality & Tourism",
  category: "Apps",
  service: "Mobile Apps Development",
  country: "Kenya",
  location: "Nairobi, Kenya",
  size: "Medium",
  duration: "14 weeks",
  year: "2024",
  description: "All-in-one travel booking app with AI itinerary planning for East African tourism operators.",
  aboutClient: "Safari Adventures operates premium safari and beach holiday packages across Kenya, Tanzania, and Zanzibar, serving 20,000+ travelers annually.",
  challenge: "Bookings were handled via email and WhatsApp, leading to double-bookings, lost inquiries, and no visibility into availability. They were losing 30% of leads to faster competitors.",
  solution: "We built a cross-platform mobile app with real-time availability, AI-powered itinerary suggestions, instant booking confirmation, and multi-currency payment support.",
  keyFeatures: [
    { feature: "AI Itinerary Builder", description: "Suggests personalized trip plans based on preferences and budget", benefit: "40% higher booking conversion" },
    { feature: "Real-time Availability", description: "Live inventory from 200+ partner lodges and camps", benefit: "Zero double-bookings" },
    { feature: "Multi-currency Payments", description: "Supports USD, EUR, GBP, and KES with local payment methods", benefit: "Reduced payment friction" },
    { feature: "Offline Access", description: "Trip details available without internet in remote safari areas", benefit: "Essential for bush camps" },
  ],
  result: "40% higher conversion rate. Zero double-bookings. 20,000+ trips booked in first year.",
  metrics: [
    { value: "40%", label: "Higher conversion" },
    { value: "0", label: "Double-bookings" },
    { value: "20K+", label: "Trips booked" },
    { value: "4.9★", label: "App rating" },
  ],
  technologies: [
    { area: "Mobile", tools: ["React Native", "Expo"] },
    { area: "Backend", tools: ["Node.js", "Express"] },
    { area: "Payments", tools: ["Stripe", "M-Pesa API"] },
    { area: "Cloud", tools: ["Firebase", "GCP"] },
  ],
  process: [
    { phase: "Discovery", activities: "Customer journey mapping, partner interviews, market analysis", duration: "2 weeks" },
    { phase: "Design", activities: "Mobile UX, booking flow optimization, offline-first design", duration: "3 weeks" },
    { phase: "Development", activities: "App build, payment integration, partner API connections", duration: "7 weeks" },
    { phase: "Launch", activities: "App store submission, partner training, marketing support", duration: "2 weeks" },
  ],
  whatClientLoved: ["The AI itinerary builder became their strongest selling point", "Offline mode works perfectly in remote safari camps", "M-Pesa integration opened up the local market"],
  challengesOvercome: ["Integrating with 200+ partner systems with varying APIs — built a universal adapter", "Offline functionality with eventual sync — conflict resolution algorithm"],
  testimonial: { quote: "We went from losing leads to being the fastest-booking safari company in East Africa. The app is our competitive advantage.", author: "David Kimani", role: "CEO, Safari Adventures" },
  relatedProjects: [
    { id: "fittrack", title: "FitTrack Pro", description: "Cross-platform fitness app" },
    { id: "retailmax", title: "RetailMax POS", description: "Smart POS system" },
  ],
});

// ─── 12. FactoryIQ (Manufacturing, DevOps) ──────────────────────────────
add("factoryiq", {
  title: "FactoryIQ Smart Manufacturing",
  client: "PrecisionMFG",
  industry: "Manufacturing & Industrial",
  category: "DevOps",
  service: "DevOps Consulting Services",
  country: "Germany",
  location: "Munich, Germany",
  size: "Enterprise",
  duration: "18 weeks",
  year: "2025",
  description: "IoT-connected smart factory platform with predictive maintenance and CI/CD-powered deployment for 14 manufacturing plants.",
  aboutClient: "PrecisionMFG is a German industrial manufacturer operating 14 plants across Europe, producing precision components for automotive and aerospace industries.",
  challenge: "Software deployments to factory floor systems took weeks, causing delays in rolling out critical updates. Unplanned downtime cost €200K per incident.",
  solution: "We implemented a full DevOps pipeline for their factory systems — CI/CD for edge devices, infrastructure-as-code for factory servers, and a predictive maintenance AI that reduced downtime by 28%.",
  keyFeatures: [
    { feature: "Edge CI/CD", description: "Automated deployments to 500+ factory floor devices", benefit: "Deployments from weeks to hours" },
    { feature: "Predictive Maintenance", description: "AI analyzing sensor data to predict equipment failures", benefit: "28% less unplanned downtime" },
    { feature: "Infrastructure as Code", description: "Terraform-managed factory server infrastructure", benefit: "Consistent environments across 14 plants" },
    { feature: "Monitoring & Alerting", description: "Real-time health dashboards for all plant systems", benefit: "15-minute mean time to detection" },
  ],
  result: "28% less downtime. Deployments from weeks to hours. Saved €2.8M in first year.",
  metrics: [
    { value: "28%", label: "Less downtime" },
    { value: "€2.8M", label: "Annual savings" },
    { value: "500+", label: "Devices managed" },
    { value: "15min", label: "Mean time to detect" },
  ],
  technologies: [
    { area: "DevOps", tools: ["Jenkins", "ArgoCD", "Terraform"] },
    { area: "Monitoring", tools: ["Prometheus", "Grafana", "PagerDuty"] },
    { area: "Edge", tools: ["Docker", "K3s", "MQTT"] },
    { area: "AI/ML", tools: ["Python", "scikit-learn"] },
  ],
  process: [
    { phase: "Assessment", activities: "Current state audit, deployment workflow analysis", duration: "3 weeks" },
    { phase: "Pipeline Design", activities: "CI/CD architecture, edge deployment strategy", duration: "3 weeks" },
    { phase: "Implementation", activities: "Pipeline setup, IaC migration, monitoring deployment", duration: "10 weeks" },
    { phase: "Training", activities: "Team enablement, runbook creation, handoff", duration: "2 weeks" },
  ],
  whatClientLoved: ["Deployments that used to take 2 weeks now happen in 2 hours", "Predictive maintenance caught a critical pump failure before it happened", "The monitoring dashboards are used by management daily"],
  challengesOvercome: ["Deploying to air-gapped factory networks — built an offline artifact sync system", "Managing diverse device types across 14 plants — device abstraction layer"],
  testimonial: { quote: "CiroStack modernized our factory operations. The predictive maintenance AI alone saved us €2.8M in the first year.", author: "Hans Müller", role: "Head of Ops, PrecisionMFG" },
  relatedProjects: [
    { id: "cloudops", title: "CloudOps Dashboard", description: "Multi-cloud management platform" },
    { id: "logistrack", title: "LogisTrack", description: "Fleet management and logistics platform" },
  ],
});

// ─── 13. LegalShield (Professional Services, Software Auditing) ─────────
add("legalshield", {
  title: "LegalShield Practice Management",
  client: "Morrison & Partners",
  industry: "Professional Services",
  category: "Platforms",
  service: "Software Auditing Services",
  country: "Canada",
  location: "Toronto, Canada",
  size: "Medium",
  duration: "8 weeks",
  year: "2024",
  description: "Full software audit and modernization roadmap for a 200-lawyer firm's legacy practice management system.",
  aboutClient: "Morrison & Partners is a mid-size Canadian law firm with 200 lawyers across 4 offices, specializing in corporate and IP law.",
  challenge: "Their 12-year-old practice management system was slow, insecure, and couldn't integrate with modern tools. Staff were using workarounds that created compliance risks.",
  solution: "We conducted a comprehensive software audit covering code quality, security, performance, and architecture. Delivered a phased modernization roadmap and implemented critical security patches immediately.",
  keyFeatures: [
    { feature: "Code Quality Audit", description: "Deep analysis of 500K+ lines of legacy code", benefit: "Identified 340 critical issues" },
    { feature: "Security Assessment", description: "Penetration testing and vulnerability scanning", benefit: "12 high-severity vulnerabilities patched" },
    { feature: "Performance Profiling", description: "Load testing and bottleneck identification", benefit: "3x faster response times post-optimization" },
    { feature: "Modernization Roadmap", description: "18-month phased migration plan with cost estimates", benefit: "Clear path to modern architecture" },
  ],
  result: "340 issues identified. 12 critical vulnerabilities patched. 3x faster after optimization.",
  metrics: [
    { value: "340", label: "Issues identified" },
    { value: "12", label: "Critical vulnerabilities fixed" },
    { value: "3x", label: "Faster performance" },
    { value: "18mo", label: "Modernization roadmap" },
  ],
  technologies: [
    { area: "Audit Tools", tools: ["SonarQube", "Checkmarx", "JProfiler"] },
    { area: "Testing", tools: ["JMeter", "Selenium", "Postman"] },
    { area: "Security", tools: ["OWASP ZAP", "Nessus"] },
    { area: "Documentation", tools: ["Confluence", "Lucidchart"] },
  ],
  process: [
    { phase: "Scoping", activities: "System inventory, stakeholder interviews, risk assessment", duration: "1 week" },
    { phase: "Audit", activities: "Code review, security testing, performance profiling", duration: "3 weeks" },
    { phase: "Remediation", activities: "Critical patch deployment, quick-win optimizations", duration: "2 weeks" },
    { phase: "Roadmap", activities: "Architecture design, phased plan, cost estimation, presentation", duration: "2 weeks" },
  ],
  whatClientLoved: ["The audit report was incredibly detailed and actionable", "Critical security issues were patched within days", "The modernization roadmap gave them budget clarity"],
  challengesOvercome: ["Auditing a codebase with no documentation — we reverse-engineered the architecture", "Balancing immediate fixes with long-term strategy — tiered priority framework"],
  testimonial: { quote: "CiroStack found vulnerabilities our previous vendor missed for years. Their modernization roadmap is now our IT strategy bible.", author: "Catherine Liu", role: "Managing Partner, Morrison & Partners" },
  relatedProjects: [
    { id: "docai", title: "DocAI Processor", description: "AI contract analysis for legal firms" },
    { id: "finguard", title: "FinGuard Platform", description: "Banking security platform" },
  ],
});

// ─── 14. StreamDeck (Media & Entertainment, Cloud Engineering) ──────────
add("streamdeck", {
  title: "StreamDeck Media Platform",
  client: "AfriStream",
  industry: "Media & Entertainment",
  category: "Cloud",
  service: "Cloud Engineering Service",
  country: "Nigeria",
  location: "Lagos, Nigeria",
  size: "Startup",
  duration: "16 weeks",
  year: "2025",
  description: "Netflix-calibre streaming platform with adaptive bitrate and edge caching serving 2M+ viewers across Africa.",
  aboutClient: "AfriStream is an African streaming service focused on original African content — movies, series, and documentaries — serving viewers across 15 countries.",
  challenge: "Their existing platform buffered constantly, had high CDN costs, and couldn't handle concurrent viewership spikes during original content premieres.",
  solution: "We re-architected the entire streaming backend with adaptive bitrate delivery, multi-region edge caching, and a microservices architecture that handles 500K concurrent streams.",
  keyFeatures: [
    { feature: "Adaptive Bitrate", description: "Automatic quality adjustment based on connection speed", benefit: "80% reduction in buffering" },
    { feature: "Edge Caching", description: "Content cached at 12 edge locations across Africa", benefit: "50% lower CDN costs" },
    { feature: "Live Streaming", description: "Low-latency live event broadcasting infrastructure", benefit: "Supports 500K concurrent viewers" },
    { feature: "Content Analytics", description: "Viewing habits, engagement metrics, content performance", benefit: "Data-driven content investment" },
  ],
  result: "80% less buffering. 50% lower CDN costs. 2M+ active subscribers.",
  metrics: [
    { value: "80%", label: "Less buffering" },
    { value: "50%", label: "Lower CDN costs" },
    { value: "2M+", label: "Subscribers" },
    { value: "500K", label: "Concurrent streams" },
  ],
  technologies: [
    { area: "Backend", tools: ["Go", "Kubernetes", "gRPC"] },
    { area: "Streaming", tools: ["HLS", "DASH", "FFmpeg"] },
    { area: "Cloud", tools: ["AWS", "CloudFront", "MediaConvert"] },
    { area: "Database", tools: ["Cassandra", "Redis"] },
  ],
  process: [
    { phase: "Architecture", activities: "Platform audit, streaming architecture design, edge strategy", duration: "3 weeks" },
    { phase: "Infrastructure", activities: "Multi-region setup, edge node deployment, CDN configuration", duration: "4 weeks" },
    { phase: "Backend", activities: "Microservices development, transcoding pipeline, analytics", duration: "7 weeks" },
    { phase: "Launch", activities: "Load testing, premiere stress test, gradual rollout", duration: "2 weeks" },
  ],
  whatClientLoved: ["Viewers in rural areas can now stream without buffering", "CDN costs dropped dramatically", "The analytics dashboard drives our content strategy"],
  challengesOvercome: ["Delivering quality streams over unreliable African internet — multi-CDN fallback", "Transcoding 10,000+ hours of content — distributed FFmpeg pipeline"],
  testimonial: { quote: "We went from a broken streaming backend to a Netflix-calibre experience in under 4 months. CiroStack's media engineering expertise is second to none.", author: "Isabelle Fontaine", role: "CTO, AfriStream" },
  relatedProjects: [
    { id: "eduspark", title: "EduSpark LMS", description: "Learning platform with video support" },
    { id: "sportspulse", title: "SportsPulse", description: "Live sports analytics" },
  ],
});

// ─── 15. GiveHub (Non-Profit, Digital Transformation) ───────────────────
add("givehub", {
  title: "GiveHub Donation Platform",
  client: "HopeFoundation",
  industry: "Non-Profit & Social Enterprise",
  category: "Platforms",
  service: "Digital Transformation Solutions",
  country: "USA",
  location: "New York, USA",
  size: "Non-Profit",
  duration: "12 weeks",
  year: "2024",
  description: "End-to-end digital transformation for a major non-profit, from paper-based donor management to a modern cloud platform.",
  aboutClient: "HopeFoundation is a non-profit serving 50,000+ beneficiaries across 12 countries with programs in education, clean water, and healthcare.",
  challenge: "Donor data was spread across Excel sheets, emails, and paper forms. They had no visibility into program impact and were losing donors due to poor communication.",
  solution: "We digitized their entire operation: CRM for donor management, impact tracking dashboard, automated email nurturing, and an online donation portal with recurring giving.",
  keyFeatures: [
    { feature: "Donor CRM", description: "Centralized donor management with giving history and engagement scoring", benefit: "40% increase in donor retention" },
    { feature: "Impact Dashboard", description: "Real-time visualization of program outcomes by region", benefit: "Compelling data for grant applications" },
    { feature: "Online Donations", description: "Responsive donation portal with recurring giving and gift matching", benefit: "60% increase in online donations" },
    { feature: "Automated Nurturing", description: "Email sequences triggered by donor behavior and milestones", benefit: "3x more donor engagement" },
  ],
  result: "60% increase in online donations. 40% better donor retention. $2M additional funding secured.",
  metrics: [
    { value: "60%", label: "More online donations" },
    { value: "40%", label: "Better donor retention" },
    { value: "$2M", label: "Additional funding" },
    { value: "12", label: "Countries supported" },
  ],
  technologies: [
    { area: "Frontend", tools: ["React", "TypeScript"] },
    { area: "Backend", tools: ["Node.js", "Express"] },
    { area: "CRM", tools: ["Custom CRM", "SendGrid"] },
    { area: "Payments", tools: ["Stripe", "PayPal"] },
  ],
  process: [
    { phase: "Discovery", activities: "Process mapping, stakeholder workshops, donor interviews", duration: "2 weeks" },
    { phase: "Design", activities: "CRM design, donation flow, impact dashboard mockups", duration: "3 weeks" },
    { phase: "Development", activities: "CRM build, donation portal, analytics, integrations", duration: "5 weeks" },
    { phase: "Training", activities: "Staff training, data migration, go-live support", duration: "2 weeks" },
  ],
  whatClientLoved: ["Finally having a single source of truth for donor data", "The impact dashboard transformed their grant applications", "Online donations surged immediately after launch"],
  challengesOvercome: ["Migrating 10 years of scattered data — custom ETL pipeline with deduplication", "Multi-currency donation support for 12 countries — intelligent currency handling"],
  testimonial: { quote: "CiroStack didn't just build us software — they transformed how we operate. Our donors are happier, our staff are more productive, and our impact data tells a powerful story.", author: "Sarah Mitchell", role: "Executive Director, HopeFoundation" },
  relatedProjects: [
    { id: "eduspark", title: "EduSpark LMS", description: "Education platform" },
    { id: "agriconnect", title: "AgriConnect", description: "Smart farming platform" },
  ],
});

// ─── 16. LaunchPad (Technology & Startups, Startups Service) ────────────
add("launchpad", {
  title: "LaunchPad MVP Platform",
  client: "TechVenture Labs",
  industry: "Technology & Startups",
  category: "MVP",
  service: "Software Development for Startups",
  country: "USA",
  location: "San Francisco, USA",
  size: "Startup",
  duration: "8 weeks",
  year: "2025",
  description: "Rapid MVP development for a Y Combinator-backed startup, going from idea to launched product in 8 weeks.",
  aboutClient: "TechVenture Labs is a YC-backed startup building an AI-powered hiring platform that matches candidates based on skills, culture fit, and growth potential.",
  challenge: "They had 12 weeks until their demo day and no technical team. They needed an MVP that could demonstrate product-market fit and handle real users.",
  solution: "We assembled a 4-person team and built a fully functional MVP with AI matching, candidate profiles, employer dashboards, and real-time messaging — shipped 4 weeks early.",
  keyFeatures: [
    { feature: "AI Matching Engine", description: "ML model matching candidates to roles based on 50+ signals", benefit: "3x better match quality than job boards" },
    { feature: "Employer Dashboard", description: "Pipeline management, analytics, and team collaboration", benefit: "Streamlined hiring workflow" },
    { feature: "Candidate Profiles", description: "Rich profiles with skills, projects, and culture indicators", benefit: "Beyond-the-resume insights" },
    { feature: "Real-time Messaging", description: "In-app chat between employers and candidates", benefit: "Faster hiring decisions" },
  ],
  result: "Shipped 4 weeks early. 500 users in first month. Secured $2.5M seed round.",
  metrics: [
    { value: "4wks", label: "Ahead of schedule" },
    { value: "500", label: "Users in month 1" },
    { value: "$2.5M", label: "Seed round raised" },
    { value: "8wks", label: "Idea to launch" },
  ],
  technologies: [
    { area: "Frontend", tools: ["React", "TypeScript", "Tailwind CSS"] },
    { area: "Backend", tools: ["Node.js", "Supabase"] },
    { area: "AI/ML", tools: ["OpenAI", "Python"] },
    { area: "Real-time", tools: ["WebSockets", "Redis"] },
  ],
  process: [
    { phase: "Sprint 0", activities: "Requirements, architecture, design system setup", duration: "1 week" },
    { phase: "Core Build", activities: "Authentication, profiles, matching engine", duration: "3 weeks" },
    { phase: "Features", activities: "Dashboard, messaging, notifications, analytics", duration: "3 weeks" },
    { phase: "Launch", activities: "Testing, deployment, demo day preparation", duration: "1 week" },
  ],
  whatClientLoved: ["We launched 4 weeks ahead of our YC demo day", "The AI matching wowed investors", "CiroStack moved faster than any team we've worked with"],
  challengesOvercome: ["Building a reliable matching algorithm with limited training data — few-shot learning approach", "Scaling WebSocket connections for real-time messaging — connection pooling"],
  testimonial: { quote: "CiroStack turned our napkin sketch into a funded startup. They shipped our MVP in 8 weeks and it was so good that investors fought to participate in our round.", author: "Michael Chen", role: "CEO, TechVenture Labs" },
  relatedProjects: [
    { id: "autotask", title: "AutoTask AI", description: "AI workflow automation" },
    { id: "fittrack", title: "FitTrack Pro", description: "Fitness tracking app" },
  ],
});

// ─── 17. AgriConnect (Agriculture, Data Engineering) ────────────────────
add("agriconnect", {
  title: "AgriConnect Smart Farming",
  client: "FarmTech Africa",
  industry: "Agriculture & Farming",
  category: "Data",
  service: "Data Engineering & Data Science",
  country: "Kenya",
  location: "Nairobi, Kenya",
  size: "Medium",
  duration: "14 weeks",
  year: "2024",
  description: "IoT data pipeline and analytics platform for precision agriculture across 10,000+ hectares of farmland.",
  aboutClient: "FarmTech Africa provides precision agriculture technology to commercial farms in East Africa, helping them optimize yields and reduce water usage.",
  challenge: "Farms generated terabytes of sensor data monthly but had no way to process, analyze, or act on it. Decisions were still made on intuition rather than data.",
  solution: "We built a real-time data pipeline that ingests IoT sensor data, runs predictive models for crop health and irrigation, and delivers actionable insights via mobile dashboards.",
  keyFeatures: [
    { feature: "IoT Data Pipeline", description: "Real-time ingestion from 5,000+ soil, weather, and crop sensors", benefit: "Sub-minute data freshness" },
    { feature: "Crop Health Prediction", description: "ML models predicting disease and pest risks 2 weeks in advance", benefit: "25% reduction in crop loss" },
    { feature: "Smart Irrigation", description: "AI-optimized watering schedules based on soil moisture and weather", benefit: "30% less water usage" },
    { feature: "Mobile Dashboards", description: "Farm managers access insights on their phones in the field", benefit: "Real-time decision making" },
  ],
  result: "25% less crop loss. 30% water savings. Processing 5,000+ sensors in real-time.",
  metrics: [
    { value: "25%", label: "Less crop loss" },
    { value: "30%", label: "Water savings" },
    { value: "5K+", label: "Sensors connected" },
    { value: "10K ha", label: "Farmland covered" },
  ],
  technologies: [
    { area: "Data", tools: ["Apache Kafka", "Apache Spark", "Airflow"] },
    { area: "AI/ML", tools: ["Python", "TensorFlow", "scikit-learn"] },
    { area: "Database", tools: ["TimescaleDB", "PostgreSQL"] },
    { area: "Mobile", tools: ["React Native"] },
  ],
  process: [
    { phase: "Discovery", activities: "Sensor audit, data mapping, agronomist interviews", duration: "2 weeks" },
    { phase: "Pipeline", activities: "Data ingestion, transformation, storage architecture", duration: "4 weeks" },
    { phase: "Models", activities: "ML model training, validation, deployment", duration: "5 weeks" },
    { phase: "Dashboards", activities: "Mobile app, alerts, reporting, farmer training", duration: "3 weeks" },
  ],
  whatClientLoved: ["The crop disease prediction saved an entire harvest season", "Farm managers love the mobile dashboards", "Water savings alone justified the investment"],
  challengesOvercome: ["Unreliable connectivity in rural areas — edge processing with batch sync", "Diverse sensor types and protocols — universal IoT adapter layer"],
  testimonial: { quote: "CiroStack turned our raw sensor data into a competitive advantage. The crop prediction model saved our entire maize harvest last season.", author: "Joseph Karanja", role: "CEO, FarmTech Africa" },
  relatedProjects: [
    { id: "greenleaf", title: "GreenLeaf Website", description: "Eco-tech startup website" },
    { id: "factoryiq", title: "FactoryIQ", description: "Smart manufacturing platform" },
  ],
});

// ─── 18. BuildSite Pro (Construction, Embedded Software) ────────────────
add("buildsite", {
  title: "BuildSite Pro",
  client: "ConstruTech",
  industry: "Construction & Engineering",
  category: "IoT",
  service: "Embedded Software Services",
  country: "Australia",
  location: "Sydney, Australia",
  size: "Enterprise",
  duration: "20 weeks",
  year: "2025",
  description: "Embedded software for IoT-connected construction site monitoring — safety compliance, equipment tracking, and environmental sensors.",
  aboutClient: "ConstruTech develops smart construction technology for major infrastructure projects across Australia and Southeast Asia.",
  challenge: "Construction sites lacked real-time visibility into worker safety, equipment location, and environmental conditions. Manual safety checks were inconsistent.",
  solution: "We developed embedded firmware for their IoT sensor network, a gateway system for aggregating data, and a cloud platform for real-time monitoring and alerts.",
  keyFeatures: [
    { feature: "Safety Monitoring", description: "Wearable sensors detecting falls, proximity to heavy machinery, and heat stress", benefit: "45% fewer safety incidents" },
    { feature: "Equipment Tracking", description: "GPS and BLE tracking for all heavy equipment across sites", benefit: "Zero equipment theft or loss" },
    { feature: "Environmental Sensors", description: "Dust, noise, and vibration monitoring for regulatory compliance", benefit: "100% compliance with EPA standards" },
    { feature: "Alert System", description: "Instant notifications to site managers for safety violations", benefit: "Sub-30-second response time" },
  ],
  result: "45% fewer safety incidents. 100% regulatory compliance. Deployed across 30 sites.",
  metrics: [
    { value: "45%", label: "Fewer incidents" },
    { value: "100%", label: "Compliance rate" },
    { value: "30", label: "Sites deployed" },
    { value: "<30s", label: "Alert response" },
  ],
  technologies: [
    { area: "Embedded", tools: ["C/C++", "FreeRTOS", "ESP32"] },
    { area: "Gateway", tools: ["Python", "MQTT", "Edge Computing"] },
    { area: "Cloud", tools: ["AWS IoT Core", "DynamoDB"] },
    { area: "Frontend", tools: ["React", "D3.js"] },
  ],
  process: [
    { phase: "Hardware Assessment", activities: "Sensor selection, prototype design, power analysis", duration: "3 weeks" },
    { phase: "Firmware", activities: "Embedded software development, communication protocols", duration: "6 weeks" },
    { phase: "Cloud Platform", activities: "IoT backend, data pipeline, dashboard development", duration: "8 weeks" },
    { phase: "Field Testing", activities: "On-site deployment, calibration, validation", duration: "3 weeks" },
  ],
  whatClientLoved: ["The safety wearables are comfortable enough that workers actually wear them", "Environmental compliance is now automatic", "The dashboard gives project managers real-time situational awareness"],
  challengesOvercome: ["Battery life on wearable sensors — ultra-low-power firmware with smart wake cycles", "Connectivity on remote construction sites — mesh networking with LoRa"],
  testimonial: { quote: "CiroStack's IoT solution made our sites the safest in Australia. Insurance premiums dropped and worker morale improved dramatically.", author: "Paul Henderson", role: "CTO, ConstruTech" },
  relatedProjects: [
    { id: "factoryiq", title: "FactoryIQ", description: "Smart manufacturing DevOps" },
    { id: "logistrack", title: "LogisTrack", description: "Fleet management platform" },
  ],
});

// ─── 19. LogisTrack (Transportation & Logistics, Automation Testing) ────
add("logistrack", {
  title: "LogisTrack Fleet Platform",
  client: "SwiftLogix",
  industry: "Transportation & Logistics",
  category: "Platforms",
  service: "Automation Testing Services",
  country: "Nigeria",
  location: "Lagos, Nigeria",
  size: "Enterprise",
  duration: "12 weeks",
  year: "2025",
  description: "Fleet management platform with comprehensive automated test suite ensuring 99.99% uptime for a 2,000-vehicle logistics fleet.",
  aboutClient: "SwiftLogix operates a fleet of 2,000+ delivery vehicles across West Africa, handling last-mile delivery for major e-commerce platforms.",
  challenge: "Their fleet management software had frequent bugs that caused routing errors, delivery delays, and driver frustration. Manual testing couldn't keep up with release cycles.",
  solution: "We built a comprehensive automated testing framework — unit, integration, E2E, and performance tests — that caught 95% of bugs before production. Also rebuilt critical modules.",
  keyFeatures: [
    { feature: "E2E Test Suite", description: "500+ automated end-to-end tests covering all critical flows", benefit: "95% of bugs caught pre-production" },
    { feature: "Performance Testing", description: "Load testing simulating 10,000 concurrent dispatches", benefit: "Guaranteed 99.99% uptime" },
    { feature: "CI/CD Integration", description: "Tests run automatically on every pull request", benefit: "30-minute feedback loops" },
    { feature: "Route Optimization", description: "AI-powered route planning rebuilt with TDD approach", benefit: "15% fuel savings" },
  ],
  result: "95% bug detection rate. 99.99% uptime achieved. 15% fuel savings from route optimization.",
  metrics: [
    { value: "95%", label: "Bugs caught pre-prod" },
    { value: "99.99%", label: "Uptime" },
    { value: "15%", label: "Fuel savings" },
    { value: "500+", label: "Automated tests" },
  ],
  technologies: [
    { area: "Testing", tools: ["Cypress", "Jest", "Playwright"] },
    { area: "CI/CD", tools: ["GitHub Actions", "Docker"] },
    { area: "Backend", tools: ["Node.js", "PostgreSQL"] },
    { area: "Frontend", tools: ["React", "TypeScript"] },
  ],
  process: [
    { phase: "Audit", activities: "Codebase review, bug analysis, test coverage assessment", duration: "2 weeks" },
    { phase: "Framework", activities: "Test architecture, CI/CD pipeline, fixture data", duration: "3 weeks" },
    { phase: "Implementation", activities: "500+ test cases, performance tests, monitoring", duration: "5 weeks" },
    { phase: "Handoff", activities: "Team training, documentation, test maintenance plan", duration: "2 weeks" },
  ],
  whatClientLoved: ["Deployments went from scary to boring — in the best way", "The route optimization alone saved millions in fuel", "Our developers now write tests voluntarily"],
  challengesOvercome: ["Testing real-time GPS tracking — built a GPS simulation framework", "Flaky tests from network dependencies — smart retry and mock strategies"],
  testimonial: { quote: "CiroStack turned our buggy software into the most reliable platform in West African logistics. Our 99.99% uptime is our competitive advantage.", author: "Adebayo Okonkwo", role: "CTO, SwiftLogix" },
  relatedProjects: [
    { id: "factoryiq", title: "FactoryIQ", description: "Smart manufacturing DevOps" },
    { id: "retailmax", title: "RetailMax POS", description: "Retail point-of-sale" },
  ],
});

// ─── 20. GovPortal (Government, IAM) ───────────────────────────────────
add("govportal", {
  title: "GovPortal Citizen Services",
  client: "State Digital Agency",
  industry: "Government & Public Sector",
  category: "Identity",
  service: "Identity & Access Management",
  country: "Nigeria",
  location: "Abuja, Nigeria",
  size: "Government",
  duration: "20 weeks",
  year: "2025",
  description: "Unified citizen identity and services portal with biometric authentication serving 5M+ residents.",
  aboutClient: "A state-level digital government agency tasked with modernizing public service delivery and creating a unified digital identity for all residents.",
  challenge: "Citizens needed to visit different offices for each government service, each requiring separate registration. No unified identity system existed, leading to fraud and inefficiency.",
  solution: "We built a unified citizen identity platform with biometric authentication, single sign-on across all government services, and role-based access for government employees.",
  keyFeatures: [
    { feature: "Biometric Authentication", description: "Fingerprint and facial recognition for secure citizen identity", benefit: "99.7% authentication accuracy" },
    { feature: "Single Sign-On", description: "One identity across all government digital services", benefit: "Citizens register once, access everything" },
    { feature: "Service Portal", description: "Online applications for permits, certificates, and licenses", benefit: "70% reduction in office visits" },
    { feature: "Role-Based Access", description: "Granular permissions for government employees across departments", benefit: "Zero unauthorized data access" },
  ],
  result: "5M+ citizens enrolled. 70% fewer office visits. Zero identity fraud incidents.",
  metrics: [
    { value: "5M+", label: "Citizens enrolled" },
    { value: "70%", label: "Fewer office visits" },
    { value: "0", label: "Fraud incidents" },
    { value: "99.7%", label: "Auth accuracy" },
  ],
  technologies: [
    { area: "IAM", tools: ["Keycloak", "OAuth 2.0", "OpenID Connect"] },
    { area: "Biometrics", tools: ["Python", "OpenCV", "TensorFlow"] },
    { area: "Backend", tools: ["Java", "Spring Boot", "PostgreSQL"] },
    { area: "Frontend", tools: ["React", "TypeScript"] },
  ],
  process: [
    { phase: "Requirements", activities: "Government stakeholder workshops, compliance review, security planning", duration: "4 weeks" },
    { phase: "Architecture", activities: "IAM design, biometric pipeline, security architecture", duration: "3 weeks" },
    { phase: "Development", activities: "Identity platform, service integrations, admin portal", duration: "10 weeks" },
    { phase: "Deployment", activities: "Phased rollout, citizen enrollment, staff training", duration: "3 weeks" },
  ],
  whatClientLoved: ["Citizens can now access all services with one login", "The biometric system is fast and accurate", "Fraud dropped to zero immediately"],
  challengesOvercome: ["Enrolling citizens with no existing digital identity — mobile enrollment teams", "Integrating with 20+ legacy government systems — API gateway with adapters"],
  testimonial: { quote: "CiroStack built the digital infrastructure that transformed how our state serves its citizens. 5 million people now access government services from their phones.", author: "Director Amara Obi", role: "Digital Agency Director" },
  relatedProjects: [
    { id: "finguard", title: "FinGuard Platform", description: "Banking security platform" },
    { id: "eduspark", title: "EduSpark LMS", description: "Education platform" },
  ],
});

// ─── 21. SportsPulse (Sports & Recreation, Generative AI) ──────────────
add("sportspulse", {
  title: "SportsPulse Analytics",
  client: "Premier League Club",
  industry: "Sports & Recreation",
  category: "AI",
  service: "Generative AI Development",
  country: "UK",
  location: "Manchester, UK",
  size: "Enterprise",
  duration: "10 weeks",
  year: "2025",
  description: "AI-powered sports analytics platform generating match insights, performance reports, and fan engagement content.",
  aboutClient: "A top-tier English Premier League football club with a global fanbase of 200M+ supporters, seeking to leverage AI for competitive advantage on and off the pitch.",
  challenge: "Match analysis was done manually by a small team, taking days per game. Fan content creation was slow and didn't keep up with social media demands.",
  solution: "We built an AI platform that automatically generates match analysis reports, player performance insights, and fan-facing content — from highlight reels to social media posts.",
  keyFeatures: [
    { feature: "Auto Match Analysis", description: "AI generates tactical analysis within 30 minutes of final whistle", benefit: "Coaching staff get insights 10x faster" },
    { feature: "Player Performance AI", description: "Generative reports on player fitness, form, and comparison", benefit: "Data-driven selection decisions" },
    { feature: "Fan Content Engine", description: "AI-generated social posts, match previews, and highlight narratives", benefit: "5x more content output" },
    { feature: "Scouting Reports", description: "AI-generated scouting dossiers from video analysis", benefit: "Wider talent pipeline" },
  ],
  result: "10x faster match analysis. 5x more fan content. Scouting pipeline expanded by 300%.",
  metrics: [
    { value: "10x", label: "Faster analysis" },
    { value: "5x", label: "More content" },
    { value: "300%", label: "Wider scouting" },
    { value: "30min", label: "Post-match reports" },
  ],
  technologies: [
    { area: "AI/ML", tools: ["OpenAI GPT-4", "Python", "LangChain"] },
    { area: "Video", tools: ["Computer Vision", "FFmpeg"] },
    { area: "Backend", tools: ["FastAPI", "PostgreSQL"] },
    { area: "Frontend", tools: ["React", "D3.js"] },
  ],
  process: [
    { phase: "Discovery", activities: "Coaching staff interviews, content team workshops, data audit", duration: "2 weeks" },
    { phase: "Model Development", activities: "Training custom models, prompt engineering, validation", duration: "3 weeks" },
    { phase: "Platform Build", activities: "Dashboard, content pipeline, integrations", duration: "4 weeks" },
    { phase: "Validation", activities: "Testing with real match data, coaching staff feedback", duration: "1 week" },
  ],
  whatClientLoved: ["Match analysis available before the team bus reaches the training ground", "The fan content engine keeps our social media feeds constantly active", "Scouting reports that used to take a week now take minutes"],
  challengesOvercome: ["Ensuring tactical accuracy — fine-tuned models with 5 years of match data", "Generating content in the club's unique voice — custom style transfer"],
  testimonial: { quote: "CiroStack gave us an AI advantage both on the pitch and on social media. Our coaching staff and content team are now powered by the same platform.", author: "Daniel Rhodes", role: "Head of Analytics" },
  relatedProjects: [
    { id: "fittrack", title: "FitTrack Pro", description: "Fitness tracking app" },
    { id: "autotask", title: "AutoTask AI", description: "AI workflow automation" },
  ],
});

// ─── 22. BeautyBook (Beauty & Personal Care, Nearshore) ─────────────────
add("beautybook", {
  title: "BeautyBook Platform",
  client: "GlowUp Inc.",
  industry: "Beauty & Personal Care",
  category: "Platforms",
  service: "US Nearshore Software Development",
  country: "USA",
  location: "Miami, USA",
  size: "Startup",
  duration: "16 weeks",
  year: "2024",
  description: "All-in-one salon management and booking platform built by a nearshore team, serving 3,000+ beauty professionals across the US.",
  aboutClient: "GlowUp Inc. is a beauty tech startup building tools for independent stylists, salon owners, and spa operators to manage bookings, payments, and client relationships.",
  challenge: "Their US-based team was too expensive to scale. They needed a cost-effective nearshore team that could work in the same timezone and deliver enterprise-quality software.",
  solution: "We provided a 5-person nearshore team in Lagos (overlapping US business hours) that built their entire platform — booking engine, POS integration, loyalty programs, and client management.",
  keyFeatures: [
    { feature: "Smart Booking", description: "AI-optimized scheduling that minimizes gaps and maximizes revenue", benefit: "25% more appointments per day" },
    { feature: "Client Management", description: "Full client profiles with preferences, history, and notes", benefit: "Personalized experiences that drive loyalty" },
    { feature: "Integrated Payments", description: "POS, tips, and commission tracking in one system", benefit: "Zero reconciliation headaches" },
    { feature: "Marketing Tools", description: "Automated review requests, email campaigns, social posting", benefit: "40% more repeat bookings" },
  ],
  result: "3,000+ professionals onboarded. 25% more daily appointments. 40% higher repeat booking rate.",
  metrics: [
    { value: "3K+", label: "Professionals" },
    { value: "25%", label: "More appointments" },
    { value: "40%", label: "Repeat bookings" },
    { value: "60%", label: "Cost savings vs US team" },
  ],
  technologies: [
    { area: "Frontend", tools: ["React", "Next.js", "Tailwind CSS"] },
    { area: "Backend", tools: ["Node.js", "Prisma", "PostgreSQL"] },
    { area: "Payments", tools: ["Stripe", "Square"] },
    { area: "Mobile", tools: ["React Native"] },
  ],
  process: [
    { phase: "Team Setup", activities: "Recruitment, timezone alignment, process setup", duration: "2 weeks" },
    { phase: "MVP", activities: "Core booking, profiles, payments", duration: "6 weeks" },
    { phase: "Features", activities: "Marketing tools, analytics, integrations", duration: "6 weeks" },
    { phase: "Scale", activities: "Performance optimization, launch, onboarding", duration: "2 weeks" },
  ],
  whatClientLoved: ["60% cost savings compared to our US team", "The nearshore team felt like they were in the next room", "Quality was indistinguishable from a Silicon Valley team"],
  challengesOvercome: ["Timezone coordination — 6-hour overlap window maximized for live collaboration", "Maintaining code quality remotely — strict code review and CI/CD practices"],
  testimonial: { quote: "CiroStack's nearshore team delivered better software at 60% of the cost. They're not a vendor — they're our engineering team.", author: "Jessica Torres", role: "CEO, GlowUp Inc." },
  relatedProjects: [
    { id: "retailmax", title: "RetailMax POS", description: "Smart retail POS system" },
    { id: "travelease", title: "TravelEase", description: "Travel booking app" },
  ],
});

// ─── 23. AutoDrive (Automotive, Outsourcing) ────────────────────────────
add("autodrive", {
  title: "AutoDrive Connected Car Platform",
  client: "MotorTech Solutions",
  industry: "Automotive",
  category: "IoT",
  service: "Software Development Outsourcing",
  country: "Germany",
  location: "Stuttgart, Germany",
  size: "Enterprise",
  duration: "24 weeks",
  year: "2025",
  description: "Connected vehicle platform with OTA updates, diagnostics, and fleet management for a European automaker's 50,000-vehicle fleet.",
  aboutClient: "MotorTech Solutions provides connected car technology for a major European automaker, managing software for 50,000+ vehicles across 8 countries.",
  challenge: "Their internal team couldn't keep up with the demand for connected car features. They needed a reliable outsourcing partner who understood automotive-grade software.",
  solution: "We provided a fully managed 8-person development team that built the connected vehicle platform — OTA update system, remote diagnostics, driver app, and fleet analytics.",
  keyFeatures: [
    { feature: "OTA Updates", description: "Secure over-the-air software updates for 50,000+ vehicles", benefit: "No dealer visits for software fixes" },
    { feature: "Remote Diagnostics", description: "Real-time vehicle health monitoring and predictive alerts", benefit: "40% fewer roadside breakdowns" },
    { feature: "Driver App", description: "Mobile app for vehicle control, status, and trip planning", benefit: "4.6★ app store rating" },
    { feature: "Fleet Analytics", description: "Aggregated insights for fleet managers and engineers", benefit: "Data-driven product decisions" },
  ],
  result: "50,000 vehicles connected. 40% fewer breakdowns. OTA updates saved €15M in recall costs.",
  metrics: [
    { value: "50K", label: "Vehicles connected" },
    { value: "40%", label: "Fewer breakdowns" },
    { value: "€15M", label: "Recall cost savings" },
    { value: "4.6★", label: "Driver app rating" },
  ],
  technologies: [
    { area: "Backend", tools: ["Java", "Spring Boot", "Kafka"] },
    { area: "IoT", tools: ["MQTT", "AWS IoT Core", "Edge Computing"] },
    { area: "Mobile", tools: ["Flutter", "Kotlin"] },
    { area: "Data", tools: ["Apache Spark", "Elasticsearch"] },
  ],
  process: [
    { phase: "Onboarding", activities: "Domain training, process alignment, access setup", duration: "3 weeks" },
    { phase: "OTA System", activities: "Update pipeline, security, rollback mechanisms", duration: "8 weeks" },
    { phase: "Diagnostics & App", activities: "Remote monitoring, driver app, notifications", duration: "10 weeks" },
    { phase: "Analytics", activities: "Fleet dashboard, reporting, data warehouse", duration: "3 weeks" },
  ],
  whatClientLoved: ["The OTA system saved us from a €15M recall", "Our outsourced team integrates perfectly with internal engineers", "Automotive-grade quality from day one"],
  challengesOvercome: ["Meeting automotive safety standards (ISO 26262) — rigorous testing protocols", "Managing OTA updates across 8 countries with different regulations — region-aware deployment"],
  testimonial: { quote: "CiroStack's team writes automotive-grade software that our internal engineers trust completely. The OTA system alone saved us from a €15M recall.", author: "Klaus Weber", role: "VP Engineering, MotorTech Solutions" },
  relatedProjects: [
    { id: "buildsite", title: "BuildSite Pro", description: "IoT construction monitoring" },
    { id: "factoryiq", title: "FactoryIQ", description: "Smart manufacturing" },
  ],
});

// ─── 24. SmallBizOS (Small Business, AI/ML Services) ────────────────────
add("smallbizos", {
  title: "SmallBizOS All-in-One Platform",
  client: "SME Alliance",
  industry: "Small Business Solutions",
  category: "AI",
  service: "AI & ML Development Services",
  country: "USA",
  location: "Atlanta, USA",
  size: "SMB",
  duration: "14 weeks",
  year: "2025",
  description: "AI-powered all-in-one business management platform for small businesses — invoicing, CRM, bookkeeping, and smart insights.",
  aboutClient: "SME Alliance is a business services company helping 10,000+ small businesses across the US Southeast with technology, consulting, and networking.",
  challenge: "Their small business members used 5-7 different tools for invoicing, CRM, bookkeeping, and analytics. The cost and complexity were overwhelming for non-technical owners.",
  solution: "We built an all-in-one platform with AI-powered bookkeeping, smart invoicing, CRM, and business insights — designed to be simpler than any individual tool.",
  keyFeatures: [
    { feature: "AI Bookkeeping", description: "Automatic categorization of expenses and revenue from bank feeds", benefit: "Save 10+ hours per month on accounting" },
    { feature: "Smart Invoicing", description: "One-click invoicing with automated follow-ups and payment links", benefit: "40% faster payment collection" },
    { feature: "Simple CRM", description: "Customer management designed for non-technical users", benefit: "2x more repeat business" },
    { feature: "Business Insights", description: "AI-generated weekly business health reports with recommendations", benefit: "Data-driven decisions without data skills" },
  ],
  result: "10,000+ businesses onboarded. $50M processed in invoices. Average user saves 10+ hours/month.",
  metrics: [
    { value: "10K+", label: "Businesses" },
    { value: "$50M", label: "Invoices processed" },
    { value: "10hrs", label: "Monthly time saved" },
    { value: "40%", label: "Faster payments" },
  ],
  technologies: [
    { area: "Frontend", tools: ["React", "TypeScript", "Tailwind CSS"] },
    { area: "Backend", tools: ["Node.js", "Prisma", "PostgreSQL"] },
    { area: "AI", tools: ["OpenAI", "Python", "Plaid API"] },
    { area: "Payments", tools: ["Stripe", "QuickBooks API"] },
  ],
  process: [
    { phase: "Research", activities: "Small business owner interviews, competitor analysis, feature prioritization", duration: "2 weeks" },
    { phase: "Design", activities: "Simplicity-first UX, prototype testing with real business owners", duration: "3 weeks" },
    { phase: "Development", activities: "Core platform, AI models, integrations, payments", duration: "7 weeks" },
    { phase: "Launch", activities: "Beta with 100 businesses, feedback iteration, full launch", duration: "2 weeks" },
  ],
  whatClientLoved: ["Business owners with zero tech skills can use it immediately", "The AI bookkeeping eliminates their biggest pain point", "Replacing 5 tools with one saved them hundreds per month"],
  challengesOvercome: ["Making AI bookkeeping accurate enough for tax purposes — fine-tuned on 1M+ real transactions", "Building for non-technical users — extensive usability testing with real business owners"],
  testimonial: { quote: "CiroStack built the platform our members have been begging for. 10,000 businesses are now running more efficiently, and our retention has never been higher.", author: "Robert Harris", role: "CEO, SME Alliance" },
  relatedProjects: [
    { id: "launchpad", title: "LaunchPad MVP", description: "Rapid MVP development" },
    { id: "givehub", title: "GiveHub", description: "Non-profit digital transformation" },
  ],
});

// ─── 25. CloudOps Dashboard (Multi-cloud, Cloud Engineering) ────────────
add("cloudops", {
  title: "CloudOps Multi-Cloud Dashboard",
  client: "CloudFirst Technologies",
  industry: "Technology & Startups",
  category: "Cloud",
  service: "Cloud Engineering Service",
  country: "USA",
  location: "Seattle, USA",
  size: "Enterprise",
  duration: "16 weeks",
  year: "2024",
  description: "Unified multi-cloud management platform providing cost optimization, security, and governance across AWS, Azure, and GCP.",
  aboutClient: "CloudFirst Technologies is a managed cloud services provider serving 200+ mid-market enterprises with multi-cloud strategies.",
  challenge: "Managing client infrastructure across 3 cloud providers was chaotic. Each had different dashboards, billing, and security models. Engineers wasted hours switching contexts.",
  solution: "We built a unified dashboard that aggregates resources, costs, security posture, and compliance status across all three major clouds into a single pane of glass.",
  keyFeatures: [
    { feature: "Unified Dashboard", description: "Single view across AWS, Azure, and GCP resources", benefit: "80% less context switching" },
    { feature: "Cost Optimization", description: "AI-powered recommendations for right-sizing and reserved instances", benefit: "Average 30% cost reduction" },
    { feature: "Security Posture", description: "Cross-cloud security scoring with automated remediation", benefit: "Unified compliance view" },
    { feature: "Automated Governance", description: "Policy enforcement across all cloud environments", benefit: "Zero policy violations" },
  ],
  result: "30% average cost reduction. 80% less context switching. Zero security policy violations.",
  metrics: [
    { value: "30%", label: "Cost reduction" },
    { value: "200+", label: "Clients managed" },
    { value: "80%", label: "Less context switching" },
    { value: "0", label: "Policy violations" },
  ],
  technologies: [
    { area: "Frontend", tools: ["React", "TypeScript", "Recharts"] },
    { area: "Backend", tools: ["Go", "gRPC", "PostgreSQL"] },
    { area: "Cloud APIs", tools: ["AWS SDK", "Azure SDK", "GCP SDK"] },
    { area: "Infrastructure", tools: ["Kubernetes", "Terraform"] },
  ],
  process: [
    { phase: "Discovery", activities: "Cloud landscape audit, pain point analysis, API assessment", duration: "2 weeks" },
    { phase: "Architecture", activities: "Multi-cloud abstraction layer, data model, security design", duration: "3 weeks" },
    { phase: "Development", activities: "Dashboard, cost engine, security scoring, governance", duration: "9 weeks" },
    { phase: "Rollout", activities: "Beta with 10 clients, iteration, full deployment", duration: "2 weeks" },
  ],
  whatClientLoved: ["One dashboard instead of three — engineers are 80% more productive", "The cost optimization recommendations are incredibly accurate", "Automated governance means no more manual audits"],
  challengesOvercome: ["Normalizing resource models across 3 clouds — universal resource abstraction", "Real-time cost data with different billing cycles — intelligent caching and estimation"],
  testimonial: { quote: "CiroStack built the multi-cloud tool we've been dreaming of. Our engineers manage 3x more infrastructure with less effort.", author: "Aiden Park", role: "CEO, CloudFirst Technologies" },
  relatedProjects: [
    { id: "propview", title: "PropView", description: "Cloud-native real estate platform" },
    { id: "factoryiq", title: "FactoryIQ", description: "Smart manufacturing DevOps" },
  ],
});
