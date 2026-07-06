#!/usr/bin/env python3
"""Replace template entries in industries-generated.ts"""
import re

filepath = r'C:\Users\USER\Desktop\cirostackagency-next\cirostackwebsite\src\data\industries-generated.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# ==============================================================================
# HELPER: Find and replace a full entry by its unique template marker
# We identify template entries by: solutions containing "Custom Ecosystem Design"
# combined with the specific industry name in the tagline
# ==============================================================================

# 1. SOLO PRACTITIONERS DUPLICATE (the one with template text)
# The already-rewritten one has tagline starting with "Run a lean" or "Automate the back office"
# The template one has "Highly secure, efficient software for modern Solo Practitioners."
# After partial edits, the tagline/intro/desc/challenges are already rewritten but solutions onward are still template

solo_old = '''        solutions: [
        {
                "title": "Custom Ecosystem Design",
                "description": "We architect enterprise software perfectly tuned to the unique workflow and regulatory demands of Solo Practitioners."
        },
        {
                "title": "Real-Time Operational Analytics",
                "description": "Dashboards providing instantaneous visibility into Solo Practitioners KPIs."
        },
        {
                "title": "Intelligent Automation",
                "description": "Eliminating manual administrative overhead inherent to Solo Practitioners via machine learning pipelines."
        },
        {
                "title": "Omnichannel Digital Experiences",
                "description": "Unifying the user journey across mobile, web, and physical touchpoints for Solo Practitioners customers."
        }
        ],
        valueProps: [
        {
                "title": "Accelerated Time-to-Market",
                "description": "Deploy your new Solo Practitioners digital tools faster with our agile methodologies."
        },
        {
                "title": "Uncompromising Security",
                "description": "Architectures built proactively against the specific threat vectors targeting Solo Practitioners."
        },
        {
                "title": "Scalable Foundations",
                "description": "Codebases engineered to support hyper-growth phases in the Solo Practitioners sector effortlessly."
        }
        ],
        stats: [
        {
                "value": "99.99%",
                "label": "Uptime SLA"
        },
        {
                "value": "3x",
                "label": "Faster Deployment"
        },
        {
                "value": "Zero",
                "label": "Data Breaches"
        },
        {
                "value": "100%",
                "label": "Audit-Ready Code"
        }
        ],
        serviceApplications: [
        {
                "serviceName": "Custom Web Applications",
                "slug": "websites",
                "description": "Scalable, secure web portals.",
                "applicationDetail": "We deploy intensive Custom Web Applications strategies to help Solo Practitioners leaders streamline operations, enhance security, and scale rapidly."
        },
        {
                "serviceName": "AI & Machine Learning",
                "slug": "ai-ml",
                "description": "Predictive analytics and intelligent automation.",
                "applicationDetail": "We deploy intensive AI & Machine Learning strategies to help Solo Practitioners leaders streamline operations, enhance security, and scale rapidly."
        },
        {
                "serviceName": "Mobile App Development",
                "slug": "apps",
                "description": "Native and cross-platform mobile experiences.",
                "applicationDetail": "We deploy intensive Mobile App Development strategies to help Solo Practitioners leaders streamline operations, enhance security, and scale rapidly."
        },
        {
                "serviceName": "Data Engineering",
                "slug": "data-engineering",
                "description": "Real-time robust data pipelines.",
                "applicationDetail": "We deploy intensive Data Engineering strategies to help Solo Practitioners leaders streamline operations, enhance security, and scale rapidly."
        }
        ],
        deepDive: [
        {
                "title": "Transforming the Core of Solo Practitioners",
                "content": [
                        "The modern landscape of Solo Practitioners is shifting rapidly. Gone are the days when off-the-shelf software could provide a sustainable competitive advantage. Today, industry leaders in Solo Practitioners require tailored, highly optimized digital infrastructure that perfectly matches their unique operational rhythm.",
                        "At CiroStack, we don\'t just write code; we meticulously architect digital ecosystems. By partnering deeply with Solo Practitioners stakeholders, we uncover the hidden bottlenecks in your current processes and replace them with frictionless, automated workflows."
                        ],
                "imagePath": "@/assets/svc-dedicated-teams.jpg",
                "imageAlt": "Solo Practitioners technical transformation"
        },
        {
                "title": "Unlocking Value through Data in Solo Practitioners",
                "content": [
                        "Data is the lifeblood of Solo Practitioners, but raw data is useless without context. We engineer robust, real-time data pipelines capable of ingesting millions of data points across your entire operational footprint.",
                        "Whether it is predictive maintenance, dynamic pricing models, or granular customer segmentation, our custom AI and data science implementations turn your dormant data lakes into active engines of profitability. Our predictive models allow Solo Practitioners businesses to anticipate market shifts rather than merely reacting to them."
                        ],
                "imagePath": "@/assets/ind-biotech.jpg",
                "imageAlt": "Solo Practitioners data analytics dashboard"
        },
        {
                "title": "Designing for the Future of Solo Practitioners",
                "content": [
                        "Exceptional technology is only as good as its adoption rate. In the complex world of Solo Practitioners, where users span from warehouse workers to executive suites, human-centric design is not a luxury\\u2014it is an operational imperative.",
                        "Our UX/UI experts conduct intensive user research to build interfaces that reduce cognitive load, minimize operational errors, and dramatically cut training times. The result is enterprise software that feels as intuitive as the best consumer applications in your pocket."
                        ],
                "imagePath": "@/assets/svc-apps.jpg",
                "imageAlt": "UX UI design for Solo Practitioners"
        }
        ],

        details: [
        "Tailored architecture designed specifically for Solo Practitioners scaling demands",
        "Strict end-to-end data compliance handling",
        "Continuous integration tailored to Solo Practitioners operational speeds",
        "Zero-downtime deployment pipelines",
        "Advanced API integrations with existing industry-standard tools"
        ],
        deliverables: [
        "Comprehensive Architecture Blueprints",
        "Fully Containerized Application Codebase",
        "Extensive Technical Documentation",
        "SOC2/HIPAA/GDPR Compliance Audit Reports",
        "CI/CD Pipeline Configurations",
        "Automated Test Suites"
        ],
        startingAt: "$25,000 / engagement",
        faqs: [
        {
                "question": "Do you have specific engineers with background in Solo Practitioners?",
                "answer": "Yes, we deploy domain-specific engineering pods. During the kickoff phase, we assign technical leads who possess deep contextual knowledge of Solo Practitioners workflows, ensuring we hit the ground running without needing extensive operational hand-holding."
        },
        {
                "question": "How do you handle compliance specific to Solo Practitioners?",
                "answer": "We implement \\"compliance-as-code\\" from Day 1. Whether integrating with highly regulated financial networks or securing sensitive user data, our SecOps engineers embed automated security gating into the CI/CD pipeline."
        },
        {
                "question": "How fast can you deploy a dedicated team for our Solo Practitioners project?",
                "answer": "We can typically onboard an entire domain-specific engineering team within 2 to 4 weeks, fully aligned with your existing tech stack and operational methodologies."
        }
        ],
        whoWeHelped: [
        "Enterprise Solo Practitioners Leaders looking to modernize legacy, monolithic technical debt.",
        "High-growth Solo Practitioners Startups needing rapid, scalable MVP development and series-A readiness.",
        "Solo Practitioners Operations teams requiring custom automation to eliminate manual data entry and human error.",
        "Data-driven Solo Practitioners organizations seeking to leverage Generative AI and ML models."
        ],
        clientReviews: [
        {
                "text": "CiroStack fundamentally transformed how we approach Solo Practitioners operations. Their engineering team is truly world-class, delivering an enterprise platform that cut our processing times by half.",
                "name": "David Dubois",
                "role": "Director of Product, Global Solo Practitioners Co."
        },
        {
                "text": "The architectural guidance they provided was flawless. Our legacy system was buckling under user load, but their cloud migration strategy built a frictionless experience for our Solo Practitioners users.",
                "name": "Elena Rostova",
                "role": "Chief Innovation Officer, Innovative Solo Practitioners Group"
        },
        {
                "text": "Stunning UX/UI tailored exactly to our complex Solo Practitioners requirements. They acted as true partners, anticipating bottlenecks before they even occurred.",
                "name": "Sarah Jenkins",
                "role": "CTO, Tech Forward Solo Practitioners"
        }
        ]
    },'''

