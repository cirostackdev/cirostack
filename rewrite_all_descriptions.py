"""
Rewrite ALL hero section descriptions across the site:
1. 19 service pages (tagline field in services/part1-4.ts)
2. 200 industry pages (description field in industries-generated.ts)
3. 20 industry category pages (tagline field in industries.ts)
4. /industries page hero (inline in Industries.tsx)

Rules:
- Max 20 words each
- No dashes ("-")
- Brand voice: direct, concrete, active voice, warm, confident
"""

import re

# ═══════════════════════════════════════════════════════════
# 1. SERVICE PAGE TAGLINES (19 services)
# ═══════════════════════════════════════════════════════════
SERVICE_TAGLINES = {
    "websites": "We build fast, custom websites that look great, rank well, and turn visitors into paying customers.",
    "apps": "Native and cross platform mobile apps built by senior engineers, from first prototype to millions of users.",
    "ai": "Custom AI tools trained on your data that automate real work and solve problems unique to your business.",
    "ux-ui-design": "Research driven design that makes complex products feel simple, so users stay longer and convert more often.",
    "cloud-consulting": "We plan your cloud migration, optimize your spend, and architect infrastructure that scales without surprises.",
    "cloud-engineering": "We code your cloud infrastructure so it deploys itself, heals itself, and scales automatically under any load.",
    "embedded-software": "We write the firmware that makes your hardware smart, reliable, and ready to talk to the cloud.",
    "dedicated-teams": "Senior engineers who join your team, learn your codebase, and ship production code from week one.",
    "digital-transformation": "We replace legacy systems and manual processes with modern software that your team actually wants to use.",
    "ai-ml": "We build and deploy machine learning models that turn your messy data into predictions you can act on.",
    "data-engineering": "We build the pipelines that move your data from scattered sources into one clean, queryable place.",
    "iam": "We build authentication and access systems that keep the wrong people out without slowing the right people down.",
    "automation-testing": "We build automated test pipelines that catch bugs before your users do, so you ship with confidence every time.",
    "devops": "We set up the pipelines, monitoring, and infrastructure so your team ships faster and sleeps better at night.",
    "software-auditing": "We audit your codebase line by line to find the hidden debt, security holes, and performance bottlenecks slowing you down.",
    "security-audit": "We simulate real attacks on your systems, find the vulnerabilities, and show your team exactly how to fix them.",
    "nearshore": "Senior developers in your timezone who speak your language, at a fraction of local hiring costs.",
    "outsourcing": "We take full ownership of building your product, from architecture through launch, so you focus on your business.",
    "startups": "We help founders go from idea to launched product fast, with architecture that won't break when you scale.",
}

