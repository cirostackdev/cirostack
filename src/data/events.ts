import { Video, Mic, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type EventItem = {
  id: string;
  type: string;
  icon: LucideIcon;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  featured: boolean;
  registrationUrl: string;
};

export const events: EventItem[] = [
  {
    id: "ai-automation-webinar",
    type: "Webinar",
    icon: Video,
    title: "AI Automation for Business Leaders",
    description: "A hands-on session covering practical AI implementation strategies for non-technical executives. Learn what's possible, what's hype, and how to get started.",
    date: "March 18, 2026",
    time: "2:00 PM EST",
    location: "Online (Zoom)",
    attendees: 320,
    featured: true,
    registrationUrl: "/events/register?event=ai-automation-webinar",
  },
  {
    id: "techsummit-2026",
    type: "Conference Talk",
    icon: Mic,
    title: "CiroStack at TechSummit 2026",
    description: "Our CTO will be presenting on the future of AI-assisted software development and what it means for engineering teams.",
    date: "April 5, 2026",
    time: "10:30 AM PST",
    location: "San Francisco, CA",
    attendees: 1200,
    featured: true,
    registrationUrl: "/events/register?event=techsummit-2026",
  },
  {
    id: "mvp-workshop-london",
    type: "Workshop",
    icon: Users,
    title: "Building Your MVP: From Idea to Launch",
    description: "An interactive half-day workshop walking founders through the CiroStack MVP methodology. Bring your idea and leave with a clear action plan.",
    date: "April 22, 2026",
    time: "9:00 AM GMT",
    location: "London, UK",
    attendees: 40,
    featured: false,
    registrationUrl: "/events/register?event=mvp-workshop-london",
  },
  {
    id: "cloud-migration-webinar",
    type: "Webinar",
    icon: Video,
    title: "Cloud Migration Best Practices in 2026",
    description: "A deep-dive session with our cloud engineering team covering the latest patterns, tools, and pitfalls to avoid when migrating to the cloud.",
    date: "May 7, 2026",
    time: "1:00 PM EST",
    location: "Online (Zoom)",
    attendees: 180,
    featured: false,
    registrationUrl: "/events/register?event=cloud-migration-webinar",
  },
];
