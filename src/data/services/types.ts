import { type LucideIcon } from "lucide-react";

export type ValueProp = {
    title: string;
    description: string;
};

export type ProcessStep = {
    title: string;
    description: string;
};

export type FAQ = {
    question: string;
    answer: string;
};

export type ServiceEntry = {
    id: string; // The URL slug
    icon: LucideIcon;
    title: string;
    tagline: string;
    introSummary: string; // for "intro section"
    description: string; // "Our {service} service section"
    details: string[]; // deep dive capabilities
    technologies: string[];
    deliverables: string[];
    startingAt: string;
    bookingType: string; // e.g. "demo", "consultation", "audit"
    valueProps: ValueProp[]; // "{service} value section"
    whoWeHelped: string[]; // "who we've helped {for a given service} section"
    processSteps: ProcessStep[]; // "our {services.service} process section"
    industryExpertise: string[]; // "our industry expertise section"
    reasonsToChoose: ValueProp[]; // "reasons companies chose use as their partner section"
    faqs: FAQ[]; // "{services.service} FAQ section"
    // Note: Case study section, client reviews section, tech section, insights section,
    // CTA section, and related services section will be handled dynamically in the components
    // utilizing this structured data.
};