# ═══════════════════════════════════════════════════════════
# 2. INDUSTRY PAGE DESCRIPTIONS (200 industries)
# ═══════════════════════════════════════════════════════════
INDUSTRY_DESCRIPTIONS = {
    # ── Retail & E-Commerce ──
    "online-retail-stores": "We build custom storefronts that load fast, sync inventory in real time, and eliminate the platform fees eating your margins.",
    "brick-and-mortar-retail": "We build unified POS systems, clienteling apps, and foot traffic analytics that give physical retailers the data edge they need.",
    "fashion-and-apparel": "We build AI size recommendation and virtual try on tools that give shoppers confidence and cut your return rates dramatically.",
    "grocery-and-food-delivery": "We build platforms for perishable inventory, smart substitutions, and route optimized delivery that grocery commerce actually demands.",
    "electronics-and-gadgets": "We build spec comparison engines, compatibility checkers, and guided search tools that help customers choose the right product confidently.",
    "furniture-and-home-decor": "We build AR room visualization, product configurators, and delivery scheduling tools that make buying large items online feel risk free.",
    "beauty-and-cosmetics": "We build virtual shade matching, skin profile engines, and ingredient analysis tools that let beauty shoppers buy with confidence.",
    "bookstores": "We build recommendation engines, reading community platforms, and event tools that help bookstores compete on discovery, not just price.",
    "pharmacies": "We build modern prescription management, adherence tracking, and patient communication systems that replace outdated pharmacy technology.",
    "automotive-parts": "We build parts commerce platforms with VIN fitment verification and interchange databases so every order matches the right vehicle.",

    # ── Healthcare & Medical ──
    "hospitals-and-clinics": "We build patient scheduling, clinical workflow, and billing systems that help hospitals deliver better care with less administrative overhead.",
    "telemedicine": "We build secure telemedicine platforms that integrate video visits, prescriptions, and records directly into your existing practice workflow.",
    "dental-practices": "We build scheduling, insurance verification, and patient communication tools that keep dental chairs full and practices running smoothly.",
    "mental-health": "We build private, HIPAA compliant platforms for scheduling, billing, and session notes so therapists can focus entirely on patient care.",
    "pharmacies-medical": "We build pharmacy platforms that automate prescription processing, manage refills, and keep patients engaged with their medication plans.",
    "fitness-and-wellness": "We build member engagement platforms, class scheduling systems, and retention analytics that keep your fitness community showing up consistently.",
    "medical-equipment": "We build platforms that simplify complex product catalogs, automate compliance paperwork, and shorten your medical equipment sales cycles.",
    "laboratories": "We build LIMS integrations, sample tracking, and automated reporting tools that eliminate manual bottlenecks and deliver results faster.",
    "physical-therapy": "We build patient engagement, documentation, and authorization tracking tools that keep patients completing their full plan of care.",
    "senior-care": "We build care coordination, family communication, and compliance platforms that give senior care facilities real time visibility across operations.",

    # ── Financial Services ──
    "banks-and-credit-unions": "We build custom digital banking platforms with modern interfaces and mobile apps that help banks compete with fintech on experience.",
    "investment-firms": "We build platforms that unify portfolio data, market intelligence, and client reporting into one system advisors actually want to use.",
    "insurance": "We build platforms that automate underwriting, accelerate claims processing, and give policyholders the instant digital experience they now expect.",
    "fintech-startups": "We help fintech founders build products that are innovative and compliant from day one, so you ship without regulatory surprises.",
    "accounting-firms": "We build integrated platforms that automate repetitive workflows, give clients self service portals, and free accountants for advisory work.",
    "personal-finance": "We build consumer financial tools that are intuitive, beautiful, and designed to help real people build better money habits.",
    "cryptocurrency": "We build crypto platforms that combine institutional grade security with simple, consumer friendly interfaces everyday users can trust.",
    "microfinance": "We build platforms that streamline loan origination, automate repayment tracking, and help microfinance institutions scale their social impact.",
    "real-estate-investment": "We build platforms for instant deal analysis, real time portfolio tracking, and automated investor reporting across your entire fund.",
    "credit-unions": "We build member facing digital platforms that deliver modern banking experiences while reinforcing the community mission members value.",

    # ── Real Estate & Property ──
    "real-estate-agencies": "We build agency platforms with CRM, automated listing syndication, client portals, and transaction tracking that help you close deals faster.",
    "property-management": "We build tenant portals, maintenance dispatch, rent collection, and lease management tools that simplify property operations at every scale.",
    "real-estate-investment-prop": "We build investment platforms with deal analysis dashboards, portfolio tracking, and investor reporting that give you instant visibility.",
    "commercial-real-estate": "We build platforms for lease management, tenant tracking, property analytics, and deal pipelines that streamline complex commercial transactions.",
    "vacation-rentals": "We build booking engines, channel managers, guest communication tools, and dynamic pricing platforms that maximize your occupancy and revenue.",
    "property-development": "We build project tracking, budget management, contractor coordination, and stakeholder reporting tools that keep developments on schedule.",
    "real-estate-agents": "We build CRM, lead nurturing, listing management, and client communication tools that help agents close more deals with less admin.",
    "mortgage-brokers": "We build loan processing, rate comparison, document management, and compliance tools that help brokers close mortgages faster and cleaner.",
    "facility-management": "We build work order systems, preventive maintenance platforms, and space optimization tools that keep your buildings running efficiently.",
    "co-working-spaces": "We build member portals, room booking, community tools, and occupancy dashboards that help coworking spaces grow revenue per square foot.",

    # ── Education & E-Learning ──
    "schools-and-universities": "We build unified platforms that connect admissions, student records, learning management, and reporting so nothing falls through the cracks.",
    "online-courses": "We build custom course platforms with payments, adaptive video, and progress tracking that scale past off the shelf limits.",
    "corporate-training": "We build custom LMS platforms with compliance tracking, skills gap analysis, and reporting dashboards tailored to your organization's actual workflows.",
    "tutoring-services": "We build unified tutoring platforms with scheduling, progress tracking, billing, and parent communication all working together in one place.",
    "test-preparation": "We build adaptive test prep platforms that target each student's weakest areas and turn every practice hour into measurable improvement.",
    "language-learning": "We build language platforms with spaced repetition, AI conversation practice, and gamified progress tracking that keep learners engaged long term.",
    "childcare": "We build childcare platforms that automate attendance, simplify parent updates, handle billing, and keep your center compliant with licensing requirements.",
    "vocational-training": "We build learning platforms with competency tracking, hands on assessments, certification management, and employer portals that prepare students for work.",
    "educational-publishers": "We build digital publishing platforms with interactive content, adaptive learning, analytics, and institutional licensing for modern education delivery.",
    "coding-bootcamps": "We build bootcamp platforms with integrated coding environments, project assessments, career portals, and outcome tracking that drive student success.",

    # ── Hospitality & Tourism ──
    "hotels-and-resorts": "We build direct booking engines, guest experience apps, operations tools, and loyalty platforms that increase revenue and guest satisfaction.",
    "restaurants-and-cafes": "We build POS integrations, online ordering, kitchen display systems, and loyalty tools that streamline restaurant operations front to back.",
    "travel-agencies": "We build booking platforms, itinerary tools, CRM systems, and supplier integrations that let travel agents focus on creating great experiences.",
    "airlines": "We build booking systems, crew scheduling, operational dashboards, and passenger experience apps that help airlines run more efficiently.",
    "tour-operators": "We build booking engines, inventory management, guide scheduling, and customer platforms that simplify operations as your tour business grows.",
    "event-venues": "We build venue management platforms with booking calendars, client portals, vendor coordination, and event dashboards that maximize utilization.",
    "bed-and-breakfasts": "We build direct booking engines, guest communication tools, and property management systems that reduce your dependency on online travel agencies.",
    "cruise-lines": "We build guest experience apps, excursion booking, onboard service platforms, and operations dashboards that elevate every moment of the voyage.",
    "car-rentals": "We build fleet management, dynamic pricing, reservation systems, and vehicle tracking tools that help rental companies maximize fleet utilization.",
    "travel-bloggers": "We build content platforms, affiliate tools, audience analytics, and sponsorship systems that help travel creators build sustainable businesses.",

    # ── Manufacturing & Industrial ──
    "manufacturing-plants": "We build MES platforms, real time OEE dashboards, and production scheduling tools that give your factory floor instant visibility.",
    "supply-chain-and-logistics": "We build demand forecasting, supplier management, and EDI integration tools that replace spreadsheet planning with real time supply chain visibility.",
    "warehousing": "We build WMS platforms, pick and pack workflows, and labor dashboards that eliminate mispicks, cut shrinkage, and speed up fulfillment.",
    "quality-control": "We build SPC systems, digital inspection workflows, and defect tracking platforms that catch quality problems at the source.",
    "equipment-maintenance": "We build CMMS platforms, predictive maintenance dashboards, and spare parts systems that shift your team from reactive fixes to prevention.",
    "factory-automation": "We build PLC integration layers, SCADA dashboards, and IoT sensor platforms that turn raw machine data into actionable production intelligence.",
    "procurement": "We build procurement platforms with automated approval workflows, vendor portals, and spend analytics that cut purchase order cycle times dramatically.",
    "distribution": "We build route optimization, order management, and delivery tracking platforms that reduce cost per delivery and improve on time performance.",
    "chemical-and-pharmaceutical": "We build batch tracking, LIMS integrations, and regulatory documentation platforms that maintain full traceability from raw materials through finished product.",
    "automotive-manufacturing": "We build JIT inventory, supplier scorecard, and part traceability systems that meet the exact sequence delivery standards OEM customers require.",

    # ── Professional Services ──
    "law-firms": "We build unified practice management platforms that automate documents, streamline case workflows, and give law firm clients a modern experience.",
    "accounting-firms-pro": "We build practice management platforms, tax workflow engines, and client portals that eliminate the administrative overhead consuming your billable hours.",
    "consulting-agencies": "We build project tracking, resource planning, client collaboration, and utilization analytics tools that help consulting firms deliver more with less.",
    "marketing-agencies": "We build project management, creative workflow, client reporting, and resource planning platforms that keep every agency campaign on track.",
    "architecture-firms": "We build project management, BIM collaboration, client review portals, and document systems that streamline the full architectural design process.",
    "engineering-firms": "We build project tracking, technical document management, compliance tools, and reporting dashboards that keep complex engineering projects organized.",
    "hr-consulting": "We build client management, compliance tracking, assessment delivery, and analytics platforms that help HR consultancies scale their advisory capacity.",
    "it-services": "We build ticketing, SLA tracking, monitoring, and client portal platforms that help IT service providers respond faster and demonstrate value.",
    "recruiting-agencies": "We build applicant tracking, pipeline management, client portals, and placement tools that help recruiters fill positions faster with better matches.",
    "business-coaching": "We build client management, goal tracking, session scheduling, and resource library platforms that help coaching practices scale their impact.",

    # ── Media & Entertainment ──
    "film-and-video-production": "We build production management, asset tracking, scheduling, and collaboration platforms that keep film and video projects on timeline and budget.",
    "music-industry": "We build royalty tracking, distribution management, fan engagement, and catalog administration platforms for the modern music business.",
    "gaming": "We build game backends, player analytics, matchmaking engines, and live operations dashboards that keep millions of players engaged without downtime.",
    "photography": "We build unified photography platforms that handle contracts, bookings, galleries, and delivery so photographers spend time shooting, not on admin.",
    "publishing": "We build editorial workflows, digital distribution, subscription engines, and audience analytics that help publishers thrive in the digital era.",
    "news-and-media": "We build content management, audience analytics, subscription, and ad management platforms that help news organizations publish faster and earn more.",
    "podcasting": "We build podcast management platforms with production tools, distribution, analytics, and sponsorship systems that help growing shows monetize effectively.",
    "event-production": "We build event management, vendor coordination, production scheduling, and client communication platforms that ensure flawless execution every time.",
    "social-media-influencers": "We build creator platforms with content scheduling, brand deal tracking, analytics, and revenue tools that help influencers grow earnings.",
    "art-galleries": "We build gallery management, inventory tracking, collector CRM, and online exhibition platforms that help galleries reach wider audiences.",

    # ── Non-Profit & Social Enterprise ──
    "charities": "We build donor management, fundraising, volunteer coordination, and impact dashboards that help charities grow their reach and demonstrate results clearly.",
    "ngos": "We build program management, field operations, donor reporting, and impact measurement platforms that help NGOs scale mission without scaling overhead.",
    "religious-organizations": "We build community management, event scheduling, giving platforms, and member communication tools that strengthen engagement across your congregation.",
    "community-groups": "We build member management, event coordination, communication tools, and resource sharing platforms that help community organizations grow their impact.",
    "foundations": "We build grant management, application review, disbursement tracking, and outcomes reporting platforms that help foundations maximize every dollar of impact.",
    "social-enterprises": "We build platforms that integrate commerce, impact tracking, and stakeholder reporting so social enterprises can grow while measuring real outcomes.",
    "environmental-groups": "We build campaign management, field data collection, donor engagement, and environmental monitoring platforms that amplify conservation efforts at scale.",
    "educational-non-profits": "We build program delivery, student progress tracking, volunteer management, and impact reporting platforms that demonstrate measurable educational outcomes to donors.",
    "health-advocacy": "We build campaign platforms, patient support portals, research tracking, and community engagement tools that amplify health advocacy missions effectively.",
    "animal-welfare": "We build shelter management, adoption portals, foster coordination, and fundraising platforms that help animal welfare organizations save more lives.",

    # ── Technology & Startups ──
    "saas-companies": "We build billing systems, multi tenant architectures, API platforms, and admin dashboards that let SaaS product teams ship features faster.",
    "tech-startups": "We build scalable MVP architectures and engineering foundations that get you to market fast and remain extensible as you grow.",
    "mobile-app-developers": "We build cross platform architectures, backend APIs, push notification systems, and analytics frameworks that accelerate mobile development and improve retention.",
    "ai-companies": "We build ML operations platforms, data pipelines, model serving infrastructure, and monitoring dashboards that help AI teams ship faster.",
    "blockchain-crypto": "We build smart contract architectures, decentralized app frontends, wallet integrations, and blockchain analytics platforms with security built into every layer.",
    "iot-companies": "We build device management, data pipelines, edge computing, and monitoring dashboards that scale reliably with your connected device fleet.",
    "cybersecurity": "We build threat detection, security operations dashboards, compliance automation, and incident response systems that help teams defend against real threats.",
    "cloud-services": "We build orchestration layers, resource management dashboards, billing systems, and self service portals for cloud providers serving demanding enterprise customers.",
    "devops-tools": "We build CI/CD integrations, infrastructure monitoring, deployment automation, and observability dashboards that help engineering teams ship reliable software faster.",
    "developer-tools": "We build API platforms, developer portals, SDK tooling, and usage analytics that help developer tool companies drive adoption and engagement.",

    # ── Agriculture & Farming ──
    "farms": "We build farm management platforms, crop planning tools, yield dashboards, and equipment integrations that help modern farms make smarter decisions.",
    "agribusiness": "We build supply chain platforms, crop analytics, inventory, and logistics tools that help agribusiness operations optimize from seed to sale.",
    "livestock-management": "We build herd tracking, health monitoring, breeding records, and compliance platforms that help livestock operations manage large herds efficiently.",
    "farm-equipment": "We build fleet tracking, maintenance scheduling, parts inventory, and dealer management tools that keep agricultural equipment running at peak performance.",
    "produce-distribution": "We build cold chain monitoring, route optimization, freshness tracking, and order management platforms that help produce distributors minimize waste.",
    "organic-farming": "We build certification tracking, soil management, crop rotation, and compliance documentation tools that simplify organic farming operations and audits.",
    "agricultural-co-ops": "We build member management, collective purchasing, crop aggregation, and distribution platforms that strengthen cooperative efficiency and member returns.",
    "precision-agriculture": "We build field mapping, sensor integration, variable rate application, and yield prediction tools that turn agricultural data into actionable decisions.",
    "fisheries": "We build catch tracking, fleet management, compliance reporting, and market intelligence platforms that help fishing operations stay profitable and sustainable.",
    "forestry": "We build harvest scheduling, timber inventory, compliance tracking, and environmental monitoring platforms that help forestry operations manage resources sustainably.",

    # ── Construction & Engineering ──
    "construction-companies": "We build project management, budget tracking, subcontractor coordination, and field reporting platforms that keep construction projects on time and budget.",
    "architecture-firms-ce": "We build BIM workflows, client review portals, regulatory tools, and project dashboards that streamline architectural design from concept to build.",
    "civil-engineering": "We build project management, inspection tracking, compliance documentation, and resource planning platforms that keep infrastructure projects moving forward reliably.",
    "contractors": "We build job management, scheduling, material tracking, and client communication platforms that help contractors keep every project organized and profitable.",
    "subcontractors": "We build job tracking, crew scheduling, material ordering, and invoice management platforms that help subcontractors maximize productivity across multiple projects.",
    "building-materials": "We build inventory management, delivery scheduling, contractor portals, and order tracking platforms that ensure materials reach job sites on time.",
    "real-estate-development": "We build development tracking, budget management, investor reporting, and sales platforms that give developers full visibility across every project phase.",
    "facility-management-ce": "We build work order platforms, preventive maintenance schedulers, compliance tools, and tenant portals that streamline operations across building portfolios.",
    "renovation-services": "We build project management, material tracking, client portals, and scheduling platforms that help renovation companies deliver on time and budget.",
    "landscape-architecture": "We build project management, design collaboration, plant specification, and client presentation platforms that elevate landscape design workflows and deliverables.",

    # ── Transportation & Logistics ──
    "trucking-companies": "We build fleet management, dispatch, compliance tracking, and shipment visibility platforms that help trucking companies optimize every route and load.",
    "delivery-services": "We build dispatch, route optimization, tracking, and proof of delivery tools that help delivery operations scale without losing quality.",
    "freight-forwarding": "We build shipment tracking, document management, carrier integration, and customs compliance platforms that simplify the complexity of global freight logistics.",
    "warehousing-tl": "We build warehouse management, inventory tracking, picking optimization, and carrier integration platforms that maximize warehouse throughput and accuracy.",
    "public-transportation": "We build passenger information, fleet management, route optimization, and ridership analytics platforms that help transit agencies serve riders better.",
    "ride-sharing": "We build matching algorithms, dynamic pricing, driver management, and rider experience platforms that create reliable, scalable transportation networks.",
    "courier-services": "We build dispatch, route optimization, tracking, and proof of delivery platforms that help couriers meet tight deadlines cost effectively.",
    "shipping-lines": "We build vessel management, container tracking, booking portals, and operations dashboards that improve fleet utilization and real time cargo visibility.",
    "railway-companies": "We build operations management, maintenance scheduling, passenger booking, and freight tracking platforms that improve railway safety and operational efficiency.",
    "aviation": "We build flight operations, crew management, maintenance tracking, and passenger service platforms that help aviation companies improve safety and performance.",

    # ── Government & Public Sector ──
    "local-government": "We build citizen portals, permit tracking, public records platforms, and department workflow tools that modernize how local governments serve residents.",
    "federal-agencies": "We build secure program management, compliance automation, data systems, and citizen portals that modernize federal operations within strict regulatory standards.",
    "public-safety": "We build dispatch, incident management, community alert, and analytics platforms that help first responders protect their communities more effectively.",
    "education-departments": "We build data management, performance tracking, certification, and reporting platforms that help education departments improve oversight and accountability.",
    "health-departments": "We build epidemiological tracking, community health portals, vaccination management, and emergency response platforms that strengthen public health infrastructure.",
    "transportation-departments": "We build asset management, project tracking, traffic analytics, and public information platforms that help transportation departments plan and communicate better.",
    "parks-and-recreation": "We build reservation systems, program registration, facility management, and visitor analytics platforms that help parks departments serve their communities better.",
    "libraries": "We build catalog management, digital resource platforms, program registration, and patron engagement tools that help libraries serve evolving community needs.",
    "utilities": "We build meter data management, billing, outage tracking, and customer portals that help utility companies modernize operations and improve reliability.",
    "tax-authorities": "We build return processing, compliance tracking, taxpayer portals, and analytics platforms that help tax authorities improve collection efficiency and accuracy.",

    # ── Sports & Recreation ──
    "sports-teams": "We build performance analytics, fan engagement, ticketing, and sponsorship platforms that help teams win on the field and off it.",
    "fitness-centers": "We build membership management, class booking, trainer scheduling, and engagement platforms that reduce churn and build fitness communities members love.",
    "gyms": "We build membership platforms, workout tracking, class scheduling, and retention dashboards that turn casual visitors into committed long term members.",
    "yoga-studios": "We build class booking, membership, instructor scheduling, and student tracking platforms that help yoga studios grow without losing intimacy.",
    "sports-leagues": "We build league management, scheduling, referee assignment, and fan engagement platforms that keep seasons running smoothly from start to finals.",
    "outdoor-recreation": "We build booking, equipment tracking, guide scheduling, and waiver platforms that help outdoor recreation businesses scale while keeping participants safe.",
    "martial-arts-schools": "We build student management, belt tracking, scheduling, and parent communication platforms that help martial arts schools grow and retain students.",
    "dance-studios": "We build studio management, class scheduling, recital coordination, and student progress platforms that help dance studios stay organized and thrive.",
    "golf-courses": "We build tee time booking, membership, pro shop, and course operations platforms that help golf courses maximize revenue year round.",
    "sports-events": "We build event management, registration, scoring, and sponsor engagement platforms that help organizers deliver flawless sporting events at any scale.",

    # ── Beauty & Personal Care ──
    "salons": "We build booking, client management, staff scheduling, and loyalty platforms that help salons fill appointment books and grow repeat revenue.",
    "spas": "We build reservation, treatment management, therapist scheduling, and guest experience platforms that deliver seamless spa relaxation from booking to checkout.",
    "barber-shops": "We build appointment booking, client preference tracking, staff scheduling, and reputation management platforms that help barbershops build steady repeat business.",
    "nail-salons": "We build booking, service tracking, inventory, and client communication platforms that help nail salons serve more clients without sacrificing quality.",
    "estheticians": "We build client management, treatment tracking, product recommendation, and scheduling platforms that help estheticians deliver consistently personalized skincare results.",
    "tattoo-shops": "We build booking, design consultation, portfolio, and compliance tracking platforms that help tattoo shops attract clients and streamline operations.",
    "beauty-clinics": "We build clinic management, treatment planning, compliance tracking, and client communication platforms that help beauty clinics operate safely and grow.",
    "cosmetics-brands": "We build ecommerce, virtual try on, shade matching, and analytics platforms that help cosmetics brands convert browsers into loyal buyers.",
    "hair-products": "We build ecommerce, hair type assessments, subscription management, and education portals that help hair product brands grow their customer base.",
    "skincare": "We build skin assessment tools, product recommendation engines, subscription platforms, and education systems that help brands build trust and loyalty.",

    # ── Automotive ──
    "car-dealerships": "We build dealer management, inventory tracking, financing workflow, and customer relationship platforms that help car dealerships accelerate sales and service.",
    "auto-repair-shops": "We build shop management, digital inspection, parts ordering, and customer communication platforms that help repair shops increase throughput and trust.",
    "car-washes": "We build point of sale, membership, equipment monitoring, and loyalty platforms that help car washes maximize volume and recurring revenue.",
    "auto-parts-stores": "We build catalog management, fitment verification, inventory, and ecommerce platforms that help parts stores deliver accurate results with fewer returns.",
    "fleet-management": "We build fleet tracking, maintenance scheduling, driver compliance, and cost analytics platforms that reduce operating expenses and extend vehicle life.",
    "rental-cars": "We build fleet management, dynamic pricing, reservation, and vehicle tracking platforms that help rental car companies maximize utilization and revenue.",
    "motorcycle-shops": "We build inventory management, service scheduling, parts ordering, and community platforms that help motorcycle shops build loyalty and grow sales.",
    "tire-shops": "We build appointment booking, fitment tools, inventory management, and customer communication platforms that help tire shops keep service bays full.",
    "body-shops": "We build repair management, estimating, insurance integration, and customer status platforms that streamline collision repair from intake to final delivery.",
    "automotive-detailing": "We build booking, service management, inventory tracking, and customer loyalty platforms that help automotive detailing businesses grow and operate efficiently.",

    # ── Legal Services ──
    "law-firms-legal": "We build case management, document automation, time tracking, and client portals that let law firms spend more time practicing law.",
    "solo-practitioners": "We build practice management, document assembly, client portals, and billing platforms that give solo attorneys the efficiency of larger firms.",
    "corporate-law": "We build deal room, document review, compliance tracking, and collaboration platforms that accelerate corporate legal transactions and reduce oversight risk.",
    "family-law": "We build case management, client communication, deadline tracking, and financial calculation platforms that bring order to sensitive family law matters.",
    "criminal-defense": "We build case management, discovery review, deadline tracking, and client communication platforms that help defense attorneys build stronger cases faster.",
    "immigration-law": "We build case tracking, form automation, deadline management, and client communication platforms that help immigration attorneys navigate complex regulations efficiently.",
    "intellectual-property": "We build portfolio management, filing deadline tracking, prior art research, and reporting platforms that help IP firms protect valuable assets.",
    "real-estate-law": "We build transaction management, document automation, closing coordination, and client portals that streamline every step of real estate legal matters.",
    "estate-planning": "We build estate planning platforms with document automation, client review portals, and update tracking that simplify complex wealth protection workflows.",
    "legal-aid": "We build intake, case tracking, volunteer coordination, and impact reporting platforms that help legal aid organizations serve more people effectively.",

    # ── Small Business ──
    "local-retail": "We build point of sale, inventory, loyalty, and marketing platforms that help independent retailers compete and thrive in local markets.",
    "restaurants-sb": "We build POS, online ordering, inventory tracking, and customer engagement platforms that help independent restaurants operate profitably on tight margins.",
    "salons-sb": "We build booking, staff management, inventory, and client communication platforms that help salon owners stay organized and focus on craft.",
    "gyms-sb": "We build membership, class booking, payment, and engagement platforms that help independent gyms compete with franchise chains on member experience.",
    "law-firms-sb": "We build practice management, client intake, billing, and document platforms that give small firms the efficiency of larger practices.",
    "accounting-firms-sb": "We build client management, tax workflow, document collection, and billing platforms that help small accounting firms serve more clients efficiently.",
    "real-estate-agents-sb": "We build CRM, listing management, transaction tracking, and marketing platforms that help independent real estate agents compete with larger brokerages.",
    "consultants": "We build client management, project tracking, proposals, and billing platforms that help consultants operate with the polish of established firms.",
    "contractors-sb": "We build job management, estimating, crew scheduling, and client communication platforms that help small contractors stay organized and grow profitably.",
    "freelancers": "We build portfolio, project management, invoicing, and client communication platforms that help freelancers present professionally and manage their business efficiently.",
}

