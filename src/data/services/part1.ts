import { Globe, Smartphone, Bot, Cpu, Cloud } from "lucide-react";
import type { ServiceEntry } from "./types";

export const servicesPart1: Record<string, ServiceEntry> = {
    websites: {
        id: "websites",
        icon: Globe,
        title: "Custom Software Development",
        tagline: "Beautiful, fast websites that drive results.",
        introSummary: "high-performance, customized web platforms tailored specifically to amplify your digital presence and optimize conversion rates.",
        description: "In today's digital landscape, your website is the cornerstone of your business identity. Our custom software development service goes beyond templates. We design and construct bespoke, responsive web architectures that prioritize performance, accessibility, and user engagement. By leveraging modern web frameworks, we ensure your platform isn't just visually stunning—it's a rapid, secure, and scalable asset that acts as your hardest working salesperson.",
        details: [
            "Custom UI/UX design tailored to your specific brand identity.",
            "Mobile-first responsive layouts that adapt perfectly to any device size.",
            "Built-in Technical SEO best practices to ensure high search engine visibility.",
            "Headless CMS integration for frictionless content management.",
            "Performance optimization achieving high Core Web Vitals scores.",
            "Deep analytics and event-driven conversion tracking setup."
        ],
        technologies: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Vercel", "Framer Motion"],
        deliverables: [
            "A fully custom, modern web application.",
            "Scalable frontend architecture.",
            "Performance and accessibility audits.",
            "CMS integration and training.",
            "Google Analytics and Tag Manager setup.",
            "30-day post-launch technical support."
        ],
        startingAt: "$3,000",
        bookingType: "Strategy Session",
        valueProps: [
            { title: "Lightning Fast Performance", description: "Our Next.js architectures ensure sub-second page loads, dramatically reducing bounce rates and improving your Google search rankings." },
            { title: "Bespoke Brand Digitalization", description: "We don't use generic themes. Every pixel is crafted specifically to tell your unique brand story and build unparalleled user trust." },
            { title: "Scalable Foundations", description: "Built with modern, component-driven React ecosystems, your site is designed to smoothly scale as your traffic and feature requirements grow." },
            { title: "Conversion Optimized", description: "We embed proven UX principles into the layout to naturally guide visitors toward your primary calls-to-action." }
        ],
        whoWeHelped: [
            "Series A SaaS companies needing a professional marketing site.",
            "E-commerce brands aiming to escape template constraints.",
            "B2B service providers requiring high-trust professional redesigns.",
            "Local enterprises looking to dominate regional digital markets."
        ],
        processSteps: [
            { title: "Discovery & Strategy", description: "We begin by deeply understanding your business goals, target audience, and competitive landscape to define a clear technical and visual roadmap." },
            { title: "UX/UI Design", description: "Our expert designers craft wireframes and high-fidelity interactive prototypes, ensuring the user journey is intuitive and visually striking before writing a single line of code." },
            { title: "Frontend Engineering", description: "Our developers translate the approved designs into a pixel-perfect, highly responsive application using cutting-edge frameworks like React and Next.js." },
            { title: "Backend & CMS Integration", description: "We connect your seamless frontend to a powerful headless CMS and any required third-party APIs or backend systems." },
            { title: "QA & Optimization", description: "Rigorous testing across browsers, devices, and network speeds to guarantee absolute stability, accessibility, and near-perfect Lighthouse scores." },
            { title: "Launch & Training", description: "We handle the complex deployment process, hand over the keys, and provide comprehensive training on managing your new digital asset." }
        ],
        industryExpertise: ["SaaS", "E-commerce", "Healthcare", "Financial Services", "Real Estate", "Professional Services"],
        reasonsToChoose: [
            { title: "Engineering Excellence", description: "We are software engineers first. We build robust, scalable architectures, not fragile websites that break during updates." },
            { title: "Transparent Communication", description: "You are never left in the dark. We work in agile sprints with regular check-ins and total visibility into our progress." },
            { title: "Long-Term Partnership", description: "We view our clients as partners. Our goal is to build a platform that serves you for years, not just a quick deliverable." }
        ],
        faqs: [
            { question: "How long does a custom website build typically take?", answer: "A standard highly customized marketing site typically takes between 4 to 8 weeks from initial discovery to final launch, depending on complexity and revision cycles." },
            { question: "Will I be able to update content myself?", answer: "Absolutely. We integrate powerful, user-friendly Content Management Systems (CMS) like Sanity or Strapi, allowing you to easily update text, images, and blog posts without touching any code." },
            { question: "Do you handle hosting and domain setup?", answer: "Yes, we handle the entire deployment pipeline. We typically deploy utilizing world-class infrastructure like Vercel or AWS, and will configure your custom domains and SSL certificates." },
            { question: "Is SEO included in the build?", answer: "Yes, technical SEO is baked into our development process. We ensure proper semantic HTML, dynamic meta tags, fast load speeds, and clean URL structures to give you the best possible starting point for search engines." }
        ]
    },
    apps: {
        id: "apps",
        icon: Smartphone,
        title: "Mobile Apps Development",
        tagline: "Custom applications that scale with your vision.",
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
        tagline: "Intelligent tools that work while you sleep.",
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
        tagline: "Interfaces that delight users and drive conversions.",
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
        tagline: "Strategic cloud guidance from certified experts.",
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
            { title: "Agnostic Expertise", description: "We aren't tied exclusively to AWS or Azure. We evaluate your specific needs and recommend the absolute best platform—or multi-cloud hybrid—for your specific goals." },
            { title: "Security as a Foundation", description: "Security isn't a post-launch add-on for us. Network isolation, IAM policies, and encryption are the fundamental bedrock of every architecture we propose." },
            { title: "Clear Communication", description: "Cloud computing can be filled with impenetrable jargon. We translate complex technical architectures into clear, business-driven strategy documents." }
        ],
        faqs: [
            { question: "Is moving to the cloud always cheaper?", answer: "Not automatically. A 'lift and shift' where you simply move old servers into the cloud without optimizing them can actually increase costs. True savings come from adopting cloud-native architectures that scale dynamically." },
            { question: "How do you ensure no downtime during a migration?", answer: "We utilize strategies like Blue/Green deployments and parallel running. We set up the new cloud environment entirely alongside the old one, mirror the database, and only switch the DNS traffic over once the new system is fully validated." },
            { question: "Which cloud provider is the best?", answer: "It depends heavily on your tech stack. AWS has the most massive ecosystem, Azure is phenomenal if you are heavily entrenched in Microsoft enterprise software, and GCP shines in data analytics and Kubernetes workloads." },
            { question: "What is FinOps?", answer: "FinOps (Cloud Financial Management) is the practice of bringing financial accountability to the variable spend model of cloud computing. We implement tags, budgeting alerts, and reserved instances to ensure you never get a shock at the end of the billing month." }
        ]
    }
};
