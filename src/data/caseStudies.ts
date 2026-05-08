import imgHealthflow from "@/assets/portfolio-healthflow.jpg";
import imgShoplocal from "@/assets/portfolio-shoplocal.jpg";
import imgAutotask from "@/assets/portfolio-autotask.jpg";
import imgFittrack from "@/assets/portfolio-fittrack.jpg";
import imgGreenleaf from "@/assets/portfolio-greenleaf.jpg";
import imgPropview from "@/assets/portfolio-propview.jpg";
import imgEduspark from "@/assets/portfolio-eduspark.jpg";
import imgBeautybook from "@/assets/portfolio-beautybook.jpg";
import imgAutodrive from "@/assets/portfolio-autodrive.jpg";

const imageMap: Record<string, string> = {
  healthflow: imgHealthflow, shoplocal: imgShoplocal, autotask: imgAutotask,
  fittrack: imgFittrack, greenleaf: imgGreenleaf, propview: imgPropview,
  eduspark: imgEduspark, beautybook: imgBeautybook, autodrive: imgAutodrive,
};

export type ProjectEntry = {
  title: string;
  client: string;
  vertical: string;
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
  vertical: "Healthtech Startups",
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
  challengesOvercome: ["Integrating with legacy EHR systems: we built custom data bridges", "Ensuring real-time sync with unreliable internet: offline-first architecture"],
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
  vertical: "E-commerce & Retail",
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
  challengesOvercome: ["Supporting multiple payment providers: we built an abstraction layer", "Handling high traffic on launch day: pre-scaled infrastructure"],
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
  vertical: "B2B SaaS",
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
  challengesOvercome: ["Handling poorly scanned documents: pre-processing and OCR enhancement", "Integrating with a 15-year-old ERP: we built a database bridge"],
  relatedProjects: [
    { id: "docai", title: "DocAI Processor", description: "AI-powered document analysis for legal firms" },
    { id: "healthflow", title: "HealthFlow Dashboard", description: "Patient management with AI insights" },
  ],
});

// ─── 4. FitTrack Pro (Health & Fitness, Apps) ───────────────────────────
add("fittrack", {
  title: "FitTrack Pro",
  client: "Fitness Brand",
  vertical: "Healthtech Startups",
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
  challengesOvercome: ["Syncing across multiple wearable platforms: unified health data abstraction", "Keeping app size small: aggressive code splitting and lazy loading"],
  relatedProjects: [
    { id: "healthflow", title: "HealthFlow Dashboard", description: "Patient management with real-time analytics" },
    { id: "sportspulse", title: "SportsPulse Analytics", description: "Real-time sports analytics platform" },
  ],
});

// ─── 5. GreenLeaf Website (Clean Tech, Websites) ───────────────────────
add("greenleaf", {
  title: "GreenLeaf Website",
  client: "Sustainability Startup",
  vertical: "Consumer Apps",
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
  challengesOvercome: ["Maintaining fast load times with 3D animations: progressive loading and LOD", "Making the carbon calculator accurate: collaborated with their data science team"],
  relatedProjects: [
    { id: "shoplocal", title: "ShopLocal Marketplace", description: "Multi-vendor e-commerce platform" },
    { id: "agriconnect", title: "AgriConnect Platform", description: "Smart farming management system" },
  ],
});

// ─── 6. DocAI Processor (Legal, AI) ─────────────────────────────────────
add("propview", {
  title: "PropView Real Estate Platform",
  client: "UrbanNest Realty",
  vertical: "Proptech Startups",
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
  challengesOvercome: ["Migrating 2TB of property images without downtime: incremental sync strategy", "Maintaining SEO rankings during domain changes: 301 redirect automation"],
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
  vertical: "Edtech Startups",
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
  challengesOvercome: ["Migrating 5 years of student data: incremental migration with zero data loss", "Building real-time collaboration at scale: custom WebRTC signaling server"],
  testimonial: { quote: "The CiroStack team integrated seamlessly with our engineers. The new LMS handles 50,000 students without breaking a sweat.", author: "Professor Laura Vance", role: "CTO, EduPrime" },
  relatedProjects: [
    { id: "healthflow", title: "HealthFlow Dashboard", description: "Patient management dashboard" },
    { id: "govportal", title: "GovPortal", description: "Citizen services platform" },
  ],
});

// ─── 11. TravelEase (Hospitality & Tourism, Mobile Apps) ────────────────
add("beautybook", {
  title: "BeautyBook Platform",
  client: "GlowUp Inc.",
  vertical: "Consumer Apps",
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
  solution: "We provided a 5-person nearshore team in Lagos (overlapping US business hours) that built their entire platform: booking engine, POS integration, loyalty programs, and client management.",
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
  challengesOvercome: ["Timezone coordination: 6-hour overlap window maximized for live collaboration", "Maintaining code quality remotely: strict code review and CI/CD practices"],
  testimonial: { quote: "CiroStack's nearshore team delivered better software at 60% of the cost. They're not a vendor: they're our engineering team.", author: "Jessica Torres", role: "CEO, GlowUp Inc." },
  relatedProjects: [
    { id: "retailmax", title: "RetailMax POS", description: "Smart retail POS system" },
    { id: "travelease", title: "TravelEase", description: "Travel booking app" },
  ],
});

// ─── 23. AutoDrive (Automotive, Outsourcing) ────────────────────────────
add("autodrive", {
  title: "AutoDrive Connected Car Platform",
  client: "MotorTech Solutions",
  vertical: "Logistics & Supply Chain",
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
  solution: "We provided a fully managed 8-person development team that built the connected vehicle platform: OTA update system, remote diagnostics, driver app, and fleet analytics.",
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
  challengesOvercome: ["Meeting automotive safety standards (ISO 26262): rigorous testing protocols", "Managing OTA updates across 8 countries with different regulations: region-aware deployment"],
  testimonial: { quote: "CiroStack's team writes automotive-grade software that our internal engineers trust completely. The OTA system alone saved us from a €15M recall.", author: "Klaus Weber", role: "VP Engineering, MotorTech Solutions" },
  relatedProjects: [
    { id: "buildsite", title: "BuildSite Pro", description: "IoT construction monitoring" },
    { id: "factoryiq", title: "FactoryIQ", description: "Smart manufacturing" },
  ],
});

// ─── 24. SmallBizOS (Small Business, AI/ML Services) ────────────────────
