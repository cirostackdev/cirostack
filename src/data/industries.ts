import {
    ShoppingCart, HeartPulse, Landmark, Building2, GraduationCap,
    Palmtree, Factory, Briefcase, Film, HeartHandshake,
    Laptop, Sprout, HardHat, Truck, Landmark as GovtIcon,
    Trophy, Sparkles, Car, Scale, Store
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type IndustryValueProp = {
    title: string;
    description: string;
};

export type IndustrySolution = {
    title: string;
    description: string;
};

export type IndustryStat = {
    value: string;
    label: string;
};

export type IndustryEntry = {
    id: string; // Internal id matching the navbar category label simplified
    icon: LucideIcon;
    title: string;
    tagline: string;
    introSummary: string;
    description: string;
    challenges: string[];
    solutions: IndustrySolution[];
    valueProps: IndustryValueProp[];
    stats: IndustryStat[];
};

export const industriesData: Record<string, IndustryEntry> = {
    "retail-and-e-commerce": {
        id: "retail-and-e-commerce",
        icon: ShoppingCart,
        title: "Retail & E-Commerce",
        tagline: "Drive sales and build loyalty with next-generation retail experiences.",
        introSummary: "We help retail and e-commerce brands create seamless omnichannel experiences, optimize supply chains, and leverage customer data for hyper-personalized shopping journeys.",
        description: "The modern consumer expects a frictionless shopping experience across all touchpoints. CiroStack builds high-performance e-commerce platforms, smart inventory systems, and immersive digital storefronts that turn browsers into lifelong brand advocates.",
        challenges: [
            "Cart abandonment and low conversion rates",
            "Siloed customer data across channels",
            "Inefficient inventory and fulfillment operations",
            "Slow website performance during peak traffic"
        ],
        solutions: [
            { title: "Omnichannel Commerce", description: "Unified commerce architectures that seamlessly connect online, mobile, and in-store experiences." },
            { title: "Personalization Engines", description: "AI-driven product recommendations and dynamic pricing models based on real-time user behavior." },
            { title: "Supply Chain Visibility", description: "Real-time inventory tracking and predictive analytics to optimize stock levels and reduce fulfillment costs." },
            { title: "Headless Commerce", description: "Decoupled frontend architectures for lightning-fast page loads and unparalleled flexibility." }
        ],
        valueProps: [
            { title: "Increased Conversions", description: "Our clients see an average 25% increase in conversion rates post-transformation." },
            { title: "Scalability", description: "Platforms built to handle Black Friday levels of traffic without a hitch." },
            { title: "Data-Driven Insights", description: "actionable analytics dashboards that provide a 360-degree view of your customer." }
        ],
        stats: [
            { value: "40%", label: "Avg. Revenue Lift" },
            { value: "99.99%", label: "Uptime SLA" },
            { value: "<1s", label: "Page Load Time" },
            { value: "50+", label: "Retail Brands Supported" }
        ]
    },
    "healthcare-and-medical": {
        id: "healthcare-and-medical",
        icon: HeartPulse,
        title: "Healthcare & Medical",
        tagline: "Secure, compliant technology for better patient outcomes.",
        introSummary: "We build HIPAA-compliant telemedicine platforms, EMR integrations, and patient portals that streamline care delivery, reduce administrative burden, and prioritize data security.",
        description: "The healthcare sector requires technology that balances patient accessibility with unbreakable data security. CiroStack develops robust medical software solutions—from remote monitoring applications to complex billing systems—designed to empower providers and improve patient care.",
        challenges: [
            "Strict compliance requirements (HIPAA, GDPR)",
            "Fragmented patient health records",
            "Inefficient appointment and billing workflows",
            "Lack of secure remote care options"
        ],
        solutions: [
            { title: "Telehealth Platforms", description: "Secure video conferencing and remote patient monitoring tools integrated with clinical workflows." },
            { title: "EMR/EHR Integrations", description: "Seamless data exchange between disparate healthcare systems using HL7 and FHIR standards." },
            { title: "Patient Portals", description: "Intuitive self-service apps for scheduling, prescription refills, and lab result access." },
            { title: "Healthcare Analytics", description: "Predictive models to identify high-risk patients and optimize hospital resource allocation." }
        ],
        valueProps: [
            { title: "Compliance First", description: "Security and compliance are built into the foundation of every application we develop." },
            { title: "Interoperability", description: "We break down data silos to provide a unified view of patient health." },
            { title: "Enhanced Engagement", description: "Tools that empower patients to take an active role in their own healthcare journey." }
        ],
        stats: [
            { value: "100%", label: "HIPAA Compliant" },
            { value: "30%", label: "Drop in No-Shows" },
            { value: "5M+", label: "Patient Records Secured" },
            { value: "24/7", label: "Monitoring Available" }
        ]
    },
    "financial-services": {
        id: "financial-services",
        icon: Landmark,
        title: "Financial Services",
        tagline: "Secure, agile technology for the future of finance.",
        introSummary: "From digital banking to complex trading platforms, we deliver high-performance, compliant fintech solutions that meet the rigorous demands of the financial sector.",
        description: "The financial industry operates on trust, speed, and absolute accuracy. CiroStack partners with banks, credit unions, and fintech startups to modernize legacy systems, implement robust cybersecurity measures, and launch innovative financial products quickly.",
        challenges: [
            "Regulatory compliance and reporting (SOC2, PCI-DSS)",
            "Legacy system modernization without downtime",
            "Real-time fraud detection and prevention",
            "Delivering modern, mobile-first banking experiences"
        ],
        solutions: [
            { title: "Digital Banking Hubs", description: "Modern, secure web and mobile applications that provide intuitive financial management." },
            { title: "Payment Processing", description: "High-throughput, low-latency transaction engines integrating with major gateways and networks." },
            { title: "Risk & Fraud AI", description: "Machine learning models that analyze transaction patterns to detect and block anomalies in real-time." },
            { title: "Wealth Tech", description: "Robo-advisory platforms and portfolio management tools for modern investors." }
        ],
        valueProps: [
            { title: "Uncompromising Security", description: "Enterprise-grade encryption and architectural best practices to protect sensitive financial data." },
            { title: "High Availablity", description: "Distributed systems designed for zero downtime and massive concurrent transaction volume." },
            { title: "Rapid Innovation", description: "Agile methodologies that help established institutions compete with nimble fintech startups." }
        ],
        stats: [
            { value: "<50ms", label: "Transaction Latency" },
            { value: "PCI-DSS", label: "Certified Builds" },
            { value: "$10B+", label: "Processed Annually" },
            { value: "15+", label: "Fintech Partners" }
        ]
    },
    "real-estate-and-property": {
        id: "real-estate-and-property",
        icon: Building2,
        title: "Real Estate & Property",
        tagline: "PropTech solutions that transform how properties are bought, sold, and managed.",
        introSummary: "We build intuitive platforms for property search, complex portfolio management tools, and seamless CRM integrations that empower real estate professionals.",
        description: "The real estate market is shifting rapidly towards digital-first experiences. CiroStack creates PropTech software that streamlines the entire property lifecycle—from initial search and virtual tours to lease management and ongoing facility operations.",
        challenges: [
            "Fragmented property listing data (MLS integration)",
            "Cumbersome document and signature workflows",
            "Inefficient tenant and facility management",
            "Providing engaging virtual property touring"
        ],
        solutions: [
            { title: "Property Portals", description: "High-performance search engines with advanced filtering, map integrations, and instant alerts." },
            { title: "Real Estate CRM", description: "Custom relationship management tools built specifically for brokerages and development teams." },
            { title: "Property Management Systems", description: "End-to-end platforms for rent collection, maintenance requests, and tenant communication." },
            { title: "Document Automation", description: "Streamlined, compliant workflows for generating leases, contracts, and electronic signatures." }
        ],
        valueProps: [
            { title: "Faster Closings", description: "Digital workflows that significantly reduce the time from listing to signed contract." },
            { title: "Better Visualization", description: "Integration of 3D tours and AR tools to help buyers explore properties remotely." },
            { title: "Operational Efficiency", description: "Automated back-office tasks that free up agents to focus on client relationships." }
        ],
        stats: [
            { value: "3x", label: "Lead Conversion" },
            { value: "50%", label: "Faster Transactions" },
            { value: "500K+", label: "Listings Processed" },
            { value: "MLS", label: "Fully Integrated" }
        ]
    },
    "education-and-e-learning": {
        id: "education-and-e-learning",
        icon: GraduationCap,
        title: "Education & E-Learning",
        tagline: "Engaging EdTech platforms that make learning accessible and effective.",
        introSummary: "We develop scalable learning management systems, interactive classrooms, and educational corporate training portals that drive knowledge retention.",
        description: "Education is no longer confined to the classroom. CiroStack builds intuitive, accessible, and highly interactive EdTech solutions. Whether for primary education, university systems, or corporate upskilling, we craft platforms that foster deep engagement.",
        challenges: [
            "Low learner engagement and high dropout rates",
            "Scaling video delivery for remote classrooms",
            "Tracking student progress and learning outcomes",
            "Accessibility compliance (WCAG)"
        ],
        solutions: [
            { title: "Learning Management Systems (LMS)", description: "Custom platforms for course creation, delivery, and robust student assessment." },
            { title: "Virtual Classrooms", description: "Interactive, low-latency video environments with whiteboarding and collaboration tools." },
            { title: "Adaptive Learning", description: "AI-driven algorithms that personalize the curriculum pace based on individual student performance." },
            { title: "Corporate Training Portals", description: "Scalable upskilling platforms integrated with HR systems to track employee development." }
        ],
        valueProps: [
            { title: "Universal Accessibility", description: "Platforms built from the ground up to meet strict accessibility standards for all learners." },
            { title: "Scalable Infrastructure", description: "Architecture designed to handle massive spikes in simultaneous users during peak exam periods." },
            { title: "Data-Driven Education", description: "Granular analytics that help educators identify struggling students early." }
        ],
        stats: [
            { value: "2M+", label: "Active Learners" },
            { value: "40%", label: "Higher Completion Rate" },
            { value: "WCAG 2.1", label: "Compliant" },
            { value: "99.9%", label: "Video Uptime" }
        ]
    },
    "hospitality-and-tourism": {
        id: "hospitality-and-tourism",
        icon: Palmtree,
        title: "Hospitality & Tourism",
        tagline: "Digital experiences as memorable as the destinations themselves.",
        introSummary: "We create seamless booking engines, personalized travel apps, and dynamic management systems that elevate the guest experience from planning to departure.",
        description: "In the hospitality industry, the digital experience is the first impression. CiroStack helps hotels, agencies, and tour operators build frictionless booking flows, personalized loyalty programs, and operation tools that ensure a perfect stay.",
        challenges: [
            "Complex booking and dynamic pricing logic",
            "Dependency on third-party OTAs (Online Travel Agencies)",
            "Fragmented guest communication channels",
            "Managing highly variable seasonal inventory"
        ],
        solutions: [
            { title: "Direct Booking Engines", description: "High-conversion reservation systems that reduce reliance on costly third-party platforms." },
            { title: "Guest Experience Apps", description: "Mobile applications for mobile check-in, digital room keys, and on-property requests." },
            { title: "Channel Management", description: "Centralized systems to synchronize rates and availability across all distribution channels." },
            { title: "Loyalty Platforms", description: "Custom rewards programs that incentivize direct bookings and increase customer lifetime value." }
        ],
        valueProps: [
            { title: "Increased Direct Revenue", description: "Strategies and UX designs optimized specifically to drive commission-free direct bookings." },
            { title: "Personalized Stays", description: "Data tools that allow staff to anticipate guest needs based on previous preferences." },
            { title: "Operational Clarity", description: "Unified dashboards that give management real-time visibility into occupancy and revenue." }
        ],
        stats: [
            { value: "25%", label: "More Direct Bookings" },
            { value: "4.8/5", label: "Avg. App Rating" },
            { value: "10M+", label: "Nights Booked" },
            { value: "Global", label: "CDN Delivery" }
        ]
    },
    "manufacturing-and-industrial": {
        id: "manufacturing-and-industrial",
        icon: Factory,
        title: "Manufacturing & Industrial",
        tagline: "Industry 4.0 solutions that drive efficiency and predictive performance.",
        introSummary: "We connect factory floors, optimize supply chains, and implement predictive analytics to transform traditional manufacturing into smart, data-driven operations.",
        description: "The future of manufacturing is connected. CiroStack partners with industrial clients to implement IIoT (Industrial Internet of Things), digitize legacy processes, and harness machine data to minimize downtime and maximize yield.",
        challenges: [
            "Siloed legacy operational systems (OT)",
            "Unplanned equipment downtime",
            "Opaque supply chain and inventory visibility",
            "Quality control inconsistencies"
        ],
        solutions: [
            { title: "IIoT Dashboards", description: "Real-time visualization of machine performance, energy consumption, and production metrics." },
            { title: "Predictive Maintenance", description: "Machine learning models utilizing sensor data to predict and prevent equipment failure." },
            { title: "Supply Chain Integrations", description: "End-to-end tracking systems connecting suppliers, massive warehouses, and distribution centers." },
            { title: "Digital Twins", description: "Virtual replicas of physical assets to simulate scenarios and optimize production flows." }
        ],
        valueProps: [
            { title: "Reduced Downtime", description: "Shift from reactive repairs to proactive maintenance, saving millions in lost production." },
            { title: "IT/OT Convergence", description: "Bridging the gap between corporate IT systems and factory floor operational technology." },
            { title: "Improved Quality", description: "Automated defect detection using computer vision and edge computing." }
        ],
        stats: [
            { value: "40%", label: "Less Downtime" },
            { value: "15%", label: "Yield Improvement" },
            { value: "10K+", label: "Sensors Managed" },
            { value: "ERP", label: "Deep Integration" }
        ]
    },
    "professional-services": {
        id: "professional-services",
        icon: Briefcase,
        title: "Professional Services",
        tagline: "Streamlined operational software for consultancies, agencies, and firms.",
        introSummary: "We build bespoke tools for project management, resource allocation, and client communication that help professional service firms scale efficiently.",
        description: "For agencies, law firms, and consultancies, time is the ultimate currency. CiroStack develops tailored operational platforms that eliminate administrative overhead, optimize resource utilization, and provide transparent client reporting.",
        challenges: [
            "Inefficient time tracking and billing processes",
            "Poor resource allocation and capacity planning",
            "Fragmented client communication and document sharing",
            "Lack of real-time profitability insights"
        ],
        solutions: [
            { title: "Agency Management Systems", description: "Custom ERPs combining project management, time tracking, and invoicing in one hub." },
            { title: "Client Portals", description: "Secure, branded environments for clients to view project progress, approve deliverables, and communicate." },
            { title: "Resource Planning", description: "Visual capacity planning tools to ensure the right talent is assigned to the right projects." },
            { title: "Automated Reporting", description: "Dynamic dashboards generating real-time insights on utilization rates and project margins." }
        ],
        valueProps: [
            { title: "Higher Margins", description: "Identify scope creep early and optimize billing to increase overall firm profitability." },
            { title: "Seamless Collaboration", description: "Centralized tools that break down silos between distributed teams." },
            { title: "Professional Polish", description: "Client-facing portals that reinforce your brand's commitment to quality and transparency." }
        ],
        stats: [
            { value: "20%", label: "Margin Increase" },
            { value: "5hrs/wk", label: "Admin Time Saved" },
            { value: "100%", label: "Time Auditable" },
            { value: "SSO", label: "Enterprise Ready" }
        ]
    },
    "media-and-entertainment": {
        id: "media-and-entertainment",
        icon: Film,
        title: "Media & Entertainment",
        tagline: "Scalable content platforms that captivate global audiences.",
        introSummary: "We engineer high-performance streaming architectures, dynamic publishing platforms, and personalized content engines that handle massive traffic with ease.",
        description: "In media, content is king, but delivery is the kingdom. CiroStack builds scalable, globally distributed platforms for broadcasters, publishers, and creators to deliver rich media experiences to millions of concurrent users flawlessly.",
        challenges: [
            "Handling massive, unpredictable traffic spikes",
            "Global video delivery with low latency",
            "Implementing effective paywalls and monetization",
            "Managing complex digital rights (DRM)"
        ],
        solutions: [
            { title: "Video Streaming Platforms", description: "Adaptive bitrate streaming architectures with global CDN integration for flawless playback." },
            { title: "Headless CMS", description: "Flexible content management systems that publish to web, mobile, and smart TVs simultaneously." },
            { title: "Recommendation Engines", description: "AI models that analyze viewing habits to serve highly personalized content feeds." },
            { title: "Subscription Management", description: "Robust tools for managing varied subscription tiers, trials, and pay-per-view access." }
        ],
        valueProps: [
            { title: "Flawless Scale", description: "Architectures designed specifically to handle viral events and breaking news spikes." },
            { title: "Increased Engagement", description: "Personalization strategies that keep users on the platform longer." },
            { title: "Omnichannel Delivery", description: "Write once, publish everywhere—from Apple TV to mobile apps." }
        ],
        stats: [
            { value: "10M+", label: "Concurrent Users" },
            { value: "4K/8K", label: "Streaming Support" },
            { value: "Global", label: "Edge Delivery" },
            { value: "25%", label: "More Watch Time" }
        ]
    },
    "non-profit-and-social-enterprise": {
        id: "non-profit-and-social-enterprise",
        icon: HeartHandshake,
        title: "Non-Profit & Social Enterprise",
        tagline: "Purpose-driven technology that amplifies your impact.",
        introSummary: "We provide cost-effective, high-impact digital solutions for NGOs and charities—from donor management systems to digital advocacy platforms.",
        description: "Non-profits need to maximize the impact of every dollar. CiroStack partners with social enterprises to build scalable digital infrastructure that streamlines fundraising, mobilizes volunteers, and transparently reports on impact.",
        challenges: [
            "Donor retention and engagement",
            "Managing complex volunteer networks",
            "Siloed fundraising and CRM platforms",
            "Demonstrating transparent impact to stakeholders"
        ],
        solutions: [
            { title: "Donor Management (CRM)", description: "Customized CRM solutions to track interactions, predict giving, and automate outreach." },
            { title: "Fundraising Platforms", description: "Frictionless, secure donation portals optimized for high conversion on mobile." },
            { title: "Volunteer Portals", description: "Self-service platforms for volunteers to onboard, schedule shifts, and track hours." },
            { title: "Impact Dashboards", description: "Public-facing data visualizations that clearly communicate the organization's real-world results." }
        ],
        valueProps: [
            { title: "Cost-Effective Scale", description: "Strategic technology choices that maximize impact while respecting strict budgetary constraints." },
            { title: "Increased Giving", description: "Data-driven donor journeys that turn one-time contributors into lifelong supporters." },
            { title: "Operational Clarity", description: "Reduce administrative burden so your team can focus on the mission." }
        ],
        stats: [
            { value: "3x", label: "Recurring Donors" },
            { value: "PCI-DSS", label: "Secure Payments" },
            { value: "50+", label: "Causes Supported" },
            { value: "100%", label: "Mission Aligned" }
        ]
    },
    "technology-and-startups": {
        id: "technology-and-startups",
        icon: Laptop,
        title: "Technology & Startups",
        tagline: "Agile engineering velocity to take you from seed to scale.",
        introSummary: "We act as an elite extension of your engineering team, helping startups and tech firms build MVPs faster and scale architectures securely.",
        description: "Startups live or die by their execution speed. CiroStack provides the elite engineering muscle needed to hit aggressive product milestones. Whether you need a rapid MVP to secure funding or a massive architectural rewrite for scale, we deliver.",
        challenges: [
            "Time-to-market pressure for product launches",
            "Scaling technical infrastructure rapidly",
            "Attracting and retaining elite engineering talent",
            "Pivoting product direction without massive technical debt"
        ],
        solutions: [
            { title: "MVP Development", description: "Rapid, agile development cycles focusing on core value propositions to test market fit." },
            { title: "Cloud Architecture Scaling", description: "Transitioning monolithic MVPs to microservices capable of handling hyper-growth." },
            { title: "Dedicated Engineering Teams", description: "Seamlessly integrating our senior developers with your internal product teams." },
            { title: "Security & DevOps", description: "Implementing CI/CD pipelines and security audits ahead of Series A/B funding rounds." }
        ],
        valueProps: [
            { title: "Unmatched Velocity", description: "We ship clean, tested code quickly, helping you beat your competitors to market." },
            { title: "Flexible Scaling", description: "Ramp our team up or down based on your funding and immediate product roadmaps." },
            { title: "Future-Proof Tech", description: "We build architectures that are easy to maintain and iterate upon as your startup evolves." }
        ],
        stats: [
            { value: "2x", label: "Time-to-Market" },
            { value: "$500M+", label: "Client Funding Raised" },
            { value: "Zero", label: "Tech Debt Spikes" },
            { value: "30+", label: "Startups Scaled" }
        ]
    },
    "agriculture-and-farming": {
        id: "agriculture-and-farming",
        icon: Sprout,
        title: "Agriculture & Farming",
        tagline: "AgriTech solutions for sustainable, data-driven farming.",
        introSummary: "We leverage IoT, drone data, and machine learning to help agribusinesses increase yields, monitor crop health, and optimize resource usage.",
        description: "Modern agriculture relies on data as much as it does on weather. CiroStack builds sophisticated AgriTech platforms that aggregate field sensor data, automate irrigation, and manage the complex logistics from farm to table.",
        challenges: [
            "Unpredictable weather and environmental factors",
            "Inefficient resource (water, fertilizer) utilization",
            "Lack of real-time crop health visibility",
            "Complex supply chain tracking for produce"
        ],
        solutions: [
            { title: "Precision Agriculture Platforms", description: "Integrating satellite imagery and ground sensors to provide hyper-local field data." },
            { title: "Farm Management Software", description: "Comprehensive ERPs designed specifically for agribusiness operations and labor management." },
            { title: "Predictive Yield AI", description: "Machine learning models forecasting harvest times and volumes based on historical and real-time data." },
            { title: "Supply Chain Traceability", description: "Blockchain and IoT tracking to ensure produce freshness and origin transparency." }
        ],
        valueProps: [
            { title: "Maximized Yields", description: "Data-driven insights that help farmers make optimal planting and harvesting decisions." },
            { title: "Sustainable Practices", description: "Targeted resource application that reduces waste and environmental impact." },
            { title: "Operational Visibility", description: "A single pane of glass to oversee operations across thousands of acres." }
        ],
        stats: [
            { value: "20%", label: "Yield Increase" },
            { value: "30%", label: "Water Saved" },
            { value: "Real-Time", label: "Sensor Analysis" },
            { value: "100K+", label: "Acres Monitored" }
        ]
    },
    "construction-and-engineering": {
        id: "construction-and-engineering",
        icon: HardHat,
        title: "Construction & Engineering",
        tagline: "Digital tools to manage complex projects on time and on budget.",
        introSummary: "We build construction management software, safety compliance tools, and BIM integrations that bring clarity to the job site.",
        description: "Construction projects are notoriously complex, with thin margins and fragmented communication. CiroStack develops software that bridges the gap between the office and the job site, ensuring projects stay organized, safe, and profitable.",
        challenges: [
            "Disconnect between field workers and project managers",
            "Complex subcontractor and bidding management",
            "Cost overruns and inaccurate estimating",
            "Rigorous safety and compliance reporting"
        ],
        solutions: [
            { title: "Construction Management Pro", description: "Centralized platforms for RFIs, submittals, daily logs, and punch lists." },
            { title: "Field Workforce Apps", description: "Offline-capable mobile apps for field teams to log hours, report safety issues, and view plans." },
            { title: "Estimating & Bidding Software", description: "Automated takeoff tools leveraging AI to generate accurate material and labor costs." },
            { title: "BIM Integration", description: "Connecting 3D models with project schedules (4D) and cost data (5D)." }
        ],
        valueProps: [
            { title: "Reduced Rework", description: "Ensuring everyone is working from the latest plans saves thousands in costly tear-downs." },
            { title: "Field-First Design", description: "Apps built for gloved hands and bright sunlight, ensuring high adoption rates by crews." },
            { title: "Predictable Margins", description: "Real-time cost tracking against estimates to prevent financial surprises." }
        ],
        stats: [
            { value: "15%", label: "Fewer Delays" },
            { value: "Offline", label: "Mobile Sync" },
            { value: "100%", label: "Audit Trail" },
            { value: "BIM", label: "Fully Integrated" }
        ]
    },
    "transportation-and-logistics": {
        id: "transportation-and-logistics",
        icon: Truck,
        title: "Transportation & Logistics",
        tagline: "Intelligent routing and supply chain visibility for the connected world.",
        introSummary: "We develop sophisticated fleet management systems, dynamic routing algorithms, and freight brokerage platforms that keep supply chains moving.",
        description: "Logistics requires orchestrating chaos. CiroStack builds technology that brings order to transportation networks, utilizing real-time GPS data, AI routing, and seamless driver communication to optimize every mile.",
        challenges: [
            "Inefficient routing causing high fuel and labor costs",
            "Lack of real-time visibility for customers",
            "Complex driver compliance and HOS (Hours of Service)",
            "Fragmented communication between dispatch and drivers"
        ],
        solutions: [
            { title: "Dynamic Routing Engines", description: "AI algorithms that optimize multi-stop routes considering traffic, weather, and delivery windows." },
            { title: "Fleet Management Portals", description: "Real-time dashboards tracking vehicle telematics, maintenance needs, and driver behavior." },
            { title: "Freight Brokerage Platforms", description: "Digital load boards seamlessly connecting shippers with available carrier capacity." },
            { title: "Driver Mobile Apps", description: "All-in-one tools for navigation, proof of delivery, document scanning, and dispatch chat." }
        ],
        valueProps: [
            { title: "Lower Operational Costs", description: "Optimized routes significantly reduce fuel consumption and vehicle wear." },
            { title: "Exceptional Customer Exp.", description: "Proactive tracking links and accurate ETAs that delight the end customer." },
            { title: "Driver Retention", description: "Intuitive tools that make the driver's job easier, reducing turnover." }
        ],
        stats: [
            { value: "25%", label: "Route Optimization" },
            { value: "Sub-Second", label: "GPS Polling" },
            { value: "ELD", label: "Compliant" },
            { value: "Millions", label: "Miles Tracked" }
        ]
    },
    "government-and-public-sector": {
        id: "government-and-public-sector",
        icon: GovtIcon,
        title: "Government & Public Sector",
        tagline: "Accessible, secure digital services for citizens and agencies.",
        introSummary: "We partner with local, state, and federal agencies to modernize legacy systems and deliver user-centric digital public services.",
        description: "Citizens expect the same digital convenience from their government as they do from commercial apps. CiroStack helps public sector agencies securely modernize their infrastructure to provide transparent, accessible, and highly reliable services.",
        challenges: [
            "Aging, unsecured legacy infrastructure",
            "Stringent accessibility requirements (Section 508, WCAG)",
            "Complex procurement and compliance frameworks",
            "Data silos preventing inter-agency collaboration"
        ],
        solutions: [
            { title: "Citizen Service Portals", description: "Unified websites for license renewals, tax payments, and community reporting." },
            { title: "Legacy System Modernization", description: "Methodical migration of mainframe applications to secure cloud architectures." },
            { title: "Open Data Platforms", description: "Secure portals to publish anonymized datasets for civic transparency and research." },
            { title: "Secure Case Management", description: "Robust workflow tools for social services, permitting, and legal departments." }
        ],
        valueProps: [
            { title: "Citizen-Centric Design", description: "Interfaces tested thoroughly to ensure they are usable by all demographics." },
            { title: "Unwavering Security", description: "Adherence to FedRAMP, NIST, and other strict public sector security standards." },
            { title: "Cost-Effective Modernization", description: "Reducing the massive maintenance costs associated with outdated legacy hardware." }
        ],
        stats: [
            { value: "FedRAMP", label: "Ready Architectures" },
            { value: "100%", label: "WCAG 2.1 AA" },
            { value: "50%", label: "Less Paperwork" },
            { value: "High", label: "Availability" }
        ]
    },
    "sports-and-recreation": {
        id: "sports-and-recreation",
        icon: Trophy,
        title: "Sports & Recreation",
        tagline: "High-performance fan engagement and facility management platforms.",
        introSummary: "From live sports betting engines to country club management software, we build platforms that elevate the game.",
        description: "The sports and recreation industry demands robust, real-time performance. CiroStack creates low-latency applications for live viewing, sophisticated tools for facility and league management, and engaging mobile apps for fans.",
        challenges: [
            "Need for ultra-low latency data (scores, odds)",
            "Managing complex facility scheduling and memberships",
            "Engaging fans year-round, beyond game day",
            "Ticketing fraud and secondary market management"
        ],
        solutions: [
            { title: "Live Sports Data Engines", description: "Sub-second architectures for delivering live scores, stats, and betting odds." },
            { title: "Facility & League Management", description: "All-in-one software for scheduling courts, managing leagues, and processing dues." },
            { title: "Fan Engagement Apps", description: "Mobile hubs with personalized content, loyalty rewards, and interactive second-screen experiences." },
            { title: "Smart Ticketing", description: "Blockchain-backed digital ticketing to eliminate fraud and manage transfers." }
        ],
        valueProps: [
            { title: "Game-Day Reliability", description: "Infrastructure built to handle the massive traffic spikes that happen right at kickoff." },
            { title: "New Revenue Streams", description: "Unlocking monetization through digital sponsorships and VIP experiences." },
            { title: "Streamlined Operations", description: "Automating the headaches of manual scheduling and membership billing." }
        ],
        stats: [
            { value: "<100ms", label: "Data Latency" },
            { value: "100K+", label: "Concurrent Fans" },
            { value: "Zero", label: "Ticketing Fraud" },
            { value: "365", label: "Days of Engagement" }
        ]
    },
    "beauty-and-personal-care": {
        id: "beauty-and-personal-care",
        icon: Sparkles,
        title: "Beauty & Personal Care",
        tagline: "Digital elegance for the beauty industry.",
        introSummary: "We build seamless booking platforms, AR try-on experiences, and tailored e-commerce solutions for salons, spas, and cosmetics brands.",
        description: "In the beauty sector, aesthetics and convenience are paramount. CiroStack develops sleek digital experiences that reflect your brand, alongside robust operational software that keeps your calendars full and retail products moving.",
        challenges: [
            "No-shows and inefficient calendar management",
            "Personalizing product recommendations online",
            "Managing hybrid revenue (services + physical retail)",
            "Building client loyalty in a competitive market"
        ],
        solutions: [
            { title: "Smart Booking Systems", description: "Frictionless online scheduling with integrated deposits to reduce no-shows." },
            { title: "Point of Sale (POS) Integrations", description: "Unified checkout experiences handling both service tips and retail product sales." },
            { title: "Augmented Reality (AR) Tech", description: "Virtual try-ons for cosmetics and hair color via mobile web browsers." },
            { title: "Client Retention CRM", description: "Automated marketing tools that send reminders for follow-up appointments based on service cycles." }
        ],
        valueProps: [
            { title: "Premium Brand Experience", description: "UI/UX design that feels as luxurious as the services you provide." },
            { title: "Maximized Utilization", description: "Waitlist automation and smart scheduling that keeps your professionals busy." },
            { title: "Increased Retail Attach", description: "Seamlessly cross-selling products based on the client's treatment history." }
        ],
        stats: [
            { value: "40%", label: "Fewer No-Shows" },
            { value: "2x", label: "Retail Sales" },
            { value: "24/7", label: "Booking Available" },
            { value: "Beautiful", label: "UI/UX Design" }
        ]
    },
    "automotive": {
        id: "automotive",
        icon: Car,
        title: "Automotive",
        tagline: "Accelerating digital sales and service for the auto industry.",
        introSummary: "We engineer robust dealership platforms, modern service booking tools, and complex inventory management systems for the automotive sector.",
        description: "The car buying and servicing journey is moving online. CiroStack partners with dealerships, repair chains, and aftermarket retailers to create transparent, digital-first experiences that build trust and drive revenue.",
        challenges: [
            "Connecting fragmented dealership management systems (DMS)",
            "Providing transparent pricing and financing online",
            "Inefficient service bay scheduling and parts ordering",
            "Managing complex vehicle inventory syndication"
        ],
        solutions: [
            { title: "Digital Retailing Platforms", description: "End-to-end online buying experiences simulating finance, trade-in, and purchase." },
            { title: "Service Lane Technology", description: "Mobile tablets for service advisors to quickly write up issues and provide digital estimates." },
            { title: "Advanced Inventory Syndication", description: "Systems that push vehicle inventory and photos to dozens of third-party marketplaces instantly." },
            { title: "Aftermarket E-Commerce", description: "Highly complex year/make/model catalog searching for parts retailers." }
        ],
        valueProps: [
            { title: "Modern Customer Journey", description: "Meeting the modern buyer's expectation for transparency and self-service." },
            { title: "Increased Service Revenue", description: "Digital multi-point inspections with photos that increase customer approval rates." },
            { title: "DMS Integration", description: "Deep technical expertise in integrating with legacy automotive systems." }
        ],
        stats: [
            { value: "30%", label: "Faster Sales" },
            { value: "20%", label: "Service Lift" },
            { value: "YMM", label: "Search Experts" },
            { value: "Real-Time", label: "Inventory Sync" }
        ]
    },
    "legal-services": {
        id: "legal-services",
        icon: Scale,
        title: "Legal Services",
        tagline: "Highly secure, efficient software for modern law firms.",
        introSummary: "We build encrypted client portals, automated document generation, and customized case management systems that empower legal professionals.",
        description: "Law firms handle highly sensitive data and command premium billable hours. CiroStack develops tailored technology that automates routine administrative tasks and provides Fort Knox-level security for client communications.",
        challenges: [
            "Absolute necessity for data security and confidentiality",
            "Time-consuming manual document generation",
            "Inefficient tracking of billable time and expenses",
            "Securely sharing large discovery files with clients"
        ],
        solutions: [
            { title: "Secure Client Portals", description: "End-to-end encrypted vaults for messaging, document signing, and invoice payment." },
            { title: "Case Management Architecture", description: "Customized workflows tracking deadlines, court dates, and associated communications." },
            { title: "Document Automation", description: "Intelligent templating engines that generate complex legal documents from intake forms." },
            { title: "Integrated Time & Billing", description: "Frictionless time tracking tools integrated directly into the lawyer's daily workflow." }
        ],
        valueProps: [
            { title: "Uncompromising Privacy", description: "Banking-grade security protocols ensuring privileged information remains privileged." },
            { title: "Captured Billables", description: "Tools that make it effortless to track the 5-minute tasks that often go unbilled." },
            { title: "Firm Growth", description: "Automating routine paperwork so attorneys can focus on strategy and business development." }
        ],
        stats: [
            { value: "256-bit", label: "Encryption" },
            { value: "10hrs/wk", label: "Saved per Attorney" },
            { value: "100%", label: "Audit Logging" },
            { value: "Custom", label: "Workflow Logic" }
        ]
    },
    "small-business": {
        id: "small-business",
        icon: Store,
        title: "Small Business Solutions",
        tagline: "Enterprise-grade technology scaled for local business growth.",
        introSummary: "We help local businesses automate their operations, build a robust online presence, and compete with larger corporations through smart tech.",
        description: "Every business deserves great software. CiroStack takes the architectural patterns we use for enterprise clients and distills them into powerful, affordable, and easy-to-use platforms customized for local and small businesses.",
        challenges: [
            "Limited budgets for custom software development",
            "Juggling too many disconnected SaaS tools",
            "Lack of technical expertise on staff",
            "Standing out in crowded local digital markets"
        ],
        solutions: [
            { title: "All-in-One Operations Hubs", description: "Consolidating scheduling, CRM, and invoicing into a single, intuitive dashboard." },
            { title: "High-Performance Websites", description: "Lightning-fast, SEO-optimized sites that turn local search traffic into foot traffic." },
            { title: "Automated Marketing", description: "Set-and-forget tools to gather reviews and send targeted promotional campaigns." },
            { title: "Custom App Development", description: "Affordable mobile apps that increase customer loyalty and simplify ordering." }
        ],
        valueProps: [
            { title: "Affordable Growth", description: "Strategic technology implementations designed to deliver a massive ROI." },
            { title: "We Handle the Tech", description: "Full managed services so you can focus on running your business, not IT." },
            { title: "Local Dominance", description: "Tools specifically designed to help you win your regional market." }
        ],
        stats: [
            { value: "3x", label: "Local SEO Traffic" },
            { value: "SaaS", label: "Consolidation" },
            { value: "24/7", label: "Reliability" },
            { value: "100+", label: "SMBs Empowered" }
        ]
    }
};

type SubIndustryMapping = {
    parentCategory: string;
    customTitle: string;
};

// Map all 200 specific industry slugs to their parent category data
export const subIndustryMap: Record<string, SubIndustryMapping> = {
    // Retail & E-Commerce
    "online-retail-stores": { parentCategory: "retail-and-e-commerce", customTitle: "Online Retail Stores" },
    "brick-and-mortar-retail": { parentCategory: "retail-and-e-commerce", customTitle: "Brick & Mortar Retail" },
    "fashion-and-apparel": { parentCategory: "retail-and-e-commerce", customTitle: "Fashion & Apparel" },
    "grocery-and-food-delivery": { parentCategory: "retail-and-e-commerce", customTitle: "Grocery & Food Delivery" },
    "electronics-and-gadgets": { parentCategory: "retail-and-e-commerce", customTitle: "Electronics & Gadgets" },
    "furniture-and-home-decor": { parentCategory: "retail-and-e-commerce", customTitle: "Furniture & Home Decor" },
    "beauty-and-cosmetics": { parentCategory: "retail-and-e-commerce", customTitle: "Beauty & Cosmetics" },
    "bookstores": { parentCategory: "retail-and-e-commerce", customTitle: "Bookstores" },
    "pharmacies": { parentCategory: "retail-and-e-commerce", customTitle: "Pharmacies" },
    "automotive-parts": { parentCategory: "retail-and-e-commerce", customTitle: "Automotive Parts" },

    // Healthcare & Medical
    "hospitals-and-clinics": { parentCategory: "healthcare-and-medical", customTitle: "Hospitals & Clinics" },
    "telemedicine": { parentCategory: "healthcare-and-medical", customTitle: "Telemedicine" },
    "dental-practices": { parentCategory: "healthcare-and-medical", customTitle: "Dental Practices" },
    "mental-health": { parentCategory: "healthcare-and-medical", customTitle: "Mental Health" },
    "pharmacies-medical": { parentCategory: "healthcare-and-medical", customTitle: "Pharmacies" },
    "fitness-and-wellness": { parentCategory: "healthcare-and-medical", customTitle: "Fitness & Wellness" },
    "medical-equipment": { parentCategory: "healthcare-and-medical", customTitle: "Medical Equipment" },
    "laboratories": { parentCategory: "healthcare-and-medical", customTitle: "Laboratories" },
    "physical-therapy": { parentCategory: "healthcare-and-medical", customTitle: "Physical Therapy" },
    "senior-care": { parentCategory: "healthcare-and-medical", customTitle: "Senior Care" },

    // Financial Services
    "banks-and-credit-unions": { parentCategory: "financial-services", customTitle: "Banks & Credit Unions" },
    "investment-firms": { parentCategory: "financial-services", customTitle: "Investment Firms" },
    "insurance": { parentCategory: "financial-services", customTitle: "Insurance" },
    "fintech-startups": { parentCategory: "financial-services", customTitle: "Fintech Startups" },
    "accounting-firms": { parentCategory: "financial-services", customTitle: "Accounting Firms" },
    "personal-finance": { parentCategory: "financial-services", customTitle: "Personal Finance" },
    "cryptocurrency": { parentCategory: "financial-services", customTitle: "Cryptocurrency" },
    "microfinance": { parentCategory: "financial-services", customTitle: "Microfinance" },
    "real-estate-investment": { parentCategory: "financial-services", customTitle: "Real Estate Investment" },
    "credit-unions": { parentCategory: "financial-services", customTitle: "Credit Unions" },

    // Real Estate & Property
    "real-estate-agencies": { parentCategory: "real-estate-and-property", customTitle: "Real Estate Agencies" },
    "property-management": { parentCategory: "real-estate-and-property", customTitle: "Property Management" },
    "real-estate-investment-prop": { parentCategory: "real-estate-and-property", customTitle: "Real Estate Investment" },
    "commercial-real-estate": { parentCategory: "real-estate-and-property", customTitle: "Commercial Real Estate" },
    "vacation-rentals": { parentCategory: "real-estate-and-property", customTitle: "Vacation Rentals" },
    "property-development": { parentCategory: "real-estate-and-property", customTitle: "Property Development" },
    "real-estate-agents": { parentCategory: "real-estate-and-property", customTitle: "Real Estate Agents" },
    "mortgage-brokers": { parentCategory: "real-estate-and-property", customTitle: "Mortgage Brokers" },
    "facility-management": { parentCategory: "real-estate-and-property", customTitle: "Facility Management" },
    "co-working-spaces": { parentCategory: "real-estate-and-property", customTitle: "Co-working Spaces" },

    // Education & E-Learning
    "schools-and-universities": { parentCategory: "education-and-e-learning", customTitle: "Schools & Universities" },
    "online-courses": { parentCategory: "education-and-e-learning", customTitle: "Online Courses" },
    "corporate-training": { parentCategory: "education-and-e-learning", customTitle: "Corporate Training" },
    "tutoring-services": { parentCategory: "education-and-e-learning", customTitle: "Tutoring Services" },
    "test-preparation": { parentCategory: "education-and-e-learning", customTitle: "Test Preparation" },
    "language-learning": { parentCategory: "education-and-e-learning", customTitle: "Language Learning" },
    "childcare": { parentCategory: "education-and-e-learning", customTitle: "Childcare" },
    "vocational-training": { parentCategory: "education-and-e-learning", customTitle: "Vocational Training" },
    "educational-publishers": { parentCategory: "education-and-e-learning", customTitle: "Educational Publishers" },
    "coding-bootcamps": { parentCategory: "education-and-e-learning", customTitle: "Coding Bootcamps" },

    // Hospitality & Tourism
    "hotels-and-resorts": { parentCategory: "hospitality-and-tourism", customTitle: "Hotels & Resorts" },
    "restaurants-and-cafes": { parentCategory: "hospitality-and-tourism", customTitle: "Restaurants & Cafes" },
    "travel-agencies": { parentCategory: "hospitality-and-tourism", customTitle: "Travel Agencies" },
    "airlines": { parentCategory: "hospitality-and-tourism", customTitle: "Airlines" },
    "tour-operators": { parentCategory: "hospitality-and-tourism", customTitle: "Tour Operators" },
    "event-venues": { parentCategory: "hospitality-and-tourism", customTitle: "Event Venues" },
    "bed-and-breakfasts": { parentCategory: "hospitality-and-tourism", customTitle: "Bed & Breakfasts" },
    "cruise-lines": { parentCategory: "hospitality-and-tourism", customTitle: "Cruise Lines" },
    "car-rentals": { parentCategory: "hospitality-and-tourism", customTitle: "Car Rentals" },
    "travel-bloggers": { parentCategory: "hospitality-and-tourism", customTitle: "Travel Bloggers" },

    // Manufacturing & Industrial
    "manufacturing-plants": { parentCategory: "manufacturing-and-industrial", customTitle: "Manufacturing Plants" },
    "supply-chain-and-logistics": { parentCategory: "manufacturing-and-industrial", customTitle: "Supply Chain & Logistics" },
    "warehousing": { parentCategory: "manufacturing-and-industrial", customTitle: "Warehousing" },
    "quality-control": { parentCategory: "manufacturing-and-industrial", customTitle: "Quality Control" },
    "equipment-maintenance": { parentCategory: "manufacturing-and-industrial", customTitle: "Equipment Maintenance" },
    "factory-automation": { parentCategory: "manufacturing-and-industrial", customTitle: "Factory Automation" },
    "procurement": { parentCategory: "manufacturing-and-industrial", customTitle: "Procurement" },
    "distribution": { parentCategory: "manufacturing-and-industrial", customTitle: "Distribution" },
    "chemical-and-pharmaceutical": { parentCategory: "manufacturing-and-industrial", customTitle: "Chemical & Pharmaceutical" },
    "automotive-manufacturing": { parentCategory: "manufacturing-and-industrial", customTitle: "Automotive Manufacturing" },

    // Professional Services
    "law-firms": { parentCategory: "professional-services", customTitle: "Law Firms" },
    "accounting-firms-pro": { parentCategory: "professional-services", customTitle: "Accounting Firms" },
    "consulting-agencies": { parentCategory: "professional-services", customTitle: "Consulting Agencies" },
    "marketing-agencies": { parentCategory: "professional-services", customTitle: "Marketing Agencies" },
    "architecture-firms": { parentCategory: "professional-services", customTitle: "Architecture Firms" },
    "engineering-firms": { parentCategory: "professional-services", customTitle: "Engineering Firms" },
    "hr-consulting": { parentCategory: "professional-services", customTitle: "HR Consulting" },
    "it-services": { parentCategory: "professional-services", customTitle: "IT Services" },
    "recruiting-agencies": { parentCategory: "professional-services", customTitle: "Recruiting Agencies" },
    "business-coaching": { parentCategory: "professional-services", customTitle: "Business Coaching" },

    // Media & Entertainment
    "film-and-video-production": { parentCategory: "media-and-entertainment", customTitle: "Film & Video Production" },
    "music-industry": { parentCategory: "media-and-entertainment", customTitle: "Music Industry" },
    "gaming": { parentCategory: "media-and-entertainment", customTitle: "Gaming" },
    "photography": { parentCategory: "media-and-entertainment", customTitle: "Photography" },
    "publishing": { parentCategory: "media-and-entertainment", customTitle: "Publishing" },
    "news-and-media": { parentCategory: "media-and-entertainment", customTitle: "News & Media" },
    "podcasting": { parentCategory: "media-and-entertainment", customTitle: "Podcasting" },
    "event-production": { parentCategory: "media-and-entertainment", customTitle: "Event Production" },
    "social-media-influencers": { parentCategory: "media-and-entertainment", customTitle: "Social Media Influencers" },
    "art-galleries": { parentCategory: "media-and-entertainment", customTitle: "Art Galleries" },

    // Non-Profit & Social Enterprise
    "charities": { parentCategory: "non-profit-and-social-enterprise", customTitle: "Charities" },
    "ngos": { parentCategory: "non-profit-and-social-enterprise", customTitle: "NGOs" },
    "religious-organizations": { parentCategory: "non-profit-and-social-enterprise", customTitle: "Religious Organizations" },
    "community-groups": { parentCategory: "non-profit-and-social-enterprise", customTitle: "Community Groups" },
    "foundations": { parentCategory: "non-profit-and-social-enterprise", customTitle: "Foundations" },
    "social-enterprises": { parentCategory: "non-profit-and-social-enterprise", customTitle: "Social Enterprises" },
    "environmental-groups": { parentCategory: "non-profit-and-social-enterprise", customTitle: "Environmental Groups" },
    "educational-non-profits": { parentCategory: "non-profit-and-social-enterprise", customTitle: "Educational Non-Profits" },
    "health-advocacy": { parentCategory: "non-profit-and-social-enterprise", customTitle: "Health Advocacy" },
    "animal-welfare": { parentCategory: "non-profit-and-social-enterprise", customTitle: "Animal Welfare" },

    // Technology & Startups
    "saas-companies": { parentCategory: "technology-and-startups", customTitle: "SaaS Companies" },
    "tech-startups": { parentCategory: "technology-and-startups", customTitle: "Tech Startups" },
    "mobile-app-developers": { parentCategory: "technology-and-startups", customTitle: "Mobile App Developers" },
    "ai-companies": { parentCategory: "technology-and-startups", customTitle: "AI Companies" },
    "blockchain-crypto": { parentCategory: "technology-and-startups", customTitle: "Blockchain/Crypto" },
    "iot-companies": { parentCategory: "technology-and-startups", customTitle: "IoT Companies" },
    "cybersecurity": { parentCategory: "technology-and-startups", customTitle: "Cybersecurity" },
    "cloud-services": { parentCategory: "technology-and-startups", customTitle: "Cloud Services" },
    "devops-tools": { parentCategory: "technology-and-startups", customTitle: "DevOps Tools" },
    "developer-tools": { parentCategory: "technology-and-startups", customTitle: "Developer Tools" },

    // Agriculture & Farming
    "farms": { parentCategory: "agriculture-and-farming", customTitle: "Farms" },
    "agribusiness": { parentCategory: "agriculture-and-farming", customTitle: "Agribusiness" },
    "livestock-management": { parentCategory: "agriculture-and-farming", customTitle: "Livestock Management" },
    "farm-equipment": { parentCategory: "agriculture-and-farming", customTitle: "Farm Equipment" },
    "produce-distribution": { parentCategory: "agriculture-and-farming", customTitle: "Produce Distribution" },
    "organic-farming": { parentCategory: "agriculture-and-farming", customTitle: "Organic Farming" },
    "agricultural-co-ops": { parentCategory: "agriculture-and-farming", customTitle: "Agricultural Co-ops" },
    "precision-agriculture": { parentCategory: "agriculture-and-farming", customTitle: "Precision Agriculture" },
    "fisheries": { parentCategory: "agriculture-and-farming", customTitle: "Fisheries" },
    "forestry": { parentCategory: "agriculture-and-farming", customTitle: "Forestry" },

    // Construction & Engineering
    "construction-companies": { parentCategory: "construction-and-engineering", customTitle: "Construction Companies" },
    "architecture-firms-ce": { parentCategory: "construction-and-engineering", customTitle: "Architecture Firms" },
    "civil-engineering": { parentCategory: "construction-and-engineering", customTitle: "Civil Engineering" },
    "contractors": { parentCategory: "construction-and-engineering", customTitle: "Contractors" },
    "subcontractors": { parentCategory: "construction-and-engineering", customTitle: "Subcontractors" },
    "building-materials": { parentCategory: "construction-and-engineering", customTitle: "Building Materials" },
    "real-estate-development": { parentCategory: "construction-and-engineering", customTitle: "Real Estate Development" },
    "facility-management-ce": { parentCategory: "construction-and-engineering", customTitle: "Facility Management" },
    "renovation-services": { parentCategory: "construction-and-engineering", customTitle: "Renovation Services" },
    "landscape-architecture": { parentCategory: "construction-and-engineering", customTitle: "Landscape Architecture" },

    // Transportation & Logistics
    "trucking-companies": { parentCategory: "transportation-and-logistics", customTitle: "Trucking Companies" },
    "delivery-services": { parentCategory: "transportation-and-logistics", customTitle: "Delivery Services" },
    "freight-forwarding": { parentCategory: "transportation-and-logistics", customTitle: "Freight Forwarding" },
    "warehousing-tl": { parentCategory: "transportation-and-logistics", customTitle: "Warehousing" },
    "public-transportation": { parentCategory: "transportation-and-logistics", customTitle: "Public Transportation" },
    "ride-sharing": { parentCategory: "transportation-and-logistics", customTitle: "Ride-Sharing" },
    "courier-services": { parentCategory: "transportation-and-logistics", customTitle: "Courier Services" },
    "shipping-lines": { parentCategory: "transportation-and-logistics", customTitle: "Shipping Lines" },
    "railway-companies": { parentCategory: "transportation-and-logistics", customTitle: "Railway Companies" },
    "aviation": { parentCategory: "transportation-and-logistics", customTitle: "Aviation" },

    // Government & Public Sector
    "local-government": { parentCategory: "government-and-public-sector", customTitle: "Local Government" },
    "federal-agencies": { parentCategory: "government-and-public-sector", customTitle: "Federal Agencies" },
    "public-safety": { parentCategory: "government-and-public-sector", customTitle: "Public Safety" },
    "education-departments": { parentCategory: "government-and-public-sector", customTitle: "Education Departments" },
    "health-departments": { parentCategory: "government-and-public-sector", customTitle: "Health Departments" },
    "transportation-departments": { parentCategory: "government-and-public-sector", customTitle: "Transportation Departments" },
    "parks-and-recreation": { parentCategory: "government-and-public-sector", customTitle: "Parks & Recreation" },
    "libraries": { parentCategory: "government-and-public-sector", customTitle: "Libraries" },
    "utilities": { parentCategory: "government-and-public-sector", customTitle: "Utilities" },
    "tax-authorities": { parentCategory: "government-and-public-sector", customTitle: "Tax Authorities" },

    // Sports & Recreation
    "sports-teams": { parentCategory: "sports-and-recreation", customTitle: "Sports Teams" },
    "fitness-centers": { parentCategory: "sports-and-recreation", customTitle: "Fitness Centers" },
    "gyms": { parentCategory: "sports-and-recreation", customTitle: "Gyms" },
    "yoga-studios": { parentCategory: "sports-and-recreation", customTitle: "Yoga Studios" },
    "sports-leagues": { parentCategory: "sports-and-recreation", customTitle: "Sports Leagues" },
    "outdoor-recreation": { parentCategory: "sports-and-recreation", customTitle: "Outdoor Recreation" },
    "martial-arts-schools": { parentCategory: "sports-and-recreation", customTitle: "Martial Arts Schools" },
    "dance-studios": { parentCategory: "sports-and-recreation", customTitle: "Dance Studios" },
    "golf-courses": { parentCategory: "sports-and-recreation", customTitle: "Golf Courses" },
    "sports-events": { parentCategory: "sports-and-recreation", customTitle: "Sports Events" },

    // Beauty & Personal Care
    "salons": { parentCategory: "beauty-and-personal-care", customTitle: "Salons" },
    "spas": { parentCategory: "beauty-and-personal-care", customTitle: "Spas" },
    "barber-shops": { parentCategory: "beauty-and-personal-care", customTitle: "Barber Shops" },
    "nail-salons": { parentCategory: "beauty-and-personal-care", customTitle: "Nail Salons" },
    "estheticians": { parentCategory: "beauty-and-personal-care", customTitle: "Estheticians" },
    "tattoo-shops": { parentCategory: "beauty-and-personal-care", customTitle: "Tattoo Shops" },
    "beauty-clinics": { parentCategory: "beauty-and-personal-care", customTitle: "Beauty Clinics" },
    "cosmetics-brands": { parentCategory: "beauty-and-personal-care", customTitle: "Cosmetics Brands" },
    "hair-products": { parentCategory: "beauty-and-personal-care", customTitle: "Hair Products" },
    "skincare": { parentCategory: "beauty-and-personal-care", customTitle: "Skincare" },

    // Automotive
    "car-dealerships": { parentCategory: "automotive", customTitle: "Car Dealerships" },
    "auto-repair-shops": { parentCategory: "automotive", customTitle: "Auto Repair Shops" },
    "car-washes": { parentCategory: "automotive", customTitle: "Car Washes" },
    "auto-parts-stores": { parentCategory: "automotive", customTitle: "Auto Parts Stores" },
    "fleet-management": { parentCategory: "automotive", customTitle: "Fleet Management" },
    "rental-cars": { parentCategory: "automotive", customTitle: "Rental Cars" },
    "motorcycle-shops": { parentCategory: "automotive", customTitle: "Motorcycle Shops" },
    "tire-shops": { parentCategory: "automotive", customTitle: "Tire Shops" },
    "body-shops": { parentCategory: "automotive", customTitle: "Body Shops" },
    "automotive-detailing": { parentCategory: "automotive", customTitle: "Automotive Detailing" },

    // Legal Services
    "law-firms-legal": { parentCategory: "legal-services", customTitle: "Law Firms" },
    "solo-practitioners": { parentCategory: "legal-services", customTitle: "Solo Practitioners" },
    "corporate-law": { parentCategory: "legal-services", customTitle: "Corporate Law" },
    "family-law": { parentCategory: "legal-services", customTitle: "Family Law" },
    "criminal-defense": { parentCategory: "legal-services", customTitle: "Criminal Defense" },
    "immigration-law": { parentCategory: "legal-services", customTitle: "Immigration Law" },
    "intellectual-property": { parentCategory: "legal-services", customTitle: "Intellectual Property" },
    "real-estate-law": { parentCategory: "legal-services", customTitle: "Real Estate Law" },
    "estate-planning": { parentCategory: "legal-services", customTitle: "Estate Planning" },
    "legal-aid": { parentCategory: "legal-services", customTitle: "Legal Aid" },

    // Small Business
    "local-retail": { parentCategory: "small-business", customTitle: "Local Retail" },
    "restaurants-sb": { parentCategory: "small-business", customTitle: "Restaurants" },
    "salons-sb": { parentCategory: "small-business", customTitle: "Salons" },
    "gyms-sb": { parentCategory: "small-business", customTitle: "Gyms" },
    "law-firms-sb": { parentCategory: "small-business", customTitle: "Law Firms" },
    "accounting-firms-sb": { parentCategory: "small-business", customTitle: "Accounting Firms" },
    "real-estate-agents-sb": { parentCategory: "small-business", customTitle: "Real Estate Agents" },
    "consultants": { parentCategory: "small-business", customTitle: "Consultants" },
    "contractors-sb": { parentCategory: "small-business", customTitle: "Contractors" },
    "freelancers": { parentCategory: "small-business", customTitle: "Freelancers" }
};
