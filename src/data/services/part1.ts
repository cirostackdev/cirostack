import { Monitor, Server, Smartphone, Bot, Cpu, Cloud, Sparkles } from "lucide-react";
import type { ServiceEntry } from "./types";

export const servicesPart1: Record<string, ServiceEntry> = {
    "frontend-development": {
        id: "frontend-development",
        icon: Monitor,
        title: "Frontend Development",
        tagline: "Pixel-perfect, blazing-fast interfaces built with React and Next.js that convert visitors into customers.",
        introSummary: "high-performance, component-driven frontend applications crafted with modern frameworks that combine visual excellence with engineering rigour.",
        description: "Your frontend is the first and most critical impression users form of your product. We engineer bespoke, responsive interfaces using React and Next.js that load instantly, look stunning on every device, and drive meaningful conversions. From marketing sites to complex web applications, our frontend engineers obsess over Core Web Vitals, accessibility, and the micro-interactions that turn browsers into buyers.",
        details: [
            "Component-driven React and Next.js architecture built for long-term scalability.",
            "Mobile-first responsive layouts that adapt flawlessly to any screen and device.",
            "Built-in technical SEO: semantic HTML, dynamic meta tags, and structured data.",
            "Headless CMS integration for frictionless, code-free content management.",
            "Core Web Vitals optimization for sub-second load times and top Lighthouse scores.",
            "Advanced animation and micro-interaction engineering with Framer Motion."
        ],
        technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
        deliverables: [
            "Fully custom, responsive web application.",
            "Scalable component library and design system.",
            "Performance and accessibility audit report.",
            "CMS integration and content editing training.",
            "Google Analytics and Tag Manager configuration.",
            "30-day post-launch technical support."
        ],
        startingAt: "$2,500",
        bookingType: "Strategy Session",
        valueProps: [
            { title: "Lightning-Fast Performance", description: "Our Next.js architectures achieve sub-second load times, dramatically reducing bounce rates and earning the Google rankings your competitors cannot match." },
            { title: "Pixel-Perfect Craft", description: "We do not use templates. Every component is engineered from scratch to express your brand with precision, building the visual trust that converts visitors into paying customers." },
            { title: "Scalable Architecture", description: "Component-driven React ecosystems mean your frontend grows with your product. Adding features, pages, or A/B tests never requires rebuilding from scratch." },
            { title: "Conversion-First Design", description: "We embed proven UX principles into every layout decision, naturally guiding users toward your primary call-to-action without friction or confusion." }
        ],
        whoWeHelped: [
            "SaaS companies launching polished marketing sites ahead of Series A.",
            "E-commerce brands escaping the performance ceiling of template platforms.",
            "B2B service providers requiring high-trust, professional-grade redesigns.",
            "Product teams rebuilding legacy frontends with modern component systems."
        ],
        processSteps: [
            { title: "Discovery & Architecture", description: "We map your goals, user journeys, and performance targets to define the component architecture and technology decisions before writing a line of code." },
            { title: "UX & Visual Design", description: "Our designers produce wireframes and high-fidelity prototypes in Figma, validating user flows and visual identity before any engineering begins." },
            { title: "Component Engineering", description: "We build your design system and application components in React, obsessing over accessibility, responsiveness, and performance at every layer." },
            { title: "CMS & API Integration", description: "We wire your frontend to your chosen headless CMS and any required backend APIs, ensuring content editors can work independently of engineering." },
            { title: "Performance & QA", description: "Rigorous cross-browser and device testing, Lighthouse audits, and accessibility checks guarantee production quality before we ship." },
            { title: "Launch & Handover", description: "We manage the deployment, configure your domain and CDN, and walk your team through everything they need to maintain and evolve their new frontend." }
        ],
        industryExpertise: ["SaaS", "E-commerce", "Fintech", "Healthcare", "Real Estate", "Professional Services"],
        reasonsToChoose: [
            { title: "Engineering, Not Assembly", description: "We are frontend engineers, not drag-and-drop builders. We write clean, tested, documented code that your future engineering team can maintain and extend without us." },
            { title: "Performance Is Not Optional", description: "Every decision we make — from image formats to bundle splitting — is measured against Core Web Vitals. We ship fast frontends, not just good-looking ones." },
            { title: "A Partner Beyond Launch", description: "We do not disappear at go-live. We document everything, train your team, and remain available as your product evolves and your feature requirements grow." }
        ],
        faqs: [
            { question: "How long does a frontend build typically take?", answer: "A polished marketing site takes 3 to 6 weeks. A complex web application with authentication, dashboards, and multiple user flows typically takes 6 to 12 weeks, depending on scope and revision cycles." },
            { question: "Will I be able to update content myself?", answer: "Yes. We integrate user-friendly headless CMS platforms like Sanity or Contentful so your team can update copy, images, and blog posts without touching code." },
            { question: "Do you build the backend as well?", answer: "Our Frontend Development service focuses on the UI layer. For full-stack builds requiring custom APIs, databases, or server-side business logic, our Backend Development service handles that side, and we often scope both together." },
            { question: "Is SEO included?", answer: "Yes. Technical SEO is built into our frontend process: semantic HTML, server-side rendering via Next.js, proper meta tag structure, and fast load speeds that Google rewards with better rankings." }
        ]
    },
    "backend-development": {
        id: "backend-development",
        icon: Server,
        title: "Backend Development",
        tagline: "Robust APIs, secure databases, and server-side systems that power your product reliably at any scale.",
        introSummary: "secure, high-performance server-side systems and API infrastructure engineered to handle complex business logic, data integrity, and scale without limits.",
        description: "Every great product runs on a backend that nobody sees — until it fails. We engineer the APIs, databases, authentication systems, and server-side business logic that form the invisible backbone of your product. Our backend engineers design for reliability, security, and scalability from the first line of code, so your infrastructure grows with your user base instead of becoming the bottleneck that limits it.",
        details: [
            "RESTful and GraphQL API design with comprehensive endpoint documentation.",
            "Relational and document database architecture, modelling, and query optimization.",
            "Authentication and authorization systems: OAuth2, JWT, RBAC, and SSO.",
            "Third-party service integration: Stripe, Twilio, SendGrid, and custom APIs.",
            "Background job processing, event queuing, and webhook infrastructure.",
            "Automated testing, CI/CD pipelines, and full observability setup."
        ],
        technologies: ["Node.js", "Python", "PostgreSQL", "Redis", "Prisma", "Supabase"],
        deliverables: [
            "Production-ready API with full documentation.",
            "Database schema and migration strategy.",
            "Authentication and authorization system.",
            "Third-party integration layer.",
            "Automated test suite covering critical paths.",
            "Deployment pipeline and monitoring configuration."
        ],
        startingAt: "$3,500",
        bookingType: "Technical Discovery Call",
        valueProps: [
            { title: "Security by Design", description: "Authentication, authorization, input validation, and secrets management are built into our architecture from day one — never retrofitted after a vulnerability is discovered." },
            { title: "Built to Scale", description: "We architect for the traffic you will have, not just the traffic you have today. Horizontal scaling, read replicas, caching layers, and connection pooling are standard, not upgrades." },
            { title: "API-First Development", description: "We design your API contract before writing implementation code, ensuring every endpoint is intentional, consistent, and ready to serve your frontend, mobile clients, and third-party integrations." },
            { title: "Observable from Day One", description: "Structured logging, error tracking, performance monitoring, and alerting are configured at launch so your team knows about problems before your users do." }
        ],
        whoWeHelped: [
            "SaaS platforms needing multi-tenant API infrastructure with enterprise-grade data isolation.",
            "Marketplaces requiring complex payment flows, escrow logic, and automated seller payouts.",
            "Mobile-first products needing low-latency, offline-tolerant backend architecture.",
            "Companies migrating off monolithic backends into modular, scalable service layers."
        ],
        processSteps: [
            { title: "Requirements & Data Modelling", description: "We map your business logic, data entities, and integration requirements into a schema and API design document before any code is written." },
            { title: "API Contract Design", description: "We define all endpoints, request and response shapes, authentication flows, and error codes — reviewed and approved before implementation begins." },
            { title: "Core Engineering", description: "We build your authentication system, database layer, business logic, and API endpoints with clean architecture, proper separation of concerns, and full test coverage." },
            { title: "Integrations", description: "We connect your backend to the third-party services your product requires: payment processors, communication platforms, identity providers, and data providers." },
            { title: "Testing & Security Review", description: "Automated integration tests, security scanning, and a manual review of authentication and authorization logic before any production deployment." },
            { title: "Deployment & Handover", description: "We configure your CI/CD pipeline, deploy to production, set up monitoring and alerts, and document everything your team needs to operate and extend the system." }
        ],
        industryExpertise: ["SaaS", "Fintech", "Healthcare", "Marketplaces", "E-commerce", "Enterprise"],
        reasonsToChoose: [
            { title: "Architecture First", description: "We design before we code. A well-designed backend costs the same to build and an order of magnitude less to scale, maintain, and debug. We invest the upfront thinking so you do not pay for rewrites later." },
            { title: "No Black Boxes", description: "Every system we build is fully documented. Database schemas, API contracts, environment setup, and deployment procedures are all handed over so your team is never dependent on us to run their own infrastructure." },
            { title: "Security Is Non-Negotiable", description: "We treat security as an engineering discipline, not a checklist. Input validation, secrets management, dependency auditing, and access controls are built into our standard process on every project." }
        ],
        faqs: [
            { question: "Do you build the frontend as well?", answer: "Our Backend Development service focuses on server-side systems, APIs, and databases. For UI layers, our Frontend Development service covers that. We frequently scope both together for complete product builds." },
            { question: "What databases do you work with?", answer: "We work with PostgreSQL as our default relational database, MongoDB for document workloads, and Redis for caching and queuing. We recommend the right tool for your specific data model and query patterns." },
            { question: "Can you integrate with our existing systems?", answer: "Yes. Legacy system integration is a core part of our backend work. We have experience connecting to ERPs, CRMs, payment gateways, identity providers, and custom internal APIs — including poorly documented ones." },
            { question: "How do you handle data security and compliance?", answer: "We follow OWASP guidelines by default: parameterized queries, input validation, secrets in environment variables, dependency auditing, and access logging. For regulated industries, we apply the relevant compliance framework requirements as a baseline." }
        ]
    },
    apps: {
        id: "apps",
        icon: Smartphone,
        title: "Mobile Apps Development",
        tagline: "Native and cross platform mobile apps built by senior engineers, from first prototype to millions of users.",
        introSummary: "robust, high-performance web and mobile applications engineered to provide seamless native experiences across all devices and platforms.",
        description: "We orchestrate the entire lifecycle of custom application development, from minimal viable products (MVPs) to complex enterprise-grade platforms. Understanding that sluggish or unintuitive applications destroy user trust, we focus intensely on real-time synchronization, fluid animations, and offline-first capabilities. Whether deploying natively to iOS and Android or crafting a powerful Progressive Web Application (PWA), our engineering teams ensure your app scales flawlessly alongside your growing user base.",
        details: [
            "Cross-platform mobile apps for iOS and Android from a single codebase.",
            "Progressive Web Applications (PWAs) that bypass app store friction.",
            "Complex state management and real-time data synchronization via WebSockets.",
            "Robust user authentication systems including biometric security and SSO.",
            "Integration with complex third-party APIs and legacy systems.",
            "Scalable, highly available backend microservice architectures."
        ],
        technologies: ["React Native", "Flutter", "Node.js", "PostgreSQL", "AWS", "Firebase"],
        deliverables: [
            "Custom Application UI/UX design.",
            "Production-ready iOS and Android applications.",
            "Secure backend and API development.",
            "Relational database architecture.",
            "App store deployment and review management.",
            "Complete technical documentation."
        ],
        startingAt: "$8,000",
        bookingType: "Product Demo",
        valueProps: [
            { title: "Cross-Platform Efficiency", description: "By utilizing React Native and Flutter, we deliver native-like performance on both iOS and Android simultaneously, cutting your time-to-market in half." },
            { title: "Enterprise-Grade Security", description: "We implement rigorous security protocols, including end-to-end encryption and compliance with strict data protection regulations." },
            { title: "Flawless User Experience", description: "We obsess over frame rates. Our apps are engineered to provide smooth, immediate interactions that feel indistinguishable from pure native development." },
            { title: "Scalable Infrastructure", description: "The app is only as good as its backend. We build resilient cloud infrastructure that effortlessly handles traffic spikes and expanding data loads." }
        ],
        whoWeHelped: [
            "High-growth startups launching their flagship consumer products.",
            "Logistics companies requiring real-time driver tracking tools.",
            "Healthcare networks deploying secure patient communication portals.",
            "Retail brands seeking to increase loyalty through personalized mobile experiences."
        ],
        processSteps: [
            { title: "Requirements & Architecture", description: "We map out your complex business logic and design a robust system architecture that supports your current needs and future scalability." },
            { title: "Prototyping & Validation", description: "We create interactive prototypes to test workflows and validate the user experience with real stakeholders before heavy development begins." },
            { title: "Agile Development", description: "We build your application in transparent, iterative sprints, allowing you to test features regularly and pivot effectively based on early feedback." },
            { title: "Backend Integrations", description: "We establish secure connections to your database, establish robust APIs, and integrate essential third-party services like payment gateways." },
            { title: "Beta Testing & QA", description: "Rigorous automated and manual testing on physical devices to exterminate bugs, test extreme edge cases, and validate performance metrics." },
            { title: "App Store Launch", description: "We navigate the complex Apple App Store and Google Play Store submission processes, ensuring a successful, compliant launch to the public." }
        ],
        industryExpertise: ["FinTech", "HealthTech", "Logistics", "E-commerce", "On-Demand Services", "EdTech"],
        reasonsToChoose: [
            { title: "Full-Stack Muscle", description: "We don't just build the frontend. We architect the databases, design the cloud infrastructure, and write the APIs that make your app truly powerful." },
            { title: "Focus on Business Value", description: "We prioritize features that drive immediate ROI or user adoption, helping you launch leaner and iterate faster." },
            { title: "Post-Launch Growth", description: "Our relationship doesn't end at the App Store. We provide active monitoring, analytics reviews, and feature expansions to ensure your app dominates its market." }
        ],
        faqs: [
            { question: "Should I build a native app or a cross-platform app?", answer: "For 95% of businesses, cross-platform frameworks like React Native or Flutter offer the best balance of native-like performance, rapid development, and cost-efficiency. True native is generally reserved for highly intensive 3D games or apps communicating with obscure hardware." },
            { question: "How much does it cost to build an app?", answer: "An initial MVP application typically starts around $8,000, while complex enterprise platforms with significant backend requirements can exceed $40,000. We provide precise estimates after a thorough Discovery phase." },
            { question: "Do you help with App Store submissions?", answer: "Yes. Getting approved by Apple and Google can be a notoriously difficult process. We manage all compliance checks, asset generation, and communication required to get your app successfully listed." },
            { question: "Who owns the code after development?", answer: "You do. Upon project completion and final payment, 100% of the intellectual property and source code is transferred entirely to your organization." }
        ]
    },
    ai: {
        id: "ai",
        icon: Bot,
        title: "Generative AI Development",
        tagline: "Custom AI tools trained on your data that automate real work and solve problems unique to your business.",
        introSummary: "secure, custom-trained artificial intelligence solutions designed to automate workflows, uncover insights, and revolutionize how you operate.",
        description: "Artificial Intelligence is no longer just a buzzword; it is a critical competitive advantage. We specialize in developing and integrating Generative AI solutions that seamlessly fit into your existing operations. Whether you need a highly intelligent customer service chatbot trained exclusively on your proprietary documentation, or automated content generation pipelines that scale your marketing efforts exponentially, our AI engineers build secure interfaces utilizing industry-leading Large Language Models.",
        details: [
            "Custom AI chatbots trained securely on your proprietary knowledge base.",
            "Automated document analysis and data extraction pipelines.",
            "Generative workflows for marketing, sales, and internal support.",
            "Advanced Natural Language Processing (NLP) integration.",
            "Computer vision solutions for image analysis.",
            "Ethical constraint setup and AI hallucination mitigation strategies."
        ],
        technologies: ["OpenAI API", "LangChain", "Pinecone", "Python", "Vercel AI SDK", "LlamaIndex"],
        deliverables: [
            "AI Strategy & Feasibility Report.",
            "Custom LLM API Integrations.",
            "Vector Database configuration.",
            "Secure Chat/Assistant Output Interfaces.",
            "Prompt Engineering optimizations.",
            "Ongoing AI Model fine-tuning."
        ],
        startingAt: "$5,000",
        bookingType: "AI Consultation",
        valueProps: [
            { title: "Unmatched Operational Efficiency", description: "Automate thousands of hours of repetitive manual data entry, customer support queries, or document summarization." },
            { title: "Secure Proprietary Intelligence", description: "We utilize secure API vectoring to ensure your private company data is never used to train public open-source models." },
            { title: "Always-On Reliability", description: "Your AI workforce doesn't sleep. Service your global clients instantly, across varied languages, 24/7." },
            { title: "Rapid Innovation Deployment", description: "We leverage frameworks like LangChain to rapidly prototype and launch powerful AI capabilities in weeks, not months." }
        ],
        whoWeHelped: [
            "Legal firms automating contract review and summarization.",
            "Customer support centers handling massive volumes of tier-1 inquiries.",
            "Marketing agencies generating custom copy at unprecedented scales.",
            "Financial institutions performing sentiment analysis on massive datasets."
        ],
        processSteps: [
            { title: "AI Feasibility Assessment", description: "We analyze your workflows and data silos to identify the highest ROI use cases for Generative AI integration without compromising security." },
            { title: "Data Preparation & Sanitization", description: "We clean, structure, and securely embed your proprietary documentation into sophisticated Vector Databases for rapid retrieval." },
            { title: "Prompt Engineering & Prototyping", description: "Our engineers craft rigid, highly specialized prompts to ensure the AI behaves predictably and outputs precisely the desired format." },
            { title: "System Integration", description: "We connect the tailored AI brain to your existing software stack via secure APIs, whether it's Slack, Salesforce, or your custom web platform." },
            { title: "Stress Testing & Hallucination Checks", description: "We aggressively test the model with edge-case queries to guarantee it cannot leak data or invent false information (hallucinate) in production." },
            { title: "Deployment & Active Tuning", description: "We launch the tool and continuously adjust its constraints and data access based on real-world interactions and user feedback." }
        ],
        industryExpertise: ["LegalTech", "FinTech", "E-commerce", "Education", "Customer Service", "Publishing"],
        reasonsToChoose: [
            { title: "Cutting-Edge Expertise", description: "The AI landscape shifts weekly. We dedicate significant resources to staying at the absolute forefront of LLM technologies so you don't have to." },
            { title: "Security First Approach", description: "We understand that your data is your most valuable asset. Our architectures prioritize data isolation and strict access controls." },
            { title: "Pragmatism Over Hype", description: "We don't build AI just because it's trendy. We ruthlessly evaluate implementations based on their ability to solve actual business problems and reduce costs." }
        ],
        faqs: [
            { question: "Is my business data safe if we use AI?", answer: "Yes. When building enterprise AI solutions, we utilize strict enterprise API agreements with providers like OpenAI to ensure your proprietary data is strictly siloed and explicitly blocked from being used to train standard public models." },
            { question: "Can the AI generate false information?", answer: "AI 'hallucinations' can happen, but we aggressively mitigate this using a technique called Retrieval-Augmented Generation (RAG). By strictly forcing the AI to only cite trusted documents we provide in a closed system, we drastically reduce the chance of fabricated answers." },
            { question: "Do we need an existing software team to use your AI tools?", answer: "Not at all. We build intuitive front-end interfaces and deploy them fully. Your non-technical staff will be able to interact with the powerful AI backend as easily as they use a web browser." },
            { question: "What workflows are best suited for Generative AI?", answer: "High ROI targets generally include text summarization (large documents), semantic search across messy databases, tier-1 customer support automation, and generating repetitive reports or templates based on structured data." }
        ]
    },
    "ux-ui-design": {
        id: "ux-ui-design",
        icon: Cpu,
        title: "UX & UI Design Services",
        tagline: "Research driven design that makes complex products feel simple, so users stay longer and convert more often.",
        introSummary: "stunning, intuitive interface designs fundamentally rooted in user psychology and heavy data-driven research.",
        description: "Great design is rarely just about making things look pretty; it's an exercise in complex problem-solving. Our UX/UI design team creates high-converting digital experiences by deeply understanding your users' friction points and behaviors. From initial wireframing and exhaustive user research to developing robust, scalable design systems and high-fidelity prototypes, we ensure every interaction is meaningful, accessible, and aligned perfectly with your brand's core objectives.",
        details: [
            "In-depth user research, surveys, and persona development.",
            "Strategic information architecture and user flow mapping.",
            "Low-fidelity wireframing and rapid structural prototyping.",
            "High-fidelity visual design, typography, and color theory application.",
            "Comprehensive, scalable Design System creation.",
            "Rigorous usability testing and heuristic evaluations."
        ],
        technologies: ["Figma", "Adobe XD", "Framer", "Maze", "Miro", "Webflow"],
        deliverables: [
            "UX Research & Strategy Report.",
            "Interactive High-Fidelity Prototypes.",
            "Complete Component Design System.",
            "Mobile and Desktop Screen Mocks.",
            "Usability Testing Analytics.",
            "Comprehensive Developer Handoff Docs."
        ],
        startingAt: "$2,500",
        bookingType: "Design Audit",
        valueProps: [
            { title: "Data-Driven Decisions", description: "We eliminate guesswork. Our design choices are backed by cognitive psychology, A/B testing, and direct user feedback." },
            { title: "Frictionless Conversions", description: "We systematically audit and remove user roadblocks, simplifying complex tasks to significantly increase sign-ups and sales." },
            { title: "Scalable Uniformity", description: "Our robust Design Systems ensure that as your product grows, your brand's visual language remains completely consistent across hundreds of screens." },
            { title: "Developer-Ready Handoffs", description: "Because we are an engineering agency, our designers build files exactly how developers need them, preventing costly miscommunications during build phases." }
        ],
        whoWeHelped: [
            "B2B SaaS platforms suffering from high user churn due to complex interfaces.",
            "E-commerce brands seeking to modernize their checkout flow to reduce cart abandonment.",
            "Early-stage startups needing a premium, trustworthy brand identity to secure funding.",
            "Enterprise software suites undergoing complete legacy system modernization."
        ],
        processSteps: [
            { title: "Discovery & Empathy", description: "We interview stakeholders and conduct qualitative user research to profoundly understand the problem space and the target audience's genuine motivations." },
            { title: "Information Architecture", description: "We map out the structural skeleton of the application, organizing content and navigation to ensure users can find what they need instantaneously." },
            { title: "Wireframing", description: "We rapidly establish the core layout and functionality of screens without the distraction of color or typography, focusing entirely on usability." },
            { title: "Visual Design (UI)", description: "We breathe life into the wires, applying brand colors, precise typography, micro-interactions, and stunning visual assets." },
            { title: "Prototyping & Testing", description: "We link the screens into a clickable prototype and put it in front of real users, watching them navigate to identify and rectify confusion early." },
            { title: "Systemization & Handoff", description: "We compile all buttons, forms, and states into a strict Design System and collaborate closely with engineers to ensure pixel-perfect implementation." }
        ],
        industryExpertise: ["SaaS", "E-commerce", "FinTech", "HealthTech", "Education", "Media"],
        reasonsToChoose: [
            { title: "Engineering Synergy", description: "Designers who don't understand code design impossible interfaces. Our UX team sits alongside our developers, guaranteeing what we design can actually be built efficiently." },
            { title: "Business Alignment", description: "We aren't just designing art; we are engineering business outcomes. Every visual choice is traced back to a specific KPI like retention or conversion." },
            { title: "Obsessive Attention to Detail", description: "From the duration of a hover animation to the exact contrast ratio of a disabled button, we sweat the microscopic details that create premium experiences." }
        ],
        faqs: [
            { question: "What is the difference between UX and UI?", answer: "UX (User Experience) is the functional logic: how easily a user can accomplish a task, based on research and structural layouts. UI (User Interface) is the visual execution: the colors, typography, spacing, and aesthetics of those structural layouts." },
            { question: "Do you offer UX audits for existing products?", answer: "Yes. We offer comprehensive heuristic evaluations where we analyze your existing application against established design principles and provide a prioritized list of actionable improvements to boost usability." },
            { question: "What do I receive at the end of the design phase?", answer: "You will receive a complete Figma file containing all screens, interactive prototypes, and a unified Design System (UI Kit) ready for your engineering team, along with all associated exported visual assets." },
            { question: "How long does the UX/UI process take?", answer: "A thorough design phase for a standard web application or mobile app typically ranges from 4 to 8 weeks, heavily dependent on the depth of user research required and the total complexity of the app's features." }
        ]
    },
    "cloud-consulting": {
        id: "cloud-consulting",
        icon: Cloud,
        title: "Cloud Consulting & Services",
        tagline: "We plan your cloud migration, optimize your spend, and architect infrastructure that scales without surprises.",
        introSummary: "strategic, highly secure cloud migration and infrastructure architectures that drastically reduce operational costs and enhance system resilience.",
        description: "Navigating the complexities of modern cloud infrastructure requires deep expertise to avoid skyrocketing costs and security vulnerabilities. Our certified cloud consultants partner with your leadership teams to assess your current infrastructure, map out comprehensive migration strategies, and architect robust cloud-native environments. Whether you are moving legacy systems to AWS, optimizing Azure deployments, or needing strict compliance across Google Cloud, we ensure your transition is seamless, secure, and strictly optimized for ROI.",
        details: [
            "Comprehensive cloud readiness and maturity assessments.",
            "Strategic migration roadmap planning and zero-downtime execution.",
            "Deep-dive cost optimization analysis (FinOps) to stop wasted spend.",
            "Multi-cloud and hybrid-cloud strategy development.",
            "Rigorous security audits and regulatory compliance alignment.",
            "Disaster recovery planning and high-availability architecture design."
        ],
        technologies: ["AWS", "Google Cloud", "Azure", "Terraform", "Kubernetes", "Linux"],
        deliverables: [
            "Cloud Strategy & Readiness Report.",
            "Detailed Migration Roadmap.",
            "High-Availability Architecture Diagrams.",
            "FinOps Cost Optimization Plan.",
            "Security & Compliance Framework.",
            "Disaster Recovery Runbooks."
        ],
        startingAt: "$4,000",
        bookingType: "Cloud Assessment",
        valueProps: [
            { title: "Massive Cost Reduction", description: "We consistently identify massive inefficiencies in existing cloud setups, frequently reducing monthly AWS/Azure bills by 30% to 50% immediately." },
            { title: "Risk-Free Migrations", description: "Our meticulous phased migration blueprints ensure your critical legacy systems are securely transferred with absolutely zero unscheduled downtime." },
            { title: "Future-Proof Scale", description: "We architect utilizing elastic, cloud-native principles so your infrastructure automatically expands during high traffic and contracts during lulls." },
            { title: "Ironclad Compliance", description: "We ensure your architecture rigorously adheres to strict industry compliance standards including HIPAA, SOC 2, and GDPR from day one." }
        ],
        whoWeHelped: [
            "Enterprise corporations transitioning decades of on-premises servers to the cloud.",
            "Rapidly scaling tech startups whose initial infrastructure cannot handle their new traffic volume.",
            "Healthcare institutions requiring highly secure, HIPAA-compliant cloud storage environments.",
            "E-commerce platforms needing massive elasticity to handle Black Friday traffic spikes."
        ],
        processSteps: [
            { title: "Infrastructure Audit", description: "We perform a massive sweep of your current servers, networking, and data flows to map precisely what exists and where the bottlenecks hide." },
            { title: "TCO & ROI Analysis", description: "We project the Total Cost of Ownership for varied cloud strategies to prove exactly when and how the migration will pay for itself." },
            { title: "Architecture Design", description: "Our certified architects design a highly secure, scalable cloud environment customized strictly to your application's unique technical demands." },
            { title: "Migration Planning", description: "We draft a step-by-step technical roadmap detailing precisely how data and services will be moved with zero disruption to active users." },
            { title: "Proof of Concept", description: "We execute a small-scale migration of a non-critical workload to validate our assumptions and test the security protocols of the new environment." },
            { title: "Execution & Handover", description: "We oversee the full migration, validate data integrity, establish robust monitoring alerts, and hand over comprehensive operational runbooks." }
        ],
        industryExpertise: ["Enterprise Logistics", "FinTech", "Healthcare", "E-commerce", "Government", "Media Streaming"],
        reasonsToChoose: [
            { title: "Agnostic Expertise", description: "We aren't tied exclusively to AWS or Azure. We evaluate your specific needs and recommend the absolute best platform: or multi-cloud hybrid: for your specific goals." },
            { title: "Security as a Foundation", description: "Security isn't a post-launch add-on for us. Network isolation, IAM policies, and encryption are the fundamental bedrock of every architecture we propose." },
            { title: "Clear Communication", description: "Cloud computing can be filled with impenetrable jargon. We translate complex technical architectures into clear, business-driven strategy documents." }
        ],
        faqs: [
            { question: "Is moving to the cloud always cheaper?", answer: "Not automatically. A 'lift and shift' where you simply move old servers into the cloud without optimizing them can actually increase costs. True savings come from adopting cloud-native architectures that scale dynamically." },
            { question: "How do you ensure no downtime during a migration?", answer: "We utilize strategies like Blue/Green deployments and parallel running. We set up the new cloud environment entirely alongside the old one, mirror the database, and only switch the DNS traffic over once the new system is fully validated." },
            { question: "Which cloud provider is the best?", answer: "It depends heavily on your tech stack. AWS has the most massive ecosystem, Azure is phenomenal if you are heavily entrenched in Microsoft enterprise software, and GCP shines in data analytics and Kubernetes workloads." },
            { question: "What is FinOps?", answer: "FinOps (Cloud Financial Management) is the practice of bringing financial accountability to the variable spend model of cloud computing. We implement tags, budgeting alerts, and reserved instances to ensure you never get a shock at the end of the billing month." }
        ]
    },
    "startup-branding": {
        id: "startup-branding",
        icon: Sparkles,
        title: "Startup Branding",
        tagline: "We craft distinctive brands that make early-stage startups impossible to ignore: positioning, naming, identity, and a launch-ready brand system.",
        introSummary: "end-to-end startup brand systems combining sharp positioning, memorable naming, expressive visual identity, and applied brand assets ready to ship from day one.",
        description: "A great product still loses to a memorable brand. Our Startup Branding service is a senior, founder-friendly engagement that compresses what most agencies stretch over months into a focused sprint. We sharpen your positioning, find a name that earns the .com conversation, and design a complete visual identity (logo system, palette, typography, iconography). You leave with a brand book, a social and pitch-deck kit, and a launch-ready website rollout that makes investors, hires, and customers take you seriously from your first impression.",
        details: [
            "Brand strategy: positioning, audience, narrative, and tone of voice.",
            "Naming and verbal identity, with domain, trademark, and social handle screening.",
            "Logo system: primary mark, monogram, lockups, and responsive variants.",
            "Color, typography, iconography, and motion principles.",
            "Brand guidelines (PDF + Figma), social kit, and pitch deck templates.",
            "Launch website and applied brand rollout across key touchpoints."
        ],
        technologies: ["Figma", "Adobe Illustrator", "Adobe Photoshop", "After Effects", "Webflow", "Notion"],
        deliverables: [
            "Brand strategy and positioning document.",
            "Final name with domain and handle recommendations.",
            "Complete logo system and visual identity assets.",
            "Brand guidelines (PDF + Figma library).",
            "Social media kit and pitch deck templates.",
            "Launch-ready marketing website with applied brand."
        ],
        startingAt: "Custom Quote",
        bookingType: "Brand Strategy Session",
        valueProps: [
            { title: "Founder-Speed Sprints", description: "We compress the typical 3-month agency cycle into a focused, weekly-cadence sprint so you can launch, raise, and recruit on your timeline, not ours." },
            { title: "Strategy First, Pixels Second", description: "Every visual decision ties back to your positioning, audience, and category. The result is a brand that says something, not just one that looks nice." },
            { title: "A System, Not a Logo", description: "You get a real brand system: components, rules, and templates your team can extend without us, on day one." },
            { title: "Ready to Ship", description: "We hand off a launch-ready website, social kit, and deck so the new brand is live and earning attention the day we wrap." }
        ],
        whoWeHelped: [
            "Pre-seed and seed-stage founders preparing to launch.",
            "Technical teams that need a sharper, investor-ready story.",
            "Stealth startups coming out of stealth with a name change.",
            "Series A companies rebranding for their next chapter."
        ],
        processSteps: [
            { title: "Discovery & Positioning", description: "We run founder interviews, competitive teardown, and audience research to lock down what you stand for and who you stand for it against." },
            { title: "Naming & Verbal Identity", description: "We generate, screen, and pressure-test names against domain, trademark, and handle availability, then craft your tagline and tone of voice." },
            { title: "Visual Direction", description: "Two or three distinct creative territories explored as moodboards and applied previews so you choose a direction with real-world context, not abstract Pinterest boards." },
            { title: "Identity Design", description: "We refine the chosen direction into a full identity system: logo, color, type, iconography, and motion, all designed to scale across every surface." },
            { title: "Brand System & Guidelines", description: "We package everything into a Figma library and brand book your team can extend, plus social and pitch templates ready to use." },
            { title: "Launch & Rollout", description: "We apply the brand to a launch site and core touchpoints, hand over the system, and brief your team so the rollout lands clean." }
        ],
        industryExpertise: ["SaaS", "FinTech", "AI & ML", "DevTools", "Healthtech", "Consumer Apps"],
        reasonsToChoose: [
            { title: "Senior, In-House Team", description: "A senior strategist and designer lead your brand from start to finish. No account managers, no junior handoffs, no churn between phases." },
            { title: "Engineered for Launch", description: "We are a software studio, so the brand is designed with the website, product UI, and pitch deck already in mind, not as an afterthought." },
            { title: "Fixed Scope, Clear Cadence", description: "You always know what is shipping this week, what is next, and exactly what you are paying for. No surprise invoices, no scope drift." }
        ],
        faqs: [
            { question: "How long does a startup brand take?", answer: "Most engagements run 4 to 8 weeks end to end, depending on whether you also need naming and a launch website. We move at founder speed without cutting strategy corners." },
            { question: "Can you handle naming, including the legal screening?", answer: "Yes. We generate and shortlist names with domain and handle screening, plus a preliminary trademark check. For final legal clearance we coordinate with your IP counsel or recommend one." },
            { question: "Do we get the editable source files?", answer: "Always. You own everything: editable Figma files, vector logo source, Adobe files where relevant, fonts, and a full Figma brand library your team can extend." },
            { question: "Can you also build the launch website?", answer: "Yes. Our engineering team can build the launch site directly on top of the new brand, so the rollout is consistent and ready for traffic on day one." },
            { question: "What if we already have a name and just need identity?", answer: "No problem. We scope the engagement to what you actually need, whether that is identity-only, a rebrand of an existing mark, or a full strategy plus identity package." }
        ]
    }
};