# ═══════════════════════════════════════════════════════════
# 3. INDUSTRY CATEGORY TAGLINES (20 categories)
# ═══════════════════════════════════════════════════════════
CATEGORY_TAGLINES = {
    "retail-and-e-commerce": "We build custom commerce software for online stores, physical retailers, and every channel in between.",
    "healthcare-and-medical": "We build HIPAA compliant platforms for hospitals, clinics, telehealth, and every corner of patient care.",
    "financial-services": "We build secure platforms for banks, insurers, fintechs, and investment firms that move money with confidence.",
    "real-estate-and-property": "We build PropTech platforms for agents, property managers, investors, and developers across every property type.",
    "education-and-e-learning": "We build learning platforms for schools, course creators, corporate trainers, and anyone teaching at scale.",
    "hospitality-and-tourism": "We build booking engines, guest experience apps, and operations platforms for hotels, restaurants, and travel businesses.",
    "manufacturing-and-industrial": "We build factory floor systems, supply chain tools, and quality platforms for manufacturers who need real time visibility.",
    "professional-services": "We build practice management, client delivery, and operations platforms for law firms, agencies, and consultancies.",
    "media-and-entertainment": "We build content platforms, distribution tools, and audience systems for creators, studios, and publishers.",
    "non-profit-and-social-enterprise": "We build donor management, program tracking, and impact reporting platforms for organizations doing meaningful work.",
    "technology-and-startups": "We build the product infrastructure, billing systems, and scalable architectures that tech companies need to grow fast.",
    "agriculture-and-farming": "We build farm management, supply chain, and precision agriculture platforms that help farming operations produce smarter.",
    "construction-and-engineering": "We build project management, field reporting, and budget tracking platforms that keep construction projects on time and budget.",
    "transportation-and-logistics": "We build fleet management, route optimization, and shipment tracking platforms for companies that move things for a living.",
    "government-and-public-sector": "We build secure citizen portals, agency workflows, and public service platforms that modernize how government serves people.",
    "sports-and-recreation": "We build member management, fan engagement, and facility platforms for sports teams, gyms, leagues, and recreation businesses.",
    "beauty-and-personal-care": "We build booking, client management, and loyalty platforms for salons, spas, clinics, and beauty brands.",
    "automotive": "We build dealer management, fleet tracking, and service platforms for dealerships, repair shops, and automotive businesses.",
    "legal-services": "We build case management, document automation, and client portal platforms for law firms of every size and specialty.",
    "small-business": "We build the software small businesses actually need: scheduling, payments, client management, and tools that just work.",
}


