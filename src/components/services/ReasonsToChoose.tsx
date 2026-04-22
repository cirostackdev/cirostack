"use client";

import { type ServiceEntry } from "@/data/services/types";
import { motion } from "framer-motion";

// ── Per-service, per-reason images ──────────────────────────────────────
import websitesR0 from "@/assets/reason-websites-0.jpg";
import websitesR1 from "@/assets/reason-websites-1.jpg";
import websitesR2 from "@/assets/reason-websites-2.jpg";
import appsR0 from "@/assets/reason-apps-0.jpg";
import appsR1 from "@/assets/reason-apps-1.jpg";
import appsR2 from "@/assets/reason-apps-2.jpg";
import aiR0 from "@/assets/reason-ai-0.jpg";
import aiR1 from "@/assets/reason-ai-1.jpg";
import aiR2 from "@/assets/reason-ai-2.jpg";
import uxR0 from "@/assets/reason-ux-ui-design-0.jpg";
import uxR1 from "@/assets/reason-ux-ui-design-1.jpg";
import uxR2 from "@/assets/reason-ux-ui-design-2.jpg";
import ccR0 from "@/assets/reason-cloud-consulting-0.jpg";
import ccR1 from "@/assets/reason-cloud-consulting-1.jpg";
import ccR2 from "@/assets/reason-cloud-consulting-2.jpg";
import ceR0 from "@/assets/reason-cloud-engineering-0.jpg";
import ceR1 from "@/assets/reason-cloud-engineering-1.jpg";
import ceR2 from "@/assets/reason-cloud-engineering-2.jpg";
import esR0 from "@/assets/reason-embedded-software-0.jpg";
import esR1 from "@/assets/reason-embedded-software-1.jpg";
import esR2 from "@/assets/reason-embedded-software-2.jpg";
import dtR0 from "@/assets/reason-dedicated-teams-0.jpg";
import dtR1 from "@/assets/reason-dedicated-teams-1.jpg";
import dtR2 from "@/assets/reason-dedicated-teams-2.jpg";
import dxR0 from "@/assets/reason-digital-transformation-0.jpg";
import dxR1 from "@/assets/reason-digital-transformation-1.jpg";
import dxR2 from "@/assets/reason-digital-transformation-2.jpg";
import mlR0 from "@/assets/reason-ai-ml-0.jpg";
import mlR1 from "@/assets/reason-ai-ml-1.jpg";
import mlR2 from "@/assets/reason-ai-ml-2.jpg";
import deR0 from "@/assets/reason-data-engineering-0.jpg";
import deR1 from "@/assets/reason-data-engineering-1.jpg";
import deR2 from "@/assets/reason-data-engineering-2.jpg";
import iamR0 from "@/assets/reason-iam-0.jpg";
import iamR1 from "@/assets/reason-iam-1.jpg";
import iamR2 from "@/assets/reason-iam-2.jpg";
import atR0 from "@/assets/reason-automation-testing-0.jpg";
import atR1 from "@/assets/reason-automation-testing-1.jpg";
import atR2 from "@/assets/reason-automation-testing-2.jpg";
import doR0 from "@/assets/reason-devops-0.jpg";
import doR1 from "@/assets/reason-devops-1.jpg";
import doR2 from "@/assets/reason-devops-2.jpg";
import saR0 from "@/assets/reason-software-auditing-0.jpg";
import saR1 from "@/assets/reason-software-auditing-1.jpg";
import saR2 from "@/assets/reason-software-auditing-2.jpg";
import secR0 from "@/assets/reason-security-audit-0.jpg";
import secR1 from "@/assets/reason-security-audit-1.jpg";
import secR2 from "@/assets/reason-security-audit-2.jpg";
import nsR0 from "@/assets/reason-nearshore-0.jpg";
import nsR1 from "@/assets/reason-nearshore-1.jpg";
import nsR2 from "@/assets/reason-nearshore-2.jpg";
import osR0 from "@/assets/reason-outsourcing-0.jpg";
import osR1 from "@/assets/reason-outsourcing-1.jpg";
import osR2 from "@/assets/reason-outsourcing-2.jpg";
import stR0 from "@/assets/reason-startups-0.jpg";
import stR1 from "@/assets/reason-startups-1.jpg";
import stR2 from "@/assets/reason-startups-2.jpg";

const reasonImages: Record<string, string[]> = {
    "websites":               [websitesR0, websitesR1, websitesR2],
    "apps":                   [appsR0, appsR1, appsR2],
    "ai":                     [aiR0, aiR1, aiR2],
    "ux-ui-design":           [uxR0, uxR1, uxR2],
    "cloud-consulting":       [ccR0, ccR1, ccR2],
    "cloud-engineering":      [ceR0, ceR1, ceR2],
    "embedded-software":      [esR0, esR1, esR2],
    "dedicated-teams":        [dtR0, dtR1, dtR2],
    "digital-transformation": [dxR0, dxR1, dxR2],
    "ai-ml":                  [mlR0, mlR1, mlR2],
    "data-engineering":       [deR0, deR1, deR2],
    "iam":                    [iamR0, iamR1, iamR2],
    "automation-testing":     [atR0, atR1, atR2],
    "devops":                 [doR0, doR1, doR2],
    "software-auditing":      [saR0, saR1, saR2],
    "security-audit":         [secR0, secR1, secR2],
    "nearshore":              [nsR0, nsR1, nsR2],
    "outsourcing":            [osR0, osR1, osR2],
    "startups":               [stR0, stR1, stR2],
};

export function ReasonsToChoose({ service }: { service: ServiceEntry }) {
    const images = reasonImages[service.id] || [];

    return (
        <section className="py-24 bg-secondary/30 border-y border-border/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-20">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
                        Why partner with CiroStack?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        We are not just another vendor. We act as your elite engineering SEAL team—taking extreme ownership of your most complex technical challenges.
                    </p>
                </div>

                <div className="grid gap-16">
                    {service.reasonsToChoose.map((reason, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`flex flex-col md:flex-row gap-8 lg:gap-16 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Image */}
                            <div className="w-full md:w-1/2 aspect-video rounded-3xl overflow-hidden border border-border/50">
                                <img
                                    src={images[idx] || images[0]}
                                    alt={reason.title}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            <div className="w-full md:w-1/2">
                                <div className="text-muted-foreground font-bold text-xl mb-4 font-display">0{idx + 1}</div>
                                <h3 className="text-3xl font-bold mb-4">{reason.title}</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">{reason.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
