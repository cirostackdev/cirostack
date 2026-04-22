import { Database, Lock, TestTube, GitBranch, BarChart } from "lucide-react";
import type { ServiceEntry } from "./types";

export const servicesPart3: Record<string, ServiceEntry> = {
    "data-engineering": {
        id: "data-engineering",
        icon: Database,
        title: "Data Engineering & Data Science",
        tagline: "Turn raw data into your competitive advantage.",
        introSummary: "high-throughput data architectures and robust ETL pipelines designed to transform chaotic corporate data into crystal-clear predictive analytics.",
        description: "In the modern economy, data is your most valuable asset, but only if it's accessible, clean, and structured. Our data engineers build the sophisticated plumbing required to ingest millions of data points from disparate silos, cleanse them in real-time, and store them securely in highly optimized Data Warehouses. We then layer powerful Business Intelligence (BI) dashboards on top, giving your leadership team the immediate, mathematically sound visualizations needed to make crucial strategic decisions.",
        details: [
            "Enterprise Data Warehouse (EDW) and Data Lake architecture and deployment.",
            "High-volume, fault-tolerant ETL/ELT pipeline construction.",
            "Real-time streaming data architectures utilizing Kafka or Kinesis.",
            "Interactive Business Intelligence (BI) dashboard creation.",
            "Aggressive data quality frameworks and automated cleansing protocols.",
            "Advanced predictive analytics and statistical forecasting models."
        ],
        technologies: ["Snowflake", "dbt", "Airflow", "Apache Kafka", "Tableau", "AWS Redshift"],
        deliverables: [
            "Data Infrastructure Architecture.",
            "Automated ETL Pipelines.",
            "BI Dashboards (Tableau/PowerBI).",
            "Data Quality Metric Reports.",
            "Comprehensive Data Catalog.",
            "Analytics Training Documentation."
        ],
        startingAt: "$5,500",
        bookingType: "Data Architecture Review",
        valueProps: [
            { title: "Shatter Data Silos", description: "We unify the disjointed data trapped in your marketing, sales, and operations software into a single, undeniable source of corporate truth." },
            { title: "Real-Time Decision Making", description: "Stop relying on month-old Excel reports. We build streaming pipelines that update your executive dashboards second by second." },
            { title: "Uncompromising Data Integrity", description: "We implement rigid automated testing within your pipelines so that corrupted or missing data triggers an alert before it ever reaches a leadership dashboard." },
            { title: "Future-Proof Scale", description: "By utilizing massive cloud-native databases like Snowflake, your infrastructure will effortlessly handle terabytes of data without slowing down analytical queries." }
        ],
        whoWeHelped: [
            "Global e-commerce brands needing real-time inventory and logistics tracking dashboards.",
            "Financial institutions requiring massive, unified ledgers for instantaneous auditing.",
            "Marketing agencies aggregating ad spend metrics across 50 different API endpoints.",
            "Healthcare networks striving to unify patient records across disparate legacy software systems."
        ],
        processSteps: [
            { title: "Data Discovery & Strategy", description: "We interview stakeholders to define precisely what business questions must be answered, and audit your current systems to locate where that data hides." },
            { title: "Architecture Design", description: "We design the schema of the central Data Warehouse and map the complex ETL (Extract, Transform, Load) pipelines required to reliably feed it." },
            { title: "Pipeline Engineering", description: "Our engineers write the robust Airflow or dbt code that extracts the data from your APIs, cleans it, standardizes it, and loads it securely." },
            { title: "Data Modeling", description: "We organize the raw data within the warehouse into highly optimized 'star schemas' so that analytical queries run in milliseconds, not hours." },
            { title: "BI Dashboard Development", description: "We connect tools like Looker or Tableau to the new warehouse, designing beautiful, intuitive visual dashboards tailored explicitly to executive KPIs." },
            { title: "Governance & Handoff", description: "We establish strict access controls, document the data catalog, and train your internal analysts on how to securely query the new infrastructure." }
        ],
        industryExpertise: ["Retail", "Financial Services", "Logistics", "Marketing", "Healthcare", "SaaS"],
        reasonsToChoose: [
            { title: "Business Context", description: "We don't just move data. Our engineers understand the underlying business mechanics—we know the difference between gross revenue and recognized revenue." },
            { title: "Modern Stack Mastery", description: "We utilize the modern data stack (dbt, Snowflake, Fivetran), avoiding outdated, slow, on-premises Hadoop clusters in favor of agile, cloud-native tools." },
            { title: "Focus on Governance", description: "We enforce strict data governance and PII masking protocols, ensuring your analytics initiatives never accidentally violate GDPR or CCPA." }
        ],
        faqs: [
            { question: "What is an ETL pipeline?", answer: "ETL stands for Extract, Transform, Load. It is the automated software process that pulls raw data out of your various tools (like Salesforce or Stripe), cleans and formats it, and loads it into a central database." },
            { question: "Do we need a Data Warehouse or a Data Lake?", answer: "A Data Warehouse is highly structured, optimized for fast BI querying (like Snowflake). A Data Lake is a vast pool of raw, unstructured data (like AWS S3) used mostly by Data Scientists. For most businesses seeking clean dashboards, a Warehouse is the priority." },
            { question: "How do you handle messy or missing data?", answer: "We build automated 'cleaning' steps into the transformation process. If a required field is missing, the pipeline can either reject the row into a dead-letter queue for manual review, or impute a safe default value, based on your business rules." },
            { question: "Can we use our existing visualization tools?", answer: "Yes. Once the Data Warehouse is built and structured, you can plug almost any modern BI tool (PowerBI, Tableau, Looker, Metabase) directly into it." }
        ]
    },
    "iam": {
        id: "iam",
        icon: Lock,
        title: "Identity & Access Management",
        tagline: "Secure, seamless identity for every user.",
        introSummary: "impenetrable yet frictionless authentication gateways designed to absolutely secure your infrastructure while delighting your users.",
        description: "In an era of relentless cyber threats and remote workforces, the traditional network perimeter is dead; Identity is the new perimeter. Our Identity & Access Management (IAM) architectures ensure that the exact right individuals have the exact right access to the exact right resources, at the exact right time. We specialize in untangling complex legacy permissions, implementing Zero-Trust architectures, and deploying seamless Single Sign-On (SSO) and Multi-Factor Authentication (MFA) across your entire enterprise ecosystem.",
        details: [
            "Enterprise Single Sign-On (SSO) and diverse Identity Federation.",
            "Adaptive Multi-Factor Authentication (MFA) implementation.",
            "Strict Role-Based (RBAC) and Attribute-Based (ABAC) Access Control.",
            "OAuth 2.0 and OpenID Connect API security protocols.",
            "Privileged Access Management (PAM) for highly sensitive administrative accounts.",
            "Complete Zero-Trust Network Architecture design."
        ],
        technologies: ["Auth0", "Okta", "AWS Cognito", "Keycloak", "Azure AD", "OAuth 2.0"],
        deliverables: [
            "Comprehensive IAM Architecture Design.",
            "Okta/Auth0 SSO Implementation.",
            "Automated User Provisioning Scripts.",
            "Extensive Audit Logging Dashboards.",
            "Security & Threat Assessment Report.",
            "Access Policy Documentation."
        ],
        startingAt: "$4,500",
        bookingType: "Security Review",
        valueProps: [
            { title: "Zero-Trust Security", description: "We operate on the principle of 'Never Trust, Always Verify', instantly locking down your attack surface against both external breaches and internal threats." },
            { title: "Frictionless Onboarding", description: "We automate the provisioning process. When HR adds a new employee, they are instantly, securely granted access to the exact 15 software tools their specific role requires." },
            { title: "Infallible Compliance", description: "Robust identity logging is the cornerstone of passing SOC 2, HIPAA, and GDPR audits. Our systems perfectly trace exactly who touched what data, and when." },
            { title: "End-User Delight", description: "By implementing universal SSO, your employees or customers only need to remember one highly secure password to seamlessly access your entire suite of applications." }
        ],
        whoWeHelped: [
            "Rapidly scaling tech companies needing to quickly offboard ex-employees perfectly across 50+ SaaS tools.",
            "Healthcare networks requiring strict HIPAA-compliant access controls for sensitive patient records.",
            "Financial institutions implementing mandatory, adaptive MFA across their entire global workforce.",
            "Consumer applications needing to securely merge three different legacy user databases into one streamlined login."
        ],
        processSteps: [
            { title: "Identity Landscape Audit", description: "We map every single software tool your company uses, identifying orphaned accounts, over-privileged users, and toxic security gaps." },
            { title: "Architecture & Strategy", description: "We design the central Identity Provider (IdP) architecture—typically Okta or Auth0—and define the strict Role-Based Access Control matrix." },
            { title: "IdP Configuration", description: "Our engineers configure the central identity hub, establishing complex routing rules, custom branding, and adaptive MFA policies." },
            { title: "Application Integration", description: "We systematically connect your internal apps, third-party SaaS tools, and custom databases to the central IdP via SAML or OIDC protocols." },
            { title: "Automated Provisioning", description: "We build the SCIM pipelines that automatically create and destroy user accounts across all applications the moment a user's status changes in HR." },
            { title: "Rollout & Training", description: "We manage the delicate process of migrating your current users to the new login flows, ensuring zero lockouts and comprehensive support." }
        ],
        industryExpertise: ["Enterprise Tech", "Healthcare", "FinTech", "Government", "Education", "E-commerce"],
        reasonsToChoose: [
            { title: "Deep Protocol Knowledge", description: "We don't just click buttons in Okta. Our engineers possess profound, code-level understanding of OAuth 2.0, SAML, and OIDC cryptographic handshakes." },
            { title: "Developer-Centric IAM", description: "For customer-facing apps (CIAM), we provide your developers with the exact SDK implementations and JWT validation logic needed to secure your unique APIs." },
            { title: "Vendor Agnosticism", description: "We evaluate your specific use case to recommend the best tool—whether that is the extreme enterprise power of Okta, or the developer flexibility of Auth0." }
        ],
        faqs: [
            { question: "What is the difference between OAuth 2.0 and SAML?", answer: "SAML is an older, XML-based protocol primarily used by large enterprises to log employees into third-party tools (SSO). OAuth 2.0 is a modern, token-based framework primarily used to secure APIs and allow applications to access data on behalf of a user." },
            { question: "Is it risky to migrate all our users to a new identity provider?", answer: "Yes, user migration is the most delicate part of IAM. We utilize complex 'lazy migration' techniques where user passwords are automatically hashed and moved to the new system seamlessly during their next natural login, ensuring zero downtime or force-resets." },
            { question: "What is Zero-Trust?", answer: "Traditional security assumed anyone 'inside' the corporate network was safe. Zero-Trust assumes the network is already compromised. It requires strict identity verification for every single person and device trying to access resources, regardless of their physical location." },
            { question: "Can we use biometric logins?", answer: "Absolutely. We heavily implement WebAuthn standards, allowing your users to log in securely using Apple FaceID, Windows Hello, or YubiKeys instead of easily compromised passwords." }
        ]
    },
    "automation-testing": {
        id: "automation-testing",
        icon: TestTube,
        title: "Automation Testing Services",
        tagline: "Ship with confidence. Always.",
        introSummary: "relentless, automated Quality Assurance pipelines designed to eradicate regression bugs and mathematically guarantee code stability.",
        description: "Manual testing cannot scale with modern Agile development. If your engineers are terrified to deploy on a Friday, your testing infrastructure is broken. We architect comprehensive, automated test suites that execute thousands of complex user scenarios in seconds. By deeply integrating Playwright or Cypress into your CI/CD pipelines, we ensure that every single code commit is aggressively validated for visual regressions, API failures, and performance bottlenecks long before it ever reaches a paying customer.",
        details: [
            "Comprehensive End-to-End (E2E) browser automation testing.",
            "Strict API contract and integration testing frameworks.",
            "High-volume performance, stress, and load testing.",
            "Pixel-perfect visual regression monitoring.",
            "Deep integration directly into GitHub Actions or GitLab CI/CD.",
            "Detailed, executive-level test coverage and failure reporting."
        ],
        technologies: ["Playwright", "Cypress", "Selenium", "Jest", "k6", "Postman"],
        deliverables: [
            "Comprehensive Test Strategy Document.",
            "Fully Coded E2E Test Suite Repository.",
            "Automated CI/CD Test Pipeline.",
            "Visual Regression Baseline.",
            "Load Testing Benchmark Reports.",
            "Test Maintenance & Scaling Guide."
        ],
        startingAt: "$3,500",
        bookingType: "QA Audit",
        valueProps: [
            { title: "Zero Regression Anxiety", description: "Deploy multiple times a day with absolute certainty. Our suites automatically catch the obscure bugs that manual testers inevitably miss." },
            { title: "Massive Cost Savings", description: "Fixing a bug in production costs 100x more than fixing it in development. We catch critical architectural flaws the minute the code is written." },
            { title: "Accelerated Velocity", description: "Free your QA team from mind-numbing manual regression clicks. We automate the repetitive tasks so they can focus on complex exploratory edge cases." },
            { title: "Performance Guarantees", description: "We aggressively simulate thousands of concurrent users hitting your servers, violently identifying memory leaks and database bottlenecks before Black Friday hits." }
        ],
        whoWeHelped: [
            "E-commerce platforms losing thousands of dollars to silent checkout bugs introduced by minor UI updates.",
            "FinTech startups needing mathematical proof of transaction stability for regulatory compliance.",
            "SaaS companies seeking to transition from monthly, terrifying deployments to safe, daily releases.",
            "Healthcare apps requiring strict validation of complex, multi-page patient intake forms."
        ],
        processSteps: [
            { title: "QA Audit & Strategy", description: "We analyze your application's most critical user flows (the 'happy paths') and prioritize them based on business risk and revenue generation." },
            { title: "Framework Selection", description: "We evaluate your tech stack and select the optimal modern tooling—typically Playwright or Cypress—and configure the foundational testing architecture." },
            { title: "Test Script Engineering", description: "Our SDETs (Software Development Engineers in Test) write robust, highly resilient code to automate the complex browser interactions and API calls." },
            { title: "Visual & Load Integration", description: "We layer in pixel-by-pixel visual comparison tools and write k6 scripts to hammer your APIs with simulated heavy traffic." },
            { title: "CI/CD Pipeline Injection", description: "We embed the test suite directly into your deployment pipeline. If the tests fail, the deployment is instantly, automatically blocked." },
            { title: "Handoff & Maintenance", description: "We train your internal developers on how to easily update the tests when the UI changes, ensuring the suite doesn't quickly become obsolete." }
        ],
        industryExpertise: ["E-commerce", "SaaS", "FinTech", "HealthTech", "Media Publishing", "EdTech"],
        reasonsToChoose: [
            { title: "Resilient Selectors", description: "Amateur tests break every time a button changes color. We code tests utilizing resilient data-attributes and accessibility roles, guaranteeing they survive minor UI updates." },
            { title: "Engineers Testing Engineers", description: "Our SDETs are highly proficient software engineers. We don't just use record-and-playback tools; we write deeply programmatic, complex testing logic." },
            { title: "Holistic Coverage", description: "We don't just test the frontend. We aggressively test the underlying APIs, database states, and visual aesthetics simultaneously to guarantee total system health." }
        ],
        faqs: [
            { question: "What is the difference between Cypress and Playwright?", answer: "Cypress is deeply entrenched and fantastic for strictly frontend React/Vue testing. Playwright (by Microsoft) is newer, significantly faster, supports multiple tabs/iframes effortlessly, and natively supports WebKit (Safari). We increasingly recommend Playwright." },
            { question: "Should we aim for 100% test coverage?", answer: "No. Chasing 100% coverage leads to extreme diminishing returns and brittle tests for obscure edge cases. We target 100% coverage of your critical revenue-generating flows, and high percentage coverage of the rest." },
            { question: "How do you handle tests that randomly fail (Flaky tests)?", answer: "Flaky tests destroy developer trust. We utilize auto-retries, strict network interception to mock slow APIs, and ruthless data-cleanup scripts to ensure tests run in perfectly isolated, deterministic environments." },
            { question: "Do you integrate with our existing GitHub?", answer: "Yes. The test suite lives directly in your repository. We configure GitHub Actions so that every time a developer creates a Pull Request, the automated tests run and report the result directly on the PR." }
        ]
    },
    "devops": {
        id: "devops",
        icon: GitBranch,
        title: "DevOps Consulting Services",
        tagline: "Ship faster, fail safer, scale smarter.",
        introSummary: "streamlined, frictionless deployment pipelines and hyper-observant infrastructure cultures that violently accelerate your engineering velocity.",
        description: "DevOps is not a specific tool; it is a fundamental cultural shift bridging the gap between writing code and running it reliably. If your deployments require manual server interventions, midnight maintenance windows, or cause severe developer anxiety, you need DevOps modernization. We implement rigorous Continuous Integration and Continuous Deployment (CI/CD) pipelines, orchestrate complex containerized environments, and establish profound observability so you can ship features multiple times a day with absolute, mathematical confidence.",
        details: [
            "Advanced CI/CD pipeline design, optimization, and implementation.",
            "Container orchestration strategies utilizing Docker and Kubernetes.",
            "GitOps workflow implementation using ArgoCD or Flux.",
            "Profound observability, centralized logging, and metrics aggregation.",
            "Automated infrastructure security scanning (DevSecOps).",
            "Strategic incident response planning and blameless post-mortem culture."
        ],
        technologies: ["GitHub Actions", "Kubernetes", "Docker", "ArgoCD", "Prometheus", "Datadog"],
        deliverables: [
            "Automated CI/CD Pipelines.",
            "Containerized Application Configurations.",
            "Complete Observability Stack.",
            "DevSecOps Security Integrations.",
            "Incident Response Runbooks.",
            "DevOps Culture Training Sessions."
        ],
        startingAt: "$4,000",
        bookingType: "Velocity Audit",
        valueProps: [
            { title: "Extreme Deployment Velocity", description: "Reduce your time-to-market from months to minutes by mathematically automating the complex, error-prone manual steps of software delivery." },
            { title: "Bulletproof Reliability", description: "By utilizing immutable containers and automated rollbacks, bad code is caught instantly, and system crashes become a statistical anomaly." },
            { title: "X-Ray Observability", description: "Stop guessing why the server crashed. We implement deep telemetry mapping so you know exactly which microservice, database row, or network call caused the failure." },
            { title: "Developer Happiness", description: "Your engineers want to write features, not configure Linux servers. We automate the plumbing so your expensive talent can focus entirely on your core product." }
        ],
        whoWeHelped: [
            "Series A startups struggling to manage 20 disjointed microservices across different environments.",
            "Enterprise companies seeking to transition off brutal, infrequent quarterly release cycles.",
            "E-commerce platforms needing to instantly load-balance diverse promotional traffic spikes.",
            "FinTech networks requiring strict, automated security compliance checks before every single deployment."
        ],
        processSteps: [
            { title: "Pipeline & Culture Audit", description: "We analyze exactly how code currently travels from a developer's laptop to the production server to identify brutal bottlenecks and security risks." },
            { title: "Containerization", description: "We standardize your unwieldy applications into lightweight, identical Docker containers that run identically on a laptop as they do in the cloud." },
            { title: "CI/CD Construction", description: "We architect the automated pipelines that compile code, run exhaustive tests, scan for vulnerabilities, and prepare the secure deployment artifacts." },
            { title: "Orchestration & GitOps", description: "We configure tools like Kubernetes and ArgoCD to constantly read your code repository and automatically adjust the live servers to match the code perfectly." },
            { title: "Telemetry Injection", description: "We install Prometheus, Grafana, or Datadog, feeding millions of logs into a central dashboard to trigger automated alerts on Slack before users even notice a bug." },
            { title: "Cultural Enablement", description: "We train your engineering org on GitOps best practices, chaos engineering concepts, and how to execute blameless post-mortems after an incident." }
        ],
        industryExpertise: ["SaaS", "FinTech", "Logistics", "Media Streaming", "E-commerce", "Healthcare"],
        reasonsToChoose: [
            { title: "Pragmatic Architecture", description: "We don't over-engineer. If your app doesn't need the extreme complexity of Kubernetes, we will fiercely recommend a simpler, faster serverless pipeline." },
            { title: "Security is Standard", description: "We practice DevSecOps. We automatically embed credential scanning, dependency vulnerability checks, and container linting directly into the pipeline from day one." },
            { title: "Focus on Developer Experience (DX)", description: "The best pipeline is an invisible one. We design flows that are incredibly easy for your standard developers to use, providing immediate, clear feedback when a build fails." }
        ],
        faqs: [
            { question: "What is CI/CD?", answer: "Continuous Integration (CI) automatically merges and tests developers' code multiple times a day. Continuous Deployment (CD) automatically pushes that verified code directly to production servers. Together, they eliminate manual release anxiety." },
            { question: "What is GitOps?", answer: "GitOps is a paradigm where your Git repository is the absolute single source of truth for your infrastructure. If you want to scale up from 2 servers to 10, you don't log into AWS; you change a number '2' to a '10' in your code, and the automation handles the rest." },
            { question: "Our current deployments take 3 hours. Can you fix that?", answer: "Absolutely. Long deployments are usually caused by sequential, manual testing, bloated build artifacts, or monolithic codebases. We parallelize the tests, utilize heavy caching, and often reduce 3-hour builds down to 5 minutes." },
            { question: "Do we need a full-time DevOps engineer after you leave?", answer: "It depends on your scale. We build highly documented, self-healing systems intended to be easily managed by your senior backend engineers. For massive enterprises, a dedicated reliability engineer is eventually recommended." }
        ]
    },
    "software-auditing": {
        id: "software-auditing",
        icon: BarChart,
        title: "Software Auditing Services",
        tagline: "Know what you own — and what's at risk.",
        introSummary: "ruthless, exhaustive technical analysis of your legacy codebases to mathematically expose hidden technical debt, security vulnerabilities, and scaling bottlenecks.",
        description: "Whether you are preparing for an acquisition, acquiring a new startup yourself, or simply tired of your application crashing, you need absolute clarity on the underlying health of the code. We perform forensic Software Audits. Our senior architects utilize advanced static analysis tools paired with decades of intuitive engineering experience to tear apart your architecture. We uncover the toxic technical debt that slows your velocity, identify glaring security holes, and provide a brutally honest, prioritized roadmap to modernize the platform.",
        details: [
            "Extensive codebase quality, complexity, and maintainability grading.",
            "Comprehensive cloud and database architecture structural assessment.",
            "Deep dependency vulnerability scanning and zero-day threat analysis.",
            "Application performance profiling and memory leak detection.",
            "Regulatory compliance technical review (SOC 2, HIPAA, GDPR).",
            "Actionable, prioritized technical remediation roadmapping."
        ],
        technologies: ["SonarQube", "Snyk", "AWS Config", "Lighthouse", "CodeClimate", "Datadog"],
        deliverables: [
            "Executive Summary & Risk Matrix.",
            "Deep Technical Codebase Report.",
            "Cloud Architecture Diagrams & Flaws.",
            "Security Vulnerability Register.",
            "Prioritized Remediation Roadmap.",
            "Stakeholder Presentation Session."
        ],
        startingAt: "$2,500",
        bookingType: "Initiate Audit",
        valueProps: [
            { title: "M&A Technical Due Diligence", description: "Don't buy a lemon. We provide investors and acquiring companies the absolute truth about the software asset they are purchasing before the ink dries." },
            { title: "Expose Hidden Risks", description: "We systematically uncover the 'ticking time bombs'—outdated open-source libraries, hardcoded credentials, and fragile database queries that could destroy your business." },
            { title: "Accelerate Future Velocity", description: "By identifying the exact modules responsible for the highest technical debt, we show you exactly where to refactor to double your developers' future output speed." },
            { title: "Actionable Intelligence", description: "We don't just hand you a 100-page PDF of automated warnings. We manually curate the findings into a clear, prioritized checklist of immediate 'Quick Wins' vs 'Long-Term Fixes'." }
        ],
        whoWeHelped: [
            "Venture Capital firms requiring extreme technical due diligence before a $20M Series A injection.",
            "SaaS founders whose application routinely crashes but their current team cannot identify why.",
            "Enterprise companies seeking to understand the immense technical debt accumulated over a decade of patching.",
            "Non-technical CEOs requiring an objective, third-party grade on the performance of their outsourced dev agency."
        ],
        processSteps: [
            { title: "Access & Indexing", description: "Under strict NDAs, we securely ingest your massive source code repositories, cloud provider configurations, and database schemas into our isolated auditing environments." },
            { title: "Automated Tooling Analysis", description: "We run enterprise-grade static application security testing (SAST) and software composition analysis (SCA) to instantly flag known vulnerabilities and massive code smells." },
            { title: "Manual Architectural Review", description: "Our senior architects manually read the core logic, tracing how data moves through the application to identify severe structural design flaws automation always misses." },
            { title: "Performance Profiling", description: "We analyze load times, database query efficiency, and asset rendering to mathematically prove exactly what is causing the application to feel sluggish to end users." },
            { title: "Synthesis & Prioritization", description: "We aggregate thousands of data points into a clear Risk Matrix, distinguishing between 'Immediate Threat to Data', 'Severe Velocity Blockers', and 'Minor Best Practice Violations'." },
            { title: "Executive Briefing", description: "We present our brutal findings. We clearly explain the technical abstract concepts to non-technical stakeholders, and hand over the strict battle plan for remediation." }
        ],
        industryExpertise: ["Venture Capital", "Private Equity", "Startups", "Enterprise SaaS", "E-commerce", "FinTech"],
        reasonsToChoose: [
            { title: "Objective Brutal Honesty", description: "We have no political ties to whoever wrote the original code. We deliver an unbiased, objective, unvarnished mathematical truth about the state of the software." },
            { title: "Contextual Analysis", description: "We don't judge startup MVP code by the same standards as enterprise banking software. We evaluate the code specifically in the context of your current business goals." },
            { title: "We Fix What We Find", description: "Unlike pure auditing firms, we are a software agency. If you need a strike team to instantly execute the remediation roadmap we created, our engineers can step in the next day." }
        ],
        faqs: [
            { question: "How long does a technical audit take?", answer: "A standard comprehensive code and architecture audit typically takes between 2 to 4 weeks depending entirely on the line count of the codebase and the complexity of the cloud infrastructure." },
            { question: "Do you need our full source code?", answer: "Yes. To perform a true, valuable architectural audit, we require read-access to the repositories. All work is executed under ironclad Non-Disclosure Agreements (NDAs)." },
            { question: "What if the code is incredibly messy and undocumented?", answer: "That is exactly why you need an audit. We utilize reverse-engineering tools to automatically map relationships and database structures, piercing through the lack of documentation." },
            { question: "Will the audit disrupt our current development team?", answer: "No. The audit is almost entirely read-only and asynchronous. We may require a brief 1-hour interview with your lead engineer to understand historical context, but otherwise, they continue working uninterrupted." }
        ]
    }
};