# ═══════════════════════════════════════════════════════════
# VALIDATION
# ═══════════════════════════════════════════════════════════
def validate(name, descriptions, max_words=20):
    errors = []
    for key, desc in descriptions.items():
        wc = len(desc.split())
        if wc > max_words:
            errors.append(f"  {name} | {key}: {wc} words (max {max_words})")
        if '-' in desc:
            errors.append(f"  {name} | {key}: contains dash")
    return errors

all_errors = []
all_errors += validate("SERVICE", SERVICE_TAGLINES)
all_errors += validate("INDUSTRY", INDUSTRY_DESCRIPTIONS)
all_errors += validate("CATEGORY", CATEGORY_TAGLINES)

if all_errors:
    print("VALIDATION ERRORS:")
    for e in all_errors:
        print(e)
    print(f"\nTotal errors: {len(all_errors)}")
    print("Fix these before applying!")
    exit(1)

print(f"Services: {len(SERVICE_TAGLINES)} taglines validated")
print(f"Industries: {len(INDUSTRY_DESCRIPTIONS)} descriptions validated")
print(f"Categories: {len(CATEGORY_TAGLINES)} taglines validated")
print("All pass: <=20 words, no dashes\n")

# ═══════════════════════════════════════════════════════════
# APPLY: Services (part1-4.ts)
# ═══════════════════════════════════════════════════════════
service_files = [
    'src/data/services/part1.ts',
    'src/data/services/part2.ts',
    'src/data/services/part3.ts',
    'src/data/services/part4.ts',
]