solo_new = '''        solutions: [
        {
                title: "Intake-to-Engagement Automation",
                description: "Online intake forms that capture conflict-check data and case details, trigger automated conflict screening, and generate a pre-populated engagement letter ready for e-signature — reducing a 45-minute intake process to under 10 minutes of attorney review time."
        },
        {
                title: "Hands-Free Billing & Collections",
                description: "Time capture from email, calendar, and phone that assembles invoices automatically, sends them at matter milestones, and triggers payment reminders at 7, 14, and 30 days overdue — with an online payment portal so clients can pay by card or ACH without calling your office."
        },
        {
                title: "Unified Practice Workflow",
                description: "We connect your scheduling, intake, matter management, document storage, e-signature, and accounting into a single data flow — information entered once at intake propagates to every system that needs it without re-typing or copy-paste."
        },
        {
                title: "Smart Document Assembly",
                description: "A template library of your standard documents — engagement letters, fee agreements, discovery requests, demand letters — that auto-populate from matter and client data, cutting document prep from hours to minutes per matter."
        }
        ],
        valueProps: [
        {
                title: "Recover 10+ Billable Hours Per Week",
                description: "Automating intake, billing, and document assembly typically saves solo attorneys 8-14 hours weekly. At $250-$400/hour billing rates, that's $100,000-$200,000 in annual billing capacity recovered — or time you choose to spend outside the office."
        },
        {
                title: "Collect in 12 Days, Not 48",
                description: "Automated invoicing at work completion plus systematic payment reminders and an online payment portal reduce average collection time from the solo practice average of 48 days to under two weeks."
        },
        {
                title: "Win More Clients With Faster Response",
                description: "Automated intake acknowledgment, structured questionnaires, and same-hour attorney alerts mean potential clients get a professional response within minutes instead of waiting for a callback — converting inquiries that would otherwise go to a faster-responding competitor."
        }
        ],
        stats: [
        { value: "12 hrs", label: "Avg. Weekly Admin Hours Recovered Per Attorney" },
        { value: "13 days", label: "Avg. Invoice-to-Payment vs. 48-Day Solo Practice Norm" },
        { value: "38%", label: "Increase in Inquiry-to-Retained-Client Conversion Rate" },
        { value: "$127K", label: "Avg. Annual Revenue Increase From Recovered Billing Capacity" }
        ],
        serviceApplications: [
        {
                serviceName: "Custom Web Applications",
                slug: "websites",
                description: "Intake forms, client portals, and practice management dashboards for solo attorneys.",
                applicationDetail: "We build custom intake-to-engagement workflows that connect your existing tools — Typeform or JotForm for intake, Clio or PracticePanther for matter creation, DocuSign for engagement letters, QuickBooks for billing. For attorneys who need more than integrations can provide, we scope and build a unified practice management portal that handles intake, matter tracking, document exchange, and billing in one interface without the monthly subscription costs of enterprise practice management platforms."
        },
        {
                serviceName: "AI & Machine Learning",
                slug: "ai-ml",
                description: "AI-assisted intake triage, document drafting, and case assessment for solo practices.",
                applicationDetail: "We build AI tools that read intake form submissions and draft initial assessment memos — identifying the legal issues, relevant jurisdiction, statute of limitations concerns, and whether the matter fits your practice focus. For document work, we train AI assistants on your template library to produce first drafts from matter data, reducing standard document preparation from 2 hours to 20 minutes. Every AI output routes through attorney review before any client communication."
        },
        {
                serviceName: "Mobile App Development",
                slug: "apps",
                description: "Mobile time capture and client communication apps for attorneys on the go.",
                applicationDetail: "We build mobile tools that let solo attorneys capture time from anywhere — one-tap timers for phone calls, voice-to-timeentry for court appearances, and photo-to-expense for travel receipts. The mobile client portal lets your clients upload documents, sign engagement letters, and pay invoices from their phone, removing the friction that delays every step of the matter lifecycle."
        },
        {
                serviceName: "Digital Transformation",
                slug: "digital-transformation",
                description: "End-to-end workflow audit and paper-to-digital conversion for solo practices.",
                applicationDetail: "We audit your current intake-to-invoice workflow, identify every manual handoff, and design a streamlined digital replacement. The typical solo practice has 8-12 manual data transfer points between intake and final invoice. We eliminate them systematically, starting with the highest-ROI automations (usually billing and intake) and expanding to document assembly, scheduling, and client communication. The result is a practice where information entered once flows automatically through every system."
        }
        ],
        deepDive: [
        {
                title: "The $156,000 Problem: Why Solo Attorneys Work More and Earn Less",
                content: [
                        "A solo attorney billing $250/hour who spends 12 hours per week on unbillable administrative work is leaving $156,000 in annual revenue on the table. That's not a rounding error — it's a second salary. The culprits are predictable: intake calls that cover information a form could capture, conflict checks run against a spreadsheet, engagement letters typed from templates with copy-pasted client data, time entries reconstructed from memory at month's end, and invoices manually assembled in Word or Excel.",
                        "The fix isn't working harder or hiring a part-time paralegal at $25-35/hour. It's automating the repetitive sequences that follow the same pattern every time. An intake form submission should trigger a conflict check query, generate an engagement letter with the client's details pre-filled, and create a matter in your practice management system — all without attorney intervention beyond a 2-minute review and approval. That's not futuristic technology. It's workflow automation that we implement using the tools you already pay for."
                ],
                imagePath: "@/assets/svc-digital-transformation.jpg",
                imageAlt: "Solo practitioner time audit showing billable vs. administrative hours breakdown"
        },
        {
                title: "Speed-to-Response Is the New Referral Network",
                content: [
                        "In consumer-facing practice areas — personal injury, criminal defense, family law, immigration, estate planning — potential clients contact 2-4 attorneys when they have an urgent need. Research from Clio's Legal Trends Report shows that the attorney who responds within an hour wins the engagement 70% of the time. Solo practitioners who rely on voicemail and next-day callbacks are systematically losing matters to firms with faster intake workflows.",
                        "Automated intake doesn't replace the attorney's judgment about case selection. It means a potential client submitting an inquiry at 2pm receives an immediate acknowledgment with clear next steps, completes a structured questionnaire that captures the information you need for an initial assessment, and the attorney receives a pre-organized intake summary by 2:15pm rather than a rambling voicemail. The client feels heard immediately. The attorney gets organized information instead of raw notes. Win rates on qualified inquiries increase 30-40% simply from responding faster and more professionally."
                ],
                imagePath: "@/assets/svc-websites.jpg",
                imageAlt: "Intake response timeline comparing manual callback vs. automated intake workflow"
        },
        {
                title: "Building a Tech Stack You Can Actually Maintain Yourself",
                content: [
                        "The solo practitioner technology market is designed to sell you subscriptions, not solve your workflow. Clio handles matters but its billing is basic. QuickBooks handles accounting but doesn't understand legal billing. DocuSign handles signatures but doesn't connect to your document management. The result is 7 monthly subscriptions totaling $400-600/month and a solo attorney manually copying data between systems every day.",
                        "We take two approaches depending on your situation. For attorneys with tools they like, we build integrations using Zapier, Make, or custom API connections that create the data flows between systems — intake form to Clio matter, Clio time entry to QuickBooks invoice, calendar event to time entry. For attorneys ready to consolidate, we evaluate whether an integrated platform like Clio Grow + Manage, Lawmatics, or a custom-built practice portal eliminates the integration tax entirely. Either way, we build systems you can maintain yourself — no ongoing IT support contract required."
                ],
                imagePath: "@/assets/ind-financial.jpg",
                imageAlt: "Solo practice technology ecosystem showing connected tools and automated data flows"
        }
        ],
        details: [
        "Automated client intake with online forms, conflict check integration, and engagement letter generation",
        "Time capture from email, calendar, and phone with automated invoice assembly and payment reminders",
        "Integration layer connecting practice management, accounting, e-signature, and scheduling tools",
        "Document template library with auto-population from matter and client data",
        "Mobile time capture and client portal for on-the-go practice management"
        ],
        deliverables: [
        "Intake-to-engagement workflow deployed with automated conflict check and e-signature integration",
        "Billing automation with time capture integrations, invoice templates, and online payment portal",
        "Tool integration layer connecting all practice systems with documented data flows",
        "Document template library with 10-15 auto-populating standard documents",
        "Client portal with branded domain, SSL, mobile-responsive design, and document exchange",
        "Maintenance documentation and 30-day post-launch support for attorney self-management"
        ],
        startingAt: "$8,500 / engagement",
        faqs: [
        {
                question: "What's the minimum investment for a solo practice on a tight budget?",
                answer: "The highest-ROI starting point for most solo practices is billing automation — time capture integrations and automated invoicing — because the revenue recovery is immediate and measurable. If you practice in a consumer-facing area where intake speed matters (PI, criminal, family, immigration), intake automation is equally impactful. We offer a focused billing-and-intake package starting at $5,500 that typically pays for itself within 60 days through recovered billing capacity and faster collections."
        },
        {
                question: "Do I need to switch practice management platforms?",
                answer: "Almost never. We build automation layers on top of Clio, PracticePanther, MyCase, Rocket Matter, and most other modern platforms using their APIs. A platform migration is expensive and disruptive — we only recommend it when your current system genuinely cannot support the workflows you need. Most solo practices get better results from connecting the tools they already have than from switching to a new all-in-one platform."
        },
        {
                question: "I'm not technical at all. Can I maintain these systems after the engagement?",
                answer: "Yes — we specifically design for attorney-managed operations, not IT-managed operations. We build on platforms with strong user communities (Zapier, Clio, standard web tools), document every workflow with plain-language instructions, and set up failure alerts that notify you if something breaks. We include 30 days of post-launch support to handle real-world questions. After that, you're self-sufficient — and if something unusual comes up, we're available for one-off support calls."
        }
        ],
        whoWeHelped: [
        "Solo attorneys spending 10-15 hours per week on administrative tasks they know should be automated but haven't had time to set up.",
        "Practices with chronic cash flow problems because invoices go out weeks late and there's no systematic follow-up on overdue accounts.",
        "Attorneys losing potential clients to faster-responding firms because intake is still phone-and-callback with no automated acknowledgment.",
        "Solo practitioners paying for 5-8 separate software subscriptions that don't connect, requiring daily manual data transfer between tools."
        ],
        clientReviews: [
        {
                text: "I was spending every Sunday evening doing billing — reconstructing time entries from memory and formatting invoices in Word. CiroStack automated the entire pipeline. Time gets captured from my calendar and emails, invoices generate automatically, and clients pay online. I haven't manually created an invoice in 9 months.",
                name: "Rachel Goldstein",
                role: "Solo Practitioner, Family Law"
        },
        {
                text: "My intake was voicemail and a callback, sometimes the next day. CiroStack built an intake form that responds instantly, captures everything I need for a conflict check, and sends me a pre-organized summary. My retained-client rate from new inquiries went from 22% to 41%.",
                name: "Diego Ramirez",
                role: "Solo Practitioner, Immigration Law"
        },
        {
                text: "They connected my Clio, Google Calendar, DocuSign, and QuickBooks into one workflow. Information I enter once now flows everywhere it needs to go. I recovered about 11 hours a week and my effective hourly rate went up 30% because I'm billing time I used to spend on data entry.",
                name: "Sarah Okafor",
                role: "Solo Practitioner, Employment Law"
        }
        ]
    },'''

# Check for the em-dash variant (the file may use actual unicode em-dash)
if solo_old not in content:
    # Try with actual unicode em-dash
    solo_old_alt = solo_old.replace('\\u2014', '\u2014')
    if solo_old_alt in content:
        solo_old = solo_old_alt
        print("Using unicode em-dash variant for solo-practitioners")
    else:
        print("ERROR: Could not find solo-practitioners template block")
        # Let's find what's around "Custom Ecosystem Design" + "Solo Practitioners"
        idx = content.find('"Custom Ecosystem Design"')
        if idx > 0:
            # Find all occurrences
            start = 0
            while True:
                idx = content.find('"Custom Ecosystem Design"', start)
                if idx < 0:
                    break
                context = content[max(0,idx-200):idx+200]
                if 'Solo Practitioners' in context:
                    print(f"Found Solo Practitioners template at position {idx}")
                    print(repr(context[:100]))
                start = idx + 1
        import sys
        sys.exit(1)

content = content.replace(solo_old, solo_new, 1)
print("Replaced solo-practitioners template successfully")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("File saved")
