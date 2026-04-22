import { Shield, MapPin, Users, Rocket } from "lucide-react";
import type { ServiceEntry } from "./types";

export const servicesPart4: Record<string, ServiceEntry> = {
    "security-audit": {
        id: "security-audit",
        icon: Shield,
        title: "Security Audit & Governance",
        tagline: "Protect your systems, data, and reputation.",
        introSummary: "aggressive penetration testing and exhaustive governance frameworks designed to expose and eradicate vulnerabilities before malicious actors exploit them.",
        description: "A single data breach can irreversibly destroy your company's reputation and incur massive regulatory fines. Our Security Audit and Governance service is a proactive, aggressive defense strategy. Certified white-hat hackers perform simulated cyberattacks against your web applications, mobile apps, and cloud infrastructure to identify gaping security holes. Beyond technical penetration testing, we establish the robust internal policies, access controls, and compliance frameworks required to pass grueling SOC 2, HIPAA, and ISO 27001 certifications.",
        details: [
            "Rigorous Penetration Testing (Web, Mobile, and API layers).",
            "Exhaustive OWASP Top 10 vulnerability and injection analysis.",
            "Deep cloud infrastructure misconfiguration scanning (AWS/GCP/Azure).",
            "Data handling, encryption at rest/transit, and PII compliance review.",
            "Internal social engineering assessments and Phishing simulations.",
            "Comprehensive Security Policy and Disaster Recovery development."
        ],
        technologies: ["Burp Suite", "Metasploit", "Nessus", "OWASP ZAP", "Kali Linux", "AWS SecurityHub"],
        deliverables: [
            "Detailed Penetration Test Report & PoC.",
            "Prioritized Vulnerability Register.",
            "Compliance Gap Analysis (SOC2/HIPAA).",
            "Executive Risk Summary.",
            "Drafted Internal Security Policies.",
            "Immediate Remediation Checklist."
        ],
        startingAt: "$3,000",
        bookingType: "Security Assessment",
        valueProps: [
            { title: "Prevent Catastrophic Breaches", description: "We mathematically eliminate the glaring code vulnerabilities (like SQL Injections and XSS) that lead to devastating ransomware attacks and massive data theft." },
            { title: "Guarantee Compliance", description: "We map your current technical architecture directly against the strict requirements of GDPR, HIPAA, or SOC 2, proving exactly what you need to fix to pass the audit." },
            { title: "Secure Customer Trust", description: "Enterprise sales require proof of security. Our comprehensive reports provide the verifiable evidence your B2B clients demand before signing massive contracts." },
            { title: "Zero False Positives", description: "Automated scanners generate noise. Our human security experts manually verify every single vulnerability we find, providing incredibly clear, actionable remediation steps." }
        ],
        whoWeHelped: [
            "FinTech startups requiring third-party penetration testing to secure a critical banking partnership.",
            "Healthcare SaaS platforms needing immediate certification of total HIPAA compliance regarding patient data.",
            "E-commerce brands seeking to fortify their payment gateways following an increase in fraudulent attacks.",
            "Enterprise organizations requiring an overhaul of internal employee access policies to meet ISO standards."
        ],
        processSteps: [
            { title: "Scoping & Threat Modeling", description: "We establish strict Rules of Engagement, identifying the critical assets (databases, APIs) and mapping the most likely avenues of attack from adversaries." },
            { title: "Automated Vulnerability Scanning", description: "We utilize enterprise-grade scanners to rapidly identify known CVEs, outdated libraries, and glaring network misconfigurations." },
            { title: "Manual Penetration Testing", description: "Our certified ethical hackers break out the complex tools, actively attempting to bypass your authentication, hijack sessions, and extract confidential database records." },
            { title: "Architecture & Policy Review", description: "We step back from the code to analyze your high-level cloud architecture, IAM roles, and internal employee data-handling policies." },
            { title: "Reporting & Triage", description: "We compile the findings, removing false positives, and categorize every vulnerability by strict CVSS severity scores (Critical, High, Medium, Low)." },
            { title: "Remediation & Retesting", description: "We hand your developers the exact code snippets needed to fix the holes, and once patched, we aggressively retest the endpoints to guarantee the fix holds." }
        ],
        industryExpertise: ["FinTech", "HealthTech", "E-commerce", "GovTech", "SaaS", "Telecommunications"],
        reasonsToChoose: [
            { title: "Offensive Mindset", description: "We don't just check compliance boxes on a clipboard. We employ hackers who think exactly like the adversaries trying to destroy your business." },
            { title: "Developer-Friendly Reports", description: "Security reports are often vague. We provide exact HTTP request logs, Proof of Concept (PoC) videos, and specific code recommendations so your developers know exactly how to fix the issue." },
            { title: "Continuous Partnership", description: "Security is a posture, not a one-time project. We offer continuous ongoing scanning and annual re-certifications to ensure you remain perpetually protected as your app evolves." }
        ],
        faqs: [
            { question: "What is the difference between an Audit and a Penetration Test?", answer: "An Audit is defensive; it reviews your policies, code, and configurations against best-practice checklists. A Penetration Test is offensive; it is an active, simulated cyberattack attempting to break into your system to prove the vulnerabilities exist." },
            { question: "Will the penetration test take our website offline?", answer: "Highly unlikely. We utilize extreme caution. While we do aggressive testing, we coordinate the timing of heavier load tests and utilize non-destructive payloads to ensure your production users are never impacted." },
            { question: "Do we need a penetration test if we use AWS/Azure?", answer: "Yes. AWS provides a secure physical infrastructure, but you are responsible for how you configure it (The Shared Responsibility Model). 99% of cloud breaches are caused by customer misconfigurations (like public S3 buckets), not AWS failures." },
            { question: "Can you help us get SOC 2 compliant?", answer: "Yes. We perform pre-audit Gap Analysis. We tell you exactly where your technical infrastructure and internal HR policies currently fail SOC 2 requirements, and help you implement the strict controls needed to pass." }
        ]
    },
    "nearshore": {
        id: "nearshore",
        icon: MapPin,
        title: "US Nearshore Software Development",
        tagline: "Talent close to home. Savings you'll love.",
        introSummary: "elite, culturally aligned software engineering teams localized in Latin America, bridging the critical gap between massive cost savings and flawless real-time collaboration.",
        description: "Offshore outsourcing to distant time zones frequently results in catastrophic communication breakdowns, misaligned code, and agonizing 24-hour feedback loops. Our Nearshore Development service solves this by deploying elite, senior software engineering teams from Latin America (LATAM). These engineers operate in strict alignment with US EST/PST time zones, boast impeccable English fluency, and share deep cultural affinity with US business practices. You secure the immense technical firepower of top-tier React, Python, and AWS architects at a fraction of the Silicon Valley cost, without sacrificing a single ounce of velocity.",
        details: [
            "Real-time US time zone overlap (EST/PST) for synchronous daily collaboration.",
            "Strictly vetted, English-fluent senior and lead software engineers.",
            "Agile-ready distributed teams heavily experienced in US startup culture.",
            "Frictionless onboarding and dedicated US-based Account Management.",
            "Ironclad intellectual property (IP) protection and standard US NDAs.",
            "Significant reduction in total engineering payroll costs."
        ],
        technologies: ["React", "Node.js", "Python", "Java", "AWS", "PostgreSQL"],
        deliverables: [
            "Pre-Vetted Engineering Resumes.",
            "Immediate Codebase Value Add.",
            "Synchronous Agile Participation.",
            "Monthly Velocity Reporting.",
            "Strict Code Quality Reviews.",
            "Scalable Resource Allocation."
        ],
        startingAt: "$4,000/month",
        bookingType: "Talent Consultation",
        valueProps: [
            { title: "Synchronous Velocity", description: "Stop waiting until tomorrow for a bug fix. Nearshore engineers attend your morning standups and pair-program with your internal team in real-time." },
            { title: "Elite Talent, Smart Economics", description: "Access the top 1% of LATAM engineering talent. You secure architectural-level expertise for roughly half the cost of an equivalent hire in New York or San Francisco." },
            { title: "Cultural Alignment", description: "Our engineers consume the same media, use the same massive SaaS tools, and deeply understand the frantic, high-quality expectations of US startup culture." },
            { title: "Absolute Legal Security", description: "You sign contracts with our US entity. Your intellectual property is protected by strict US law, bypassing the terrifying legal ambiguities of overseas freelancers." }
        ],
        whoWeHelped: [
            "Mid-sized US SaaS platforms needing to double their engineering output without doubling their massive payroll.",
            "Silicon Valley startups unable to compete locally for senior talent due to hyper-inflated salary expectations.",
            "Agencies requiring massive, rapid scale-up capabilities to handle unexpected enterprise client wins.",
            "Companies burned by traditional offshoring due to debilitating 12-hour timezone communication gaps."
        ],
        processSteps: [
            { title: "Capacity & Stack Analysis", description: "We meet with your CTO to strictly define the technical stack, the required seniority levels, and the specific cadence of your engineering culture." },
            { title: "Candidate Curation", description: "Unlike generic platforms, we hand-select 2-3 elite engineers from our internal bench whose specific backgrounds perfectly match your immediate scaling needs." },
            { title: "Technical Interviews", description: "You are invited to rigorously interview the candidates, review their code, and personally verify their English fluency and cultural fit before committing." },
            { title: "Frictionless Onboarding", description: "The engineer is provisioned securely into your Slack, Jira, and GitHub repositories, attending their first daily standup within 48 hours of approval." },
            { title: "Agile Development", description: "They operate exactly as internal employees, claiming tickets, pushing PRs, partaking in code reviews, and driving your product roadmap forward." },
            { title: "Continuous Optimization", description: "Our US-based management regularly checks in to ensure velocity metrics are met and handles all HR, payroll, and hardware complexities behind the scenes." }
        ],
        industryExpertise: ["FinTech", "HealthTech", "SaaS", "E-commerce", "Real Estate", "Media"],
        reasonsToChoose: [
            { title: "Rigorous Top 1% Vetting", description: "We reject roughly 98% of applicants. We aggressively test them on complex algorithmic architecture, clean code principles, and advanced English proficiency." },
            { title: "Zero Churn Anxiety", description: "Engineering turnover kills velocity. We pay at the absolute top of the LATAM market and provide massive benefits, resulting in astonishingly high retention rates." },
            { title: "US Based Accountability", description: "If an issue arises, you aren't fighting a timezone to get an answer. Your dedicated account manager is based in the US and available instantly." }
        ],
        faqs: [
            { question: "What is the difference between Nearshore and standard Offshore?", answer: "Offshore generally refers to talent in India or Eastern Europe, creating a 9 to 12-hour time difference that forces asynchronous communication. Nearshore refers to Latin America (LATAM), which shares exact or adjacent time zones with the US, allowing for normal daytime collaboration." },
            { question: "How strong is their English?", answer: "Impeccable. Fluent, professional-level English is a strict, non-negotiable prerequisite for our nearshore hires. They comfortably lead technical presentations and engage in complex architectural debates." },
            { question: "Who manages the engineers?", answer: "You do. They integrate directly into your internal teams and take feature direction from your Product Managers and CTOs. We manage the HR, payroll, and legal infrastructure." },
            { question: "What if I only need a specific rare technology stack?", answer: "Because we have a massive pool of pre-vetted LATAM talent, we can rapidly source senior experts in exceptionally niche frameworks or legacy systems that are virtually impossible to find locally." }
        ]
    },
    "outsourcing": {
        id: "outsourcing",
        icon: Users,
        title: "Software Development Outsourcing",
        tagline: "Entire product teams, expertly managed.",
        introSummary: "end-to-end, fully managed engineering lifecycles where we take absolute ownership of architecting, building, and deploying your entire software product.",
        description: "Sometimes you don't just need extra hands; you need an entirely functional brain. Our Software Development Outsourcing service is designed for organizations that want to aggressively build digital products without the colossal operational distraction of managing an internal engineering department. We act as your highly technical, autonomous product laboratory. You provide the business objective and the vision; we provide the Project Managers, UX Designers, Senior Architects, and QA Engineers required to bring it flawlessly into reality, on time and on budget.",
        details: [
            "End-to-end autonomous product development and lifecycle management.",
            "Dedicated, highly agile Project Managers ensuring absolute transparency.",
            "Comprehensive cloud architecture and technical strategy formulation.",
            "Full-stack engineering utilizing modern, scalable technologies.",
            "Rigorous, automated QA and manual testing protocols included.",
            "Seamless launch support, App Store deployment, and ongoing maintenance."
        ],
        technologies: ["React", "Next.js", "Node.js", "Python", "AWS", "Docker"],
        deliverables: [
            "Comprehensive Product Requirements Document.",
            "High-Fidelity UX/UI Designs & Prototypes.",
            "Fully Functional, Scalable Codebase.",
            "Automated Testing Suites.",
            "Weekly Build Demos & Progress Analytics.",
            "Detailed Handoff Documentation."
        ],
        startingAt: "$8,000/month",
        bookingType: "Project Scoping",
        valueProps: [
            { title: "Zero Management Overhead", description: "We run the daily standups, manage the Jira boards, and handle the brutal minutiae of software development, allowing your executives to focus strictly on sales and strategy." },
            { title: "Predictable Economics", description: "No surprise AWS bills or wildly inaccurate timelines. We provide deeply researched, ironclad project scopes with massive transparency into budget burn rates." },
            { title: "Architectural Certainty", description: "Because we control the entire stack, we guarantee the backend perfectly supports the frontend. We don't build fragile prototypes; we build enterprise-grade, scalable foundations." },
            { title: "Instant Team Cohesion", description: "You aren't hiring five strangers hoping they get along. You are hiring a battle-tested pod of engineers and designers who have successfully shipped dozens of products together." }
        ],
        whoWeHelped: [
            "Non-technical enterprise founders with massive domain expertise but zero ability to write code.",
            "Corporations whose internal IT teams are hopelessly backlogged maintaining legacy systems.",
            "Venture Capital funded startups needing to instantly build a massive MVP to secure their next round.",
            "Traditional businesses realizing they must entirely digitize their core service offering to survive."
        ],
        processSteps: [
            { title: "Discovery & PRD Generation", description: "We extract your vision and translate it into a ruthless Product Requirements Document (PRD), finalizing exact feature sets and cutting unnecessary scope." },
            { title: "Strategic Architecture", description: "Our technical leads design the database schemas, cloud infrastructure, and API blueprints required to ensure the system will scale massively." },
            { title: "UX/UI Prototyping", description: "Our design team creates pixel-perfect, interactive wireframes, ensuring the user experience flows perfectly before engineering begins." },
            { title: "Agile Sprints & Development", description: "We build the software in strict two-week sprints. At the end of every sprint, you receive a functional, clickable demo of the exact progress made." },
            { title: "Quality Assurance", description: "Our dedicated QA team assaults the codebase, writing automated tests and manually attempting to break the flows to ensure mathematical stability." },
            { title: "Deployment & Maintenance", description: "We deploy the application to secure servers, monitor its health aggressively, and transition into a retainer model for continuous feature enhancement." }
        ],
        industryExpertise: ["SaaS", "E-commerce", "FinTech", "HealthTech", "Logistics", "Consumer Apps"],
        reasonsToChoose: [
            { title: "Skin in the Game", description: "We take extreme ownership. If a deadline slips due to our architectural miscalculation, we absorb the pain, not you. Your success is our reputation." },
            { title: "Obsessive Transparency", description: "You are never left guessing. You have access to our code repositories, our project management boards, and receive brutally detailed weekly status briefings." },
            { title: "Post-Launch Capability", description: "Many agencies vanish after the App Store launch. We are designed to seamlessly pivot into a long-term maintenance and growth engineering partner." }
        ],
        faqs: [
            { question: "Is this cheaper than building an internal team?", answer: "Almost always. When you factor in the massive hidden costs of internal hires—recruiting fees, 6 months of onboarding, health benefits, hardware, and engineering turnover—a completely managed outsourced pod is highly economically efficient." },
            { question: "How do we know what is being built?", answer: "We utilize extreme transparency. We adhere to Agile methodologies, meaning we deliver a working, testable piece of the software every two weeks. You never wait 6 months in the dark for a final reveal." },
            { question: "Who owns the Intellectual Property?", answer: "You do. Your contract will explicitly state that 100% of the code, designs, and architectural IP belongs entirely to your company from the moment it is written." },
            { question: "What if we want to take development internal later?", answer: "We actively encourage and support this. We build beautifully documented, industry-standard code. When you are ready, we execute a seamless, highly structured knowledge transfer to your new internal CTO." }
        ]
    },
    "startups": {
        id: "startups",
        icon: Rocket,
        title: "Software Development for Startups",
        tagline: "From zero to launch, at startup speed.",
        introSummary: "lean, hyper-velocity product engineering specifically calibrated to help founders achieve product-market fit and secure critical venture funding.",
        description: "Startups operate in a brutal reality: ship fast, secure traction, or die. The luxury of bloated enterprise planning does not exist here. We specialize in Startup Engineering. We partner with founders to ruthlessly scope Minimum Viable Products (MVPs), cutting aesthetic noise to focus strictly on the core value hypotheses. Using highly efficient frameworks like Next.js and serverless cloud architectures, we dramatically accelerate the path to launch. We build fast, but we never build fragile; your MVP will have the structural integrity to scale the second you secure that massive Series A.",
        details: [
            "Ruthless MVP scoping to identify and build only critical hypotheses.",
            "Rapid, interactive Figma prototyping for early investor validation.",
            "High-velocity full-stack engineering utilizing Next.js and Firebase/Supabase.",
            "Scalable Serverless architecture designed to minimize early cloud costs.",
            "Deep analytics integration to aggressively track early user behaviors.",
            "Post-launch 'Growth Engineering' and rapid feature iteration."
        ],
        technologies: ["React", "Next.js", "Supabase", "Firebase", "Stripe", "Vercel"],
        deliverables: [
            "Validated Product Specification.",
            "High-Fidelity Investor Prototypes.",
            "Production-Ready MVP Application.",
            "User Behavior Analytics Dashboards.",
            "Scalable Cloud Foundation.",
            "Technical Pitch Deck Support."
        ],
        startingAt: "$5,000",
        bookingType: "Founder Strategy Call",
        valueProps: [
            { title: "Extreme Time-to-Market", description: "We utilize highly composable tech stacks that allow us to transform brilliant ideas into functional, revenue-generating software in mere weeks." },
            { title: "Scope Discipline", description: "Founders love features. We act as your rigorous technical gatekeeper, preventing scope creep to ensure you launch your core assumption as cheaply and quickly as possible." },
            { title: "Architected for Scale", description: "We build lean, but we don't build garbage. Your early MVP uses the exact same rigorous component structure as a Fortune 500 product, preventing immediate rewrites upon scale." },
            { title: "Investor Readiness", description: "We help you answer the grueling technical questions. We provide the architecture diagrams and security postures VCs demand during technical due diligence." }
        ],
        whoWeHelped: [
            "Solo founders needing a high-fidelity prototype to secure pre-seed funding.",
            "Funded Seed startups requiring immediate engineering velocity to beat competitors to market.",
            "Y Combinator alumni needing a massive architectural rebuild after their initial prototype buckled under scale.",
            "Domain-expert founders (Doctors, Lawyers) who know the industry perfectly but have zero ability to code."
        ],
        processSteps: [
            { title: "Hypothesis Surgery", description: "We sit down with founders to brutally dissect the idea. We identify the single core value proposition and violently strip away 'nice-to-have' features for V2." },
            { title: "Rapid Prototyping", description: "We design a clickable Figma prototype in days. Founders use this instantly to presell the software, validate demand, or secure early angel checks." },
            { title: "Lean Engineering", description: "We utilize incredible developer-velocity tools like Next.js, Vercel, and Supabase to wire up complex authentication, databases, and frontends at hyper-speed." },
            { title: "Analytics Injection", description: "An MVP is useless if you don't know how users react. We install precise telemetry (Mixpanel/Amplitude) so you know exactly which buttons they click." },
            { title: "The Launch Protocol", description: "We execute the soft launch, configuring domains, scaling the databases, and holding our breath alongside you as the first real users hit the servers." },
            { title: "Iterative Pivoting", description: "Startup roadmaps change instantly based on user feedback. We pivot the engineering focus weekly, aggressively building the features the data proves users actually want." }
        ],
        industryExpertise: ["FinTech", "HealthTech", "Consumer Apps", "Web3", "SaaS", "Marketplaces"],
        reasonsToChoose: [
            { title: "We Think Like Founders", description: "We aren't just order takers. We challenge your assumptions, suggest leaner technical approaches, and deeply care about your burn rate." },
            { title: "Unfair Tech Advantages", description: "We reuse massive amounts of internal boilerplate code for authentication, billing, and routing. You don't pay us to reinvent the wheel, you pay us to build your unique logic." },
            { title: "A Long-Term Partner", description: "We want to be there at the IPO. We build relationships designed to scale from the $5k prototype all the way to managing your $500k/month Series B engineering pod." }
        ],
        faqs: [
            { question: "What is an MVP?", answer: "A Minimum Viable Product. It is the absolute leanest, smallest version of your software that can reliably answer your core business question. If your assumption is 'People will pay to rent a scooter', the MVP is an app with a single 'Unlock' button, not a complex social network of scooter riders." },
            { question: "Will the prototype actually be usable code?", answer: "Yes. When we refer to 'rapid prototypes', we usually mean clickable Figma designs for investors. However, when we build the MVP, it is real, robust code that can accept real credit cards and real users securely." },
            { question: "How involved do I need to be in the development?", answer: "Heavily involved. We are fast, but we rely on you for rapid decisions. We expect founders to test new builds weekly and provide immediate feedback so we can iterate at startup speeds." },
            { question: "Can you help me pitch to investors?", answer: "Yes. While we aren't venture capitalists, we frequently act as the 'Technical Co-Founder' in the room during pitches, answering complex due-diligence questions regarding cloud scalability and security architectures." }
        ]
    }
};