svc_count = 0
for sf in service_files:
    with open(sf, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    current_id = None
    for i, line in enumerate(lines):
        m = re.match(r'\s+id:\s*"(.+?)"', line)
        if m:
            current_id = m.group(1)
        m = re.match(r'^(\s+tagline:\s*")(.+?)(",?\s*)$', line)
        if m and current_id and current_id in SERVICE_TAGLINES:
            lines[i] = m.group(1) + SERVICE_TAGLINES[current_id] + m.group(3)
            svc_count += 1
            current_id = None

    with open(sf, 'w', encoding='utf-8') as f:
        f.writelines(lines)

print(f"Applied {svc_count} service tagline edits")

# ═══════════════════════════════════════════════════════════
# APPLY: Industries (industries-generated.ts)
# ═══════════════════════════════════════════════════════════
with open('src/data/industries-generated.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_slug = None
current_title = None
ind_count = 0

for i, line in enumerate(lines):
    m = re.match(r'\s+"([a-z0-9-]+)":\s*\{', line)
    if m:
        current_slug = m.group(1)
        current_title = None
    m2 = re.match(r'\s+title:\s*"(.+?)"', line)
    if m2 and current_slug:
        current_title = m2.group(1)
    m3 = re.match(r'^(        description:\s*")(.+)(",?\s*)$', line)
    if m3 and current_slug and current_title and current_slug in INDUSTRY_DESCRIPTIONS:
        lines[i] = m3.group(1) + INDUSTRY_DESCRIPTIONS[current_slug] + m3.group(3)
        ind_count += 1
        current_slug = None

with open('src/data/industries-generated.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"Applied {ind_count} industry description edits")

# ═══════════════════════════════════════════════════════════
# APPLY: Category taglines (industries.ts)
# ═══════════════════════════════════════════════════════════
with open('src/data/industries.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_id = None
cat_count = 0

for i, line in enumerate(lines):
    m = re.match(r'\s+id:\s*"(.+?)"', line)
    if m:
        current_id = m.group(1)
    m2 = re.match(r'^(\s+tagline:\s*")(.+?)(",?\s*)$', line)
    if m2 and current_id and current_id in CATEGORY_TAGLINES:
        lines[i] = m2.group(1) + CATEGORY_TAGLINES[current_id] + m2.group(3)
        cat_count += 1
        current_id = None

with open('src/data/industries.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"Applied {cat_count} category tagline edits")

# ═══════════════════════════════════════════════════════════
# APPLY: /industries page hero (Industries.tsx)
# ═══════════════════════════════════════════════════════════
INDUSTRIES_HERO_DESC = "We learn your regulations, your users, and your market. Then we build software that fits your industry exactly."

with open('src/pages-src/Industries.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_desc = 'description="We don\'t just write code — we learn your regulations, your users, your market dynamics. Then we build software that fits."'
new_desc = f'description="{INDUSTRIES_HERO_DESC}"'
if old_desc in content:
    content = content.replace(old_desc, new_desc)
    with open('src/pages-src/Industries.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Applied /industries hero description edit")
else:
    print("WARNING: Could not find /industries hero description to replace")

wc = len(INDUSTRIES_HERO_DESC.split())
if wc > 20:
    print(f"WARNING: /industries hero is {wc} words (max 20)")
if '-' in INDUSTRIES_HERO_DESC:
    print("WARNING: /industries hero contains dash")

print("\nDone! All edits applied.")
