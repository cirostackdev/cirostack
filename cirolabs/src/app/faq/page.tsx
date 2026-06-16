"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/ScrollReveal";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQGroup {
  category: string;
  items: FAQItem[];
}

const faqData: FAQGroup[] = [
  {
    category: "General",
    items: [
      {
        question: "What is CiroLabs?",
        answer:
          "CiroLabs is a hands-on learning platform built by CiroStack. We teach real-world development skills with AI as a collaborator, not a crutch. Think Udemy meets Duolingo, built by engineers who ship production software daily.",
      },
      {
        question: "Who is it for?",
        answer:
          "Developers at any level who want to build real software with modern AI workflows. Bootcamp grads, self-taught devs, and professionals looking to integrate AI into their workflow.",
      },
      {
        question: "How is the mobile app different from the web version?",
        answer:
          "Same courses, same AI tutor, same content. The app adds offline lesson downloads, push notification streaks, and a mobile-native code editor. Learn on the go.",
      },
    ],
  },
  {
    category: "App & Access",
    items: [
      {
        question: "When does the app launch?",
        answer:
          "We're in active development. Waitlist members will be the first to get access. Join the waitlist for launch updates.",
      },
      {
        question: "What platforms will it support?",
        answer: "iOS and Android. Both launching simultaneously.",
      },
      {
        question: "Will it work offline?",
        answer:
          "Yes. Video lessons and written content can be downloaded for offline access. Code exercises require an internet connection for the sandbox environment.",
      },
    ],
  },
  {
    category: "Learning",
    items: [
      {
        question: "What is AI vs Manual split view?",
        answer:
          "Every coding lesson shows two approaches: the AI-assisted way and the manual way, side by side. You understand what AI does well and what you still need to master yourself.",
      },
      {
        question: "What is Steal the Prompt?",
        answer:
          "Every lesson includes the exact prompts the instructor used. Copy them to your personal library, adapt them for your own projects, and learn prompting by example.",
      },
      {
        question: "What is the Ship It capstone?",
        answer:
          "Each learning track ends with a real project you build and deploy. An instructor reviews it, gives feedback, and top submissions get flagged for the CiroStack talent pipeline.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        question: "How much does it cost?",
        answer:
          "Free to download and preview. Individual courses from $15. All-access subscription at $9/month. Prices lock for early access members.",
      },
      {
        question: "What's the refund policy?",
        answer:
          "Full refund within 7 days of purchase if you've completed less than 30% of the course. Subscriptions can be cancelled anytime with no further charges.",
      },
    ],
  },
  {
    category: "Career",
    items: [
      {
        question: "What is the talent pipeline?",
        answer:
          "CiroStack (the agency that built CiroLabs) hires from its top graduates. Complete a track, ship a capstone project, get reviewed — and you may be invited to work on real client projects.",
      },
      {
        question: "Do I need to complete all courses?",
        answer:
          "No. Complete any single track and ship the capstone. Quality of your Ship It project matters more than number of courses completed.",
      },
    ],
  },
];

function Accordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-foreground pr-4">{item.question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="text-sm text-muted-foreground pb-4 leading-relaxed">
          {item.answer}
        </p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Frequently asked questions
            </h1>
            <p className="text-muted-foreground">
              Everything you need to know about CiroLabs.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-10">
          {faqData.map((group) => (
            <ScrollReveal key={group.category}>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  {group.category}
                </h2>
                <div className="border border-border rounded-xl overflow-hidden bg-card px-4">
                  {group.items.map((item) => (
                    <Accordion key={item.question} item={item} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
