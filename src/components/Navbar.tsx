"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchCommand } from "@/components/SearchCommand";
import logo from "@/assets/logo.png";

interface MenuItem {
  label: string;
  path?: string;
  children?: MenuItem[];
}

const menuData: MenuItem[] = [
  {
    label: "Who we are",
    children: [
      { label: "Our Company", path: "/about" },
      { label: "Our Culture", path: "/our-culture" },
      { label: "Sustainability", path: "/sustainability" },
    ],
  },
  {
    label: "Services",
    children: [
      {
        label: "Ideate",
        children: [
          { label: "Startup Branding", path: "/services/startup-branding" },
          { label: "UX & UI Design Services", path: "/services/ux-ui-design" },
          { label: "Cloud Consulting & Services", path: "/services/cloud-consulting" },
        ],
      },
      {
        label: "Build",
        children: [
          { label: "Website Development", path: "/services/website-development" },
          { label: "Frontend Development", path: "/services/frontend-development" },
          { label: "Backend Development", path: "/services/backend-development" },
          { label: "Mobile Apps Development Services", path: "/services/apps" },
        ],
      },
      {
        label: "Improve",
        children: [
          { label: "Generative AI Development Services", path: "/services/ai" },
          { label: "AI & ML Development Services", path: "/services/ai-ml" },
        ],
      },
      {
        label: "Operate",
        children: [
          { label: "DevOps Consulting Services", path: "/services/devops" },
          { label: "Software Auditing Services", path: "/services/software-auditing" },
        ],
      },
      {
        label: "Scale",
        children: [
          { label: "CTO as a Service", path: "/services/cto-as-a-service" },
          { label: "Dedicated Development Teams", path: "/services/dedicated-teams" },
          { label: "US Nearshore Software Development", path: "/services/nearshore" },
          { label: "Software Development Outsourcing", path: "/services/outsourcing" },
        ],
      },
    ],
  },
  {
    label: "Startups",
    children: [
      {
        label: "By Stage",
        children: [
          { label: "Pre-Idea Exploration", path: "/startups/pre-idea" },
          { label: "Validation Stage", path: "/startups/validation" },
          { label: "MVP Development", path: "/startups/mvp" },
          { label: "Early Traction", path: "/startups/early-traction" },
          { label: "Seed Stage", path: "/startups/seed-stage" },
          { label: "Growth Stage", path: "/startups/growth" },
          { label: "Scale-Up", path: "/startups/scale-up" },
        ],
      },
      {
        label: "By Vertical",
        children: [
          { label: "Fintech Startups", path: "/startups/fintech" },
          { label: "Healthtech Startups", path: "/startups/healthtech" },
          { label: "Edtech Startups", path: "/startups/edtech" },
          { label: "Proptech Startups", path: "/startups/proptech" },
          { label: "Legaltech Startups", path: "/startups/legaltech" },
          { label: "AI Startups", path: "/startups/ai-startup" },
          { label: "Logistics & Supply Chain", path: "/startups/logistics-tech" },
          { label: "E-commerce & Retail", path: "/startups/ecommerce" },
          { label: "B2B SaaS", path: "/startups/b2b-saas" },
          { label: "Consumer Apps", path: "/startups/consumer-apps" },
        ],
      },
      {
        label: "By Product Type",
        children: [
          { label: "Web Application", path: "/startups/web-app" },
          { label: "Mobile App", path: "/startups/mobile-app" },
          { label: "AI-Powered Product", path: "/startups/ai-product" },
          { label: "SaaS Platform", path: "/startups/saas-platform" },
          { label: "Marketplace", path: "/startups/marketplace" },
          { label: "API Product", path: "/startups/api-product" },
        ],
      },
      {
        label: "By Founder Type",
        children: [
          { label: "Non-Technical Founder", path: "/startups/non-technical-founder" },
          { label: "First-Time Founder", path: "/startups/first-time-founder" },
          { label: "Solo Founder", path: "/startups/solo-founder" },
          { label: "Repeat Founder", path: "/startups/repeat-founder" },
          { label: "Student Startup", path: "/startups/student-startup" },
          { label: "Corporate Innovator", path: "/startups/corporate-innovator" },
          { label: "Female-Led Startup", path: "/startups/female-led" },
          { label: "African Startup", path: "/startups/african-startup" },
          { label: "Diaspora Founder", path: "/startups/diaspora-founder" },
          { label: "Social Enterprise", path: "/startups/social-enterprise" },
        ],
      },
      {
        label: "By Challenge",
        children: [
          { label: "Need an MVP Fast", path: "/startups/fast-mvp" },
          { label: "Outgrowing Current Tech", path: "/startups/scaling-tech" },
          { label: "Agency Rescue", path: "/startups/agency-rescue" },
          { label: "Preparing for Funding", path: "/startups/fundraising-ready" },
          { label: "Adding AI Features", path: "/startups/ai-integration" },
          { label: "Crushing Tech Debt", path: "/startups/tech-debt" },
          { label: "Post-Pivot Rebuild", path: "/startups/post-pivot" },
          { label: "No In-House Tech Team", path: "/startups/no-tech-team" },
          { label: "Launching in Africa", path: "/startups/africa-launch" },
        ],
      },
    ],
  },
  { label: "Case studies", path: "/portfolio" },
  {
    label: "Insights",
    children: [
      { label: "Blog", path: "/blog" },
      { label: "Resources", path: "/resources" },
      { label: "Events", path: "/events" },
      { label: "Newsletter", path: "/newsletter" },
      { label: "Newsroom", path: "/newsroom" },
    ],
  },
  { label: "Careers", path: "/careers" },
];

/* ─── Active-route helper ─── */
function isItemActive(item: MenuItem, pathname: string): boolean {
  if (item.path && (pathname === item.path || pathname.startsWith(item.path + "/"))) return true;
  if (item.children) return item.children.some((child) => isItemActive(child, pathname));
  return false;
}

/* ─── Mobile accordion item (controlled) ─── */
const AccordionItem = ({
  item,
  depth = 0,
  onNavigate,
  pathname,
  isOpen,
  onToggle,
}: {
  item: MenuItem;
  depth?: number;
  onNavigate: () => void;
  pathname: string;
  isOpen?: boolean;
  onToggle?: () => void;
}) => {
  // For children within a group, manage their own exclusive state
  const [openChildIndex, setOpenChildIndex] = useState<number | null>(null);

  const hasChildren = item.children && item.children.length > 0;
  const active = isItemActive(item, pathname);
  const exactActive = item.path === pathname;

  // Use controlled state if provided, otherwise uncontrolled
  const open = isOpen ?? false;
  const toggle = onToggle ?? (() => {});

  if (!hasChildren) {
    return (
      <Link
        href={item.path || "/"}
        onClick={onNavigate}
        className={cn(
          "block py-2.5 transition-colors hover:text-primary",
          exactActive ? "text-primary font-bold" : "text-foreground",
          depth === 0 && "text-xl font-semibold",
          depth === 1 && "text-lg font-medium",
          depth >= 2 && !exactActive && "text-sm font-normal text-muted-foreground",
          depth >= 2 && exactActive && "text-sm font-bold"
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={toggle}
        className={cn(
          "flex items-center justify-between w-full py-2.5 transition-colors hover:text-primary text-left",
          active ? "text-primary" : "text-foreground",
          depth === 0 && "text-xl font-semibold",
          depth === 1 && "text-lg font-medium",
          depth >= 2 && "text-sm font-semibold"
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "text-muted-foreground transition-transform duration-200",
            depth === 0 ? "w-5 h-5" : "w-4 h-4",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={cn(
              depth === 0 ? "pl-0 pb-2" : "pl-4 border-l border-border ml-2 mt-1 mb-2 space-y-1"
            )}>
              {item.children!.map((child, childIndex) => (
                <AccordionItem
                  key={child.label}
                  item={child}
                  depth={depth + 1}
                  onNavigate={onNavigate}
                  pathname={pathname}
                  isOpen={openChildIndex === childIndex}
                  onToggle={() => setOpenChildIndex(openChildIndex === childIndex ? null : childIndex)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Mobile menu content (exclusive accordions) ─── */
const MobileMenuContent = ({ onNavigate, pathname }: { onNavigate: () => void; pathname: string }) => {
  const [openParentIndex, setOpenParentIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 md:px-6 pb-8">
      {menuData.map((item, i) => (
        <div key={item.label}>
          <AccordionItem
            item={item}
            onNavigate={onNavigate}
            pathname={pathname}
            isOpen={openParentIndex === i}
            onToggle={() => setOpenParentIndex(openParentIndex === i ? null : i)}
          />
          {i < menuData.length - 1 && (
            <div className="border-b border-border" />
          )}
        </div>
      ))}
      <div className="mt-6">
        <Link href="/contact" onClick={onNavigate}>
          <Button className="rounded-full px-8" size="lg">
            Contact us
          </Button>
        </Link>
      </div>
    </div>
  );
};

/* ─── Services mega-menu (desktop) ─── */
const ServicesMegaMenu = ({ onClose, pathname }: { onClose: () => void; pathname: string }) => {
  const servicesItem = menuData.find((m) => m.label === "Services")!;
  const columns = servicesItem.children!;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-lg z-40"
    >
      <div className="container mx-auto px-6 py-10 flex gap-8">
        {/* Left promo */}
        <div className="w-64 shrink-0 flex flex-col justify-between">
          <div>
            <div className="w-10 h-1 bg-primary mb-4 rounded-full" />
            <h3 className="text-2xl font-display font-bold leading-tight">
              AI expertise tailored{" "}
              <span className="text-primary">to business goals</span>
            </h3>
          </div>
          <Link href="/contact" onClick={onClose}>
            <Button className="rounded-full mt-6">
              Let's work together
            </Button>
          </Link>
        </div>

        {/* Columns */}
        <div className="flex-1 grid grid-cols-3 gap-x-10 gap-y-8">
          {columns.map((col) => {
            const colActive = isItemActive(col, pathname);
            return (
              <div key={col.label}>
                <p className={cn(
                  "text-sm uppercase tracking-wider mb-3 pb-2 border-b border-border",
                  colActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {col.label}
                </p>
                <ul className="space-y-2">
                  {col.children!.map((child) => {
                    const linkActive = child.path === pathname;
                    return (
                      <li key={child.label}>
                        <Link
                          href={child.path || "/"}
                          onClick={onClose}
                          className={cn(
                            "group text-sm transition-colors flex items-center gap-1",
                            linkActive
                              ? "text-primary font-semibold"
                              : "text-foreground hover:text-primary"
                          )}
                        >
                          <ChevronRight className={cn(
                            "w-3.5 h-3.5 transition-all duration-200",
                            linkActive
                              ? "opacity-100 ml-0 text-primary"
                              : "opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0"
                          )} />
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Startups mega-menu (desktop) ─── */
const StartupsMegaMenu = ({ onClose, pathname }: { onClose: () => void; pathname: string }) => {
  const startupsItem = menuData.find((m) => m.label === "Startups")!;
  const columns = startupsItem.children!;

  const firstRow = columns.slice(0, 3);
  const secondRow = columns.slice(3, 6);

  // Per-column state: which category (0=first row, 1=second row) is open
  // Default: By Founder Type (col0=1), By Vertical (col1=0), By Product Type (col2=0)
  const [openCol, setOpenCol] = useState<[0|1, 0|1, 0|1]>([
    isItemActive(firstRow[0], pathname) ? 0 : 1,
    isItemActive(secondRow[1], pathname) ? 1 : 0,
    isItemActive(secondRow[2], pathname) ? 1 : 0,
  ]);

  const toggleCol = (colIndex: number, row: 0 | 1) => {
    setOpenCol((prev) => {
      const next = [...prev] as [0|1, 0|1, 0|1];
      next[colIndex] = row;
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-lg z-40"
    >
      <div className="container mx-auto px-6 py-10 flex gap-8">
        {/* Left promo */}
        <div className="w-64 shrink-0 flex flex-col justify-between">
          <div>
            <div className="w-10 h-1 bg-primary mb-4 rounded-full" />
            <h3 className="text-2xl font-display font-bold leading-tight">
              Software for{" "}
              <span className="text-primary">startups</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Fixed price. Senior engineers. Shipped in weeks.
            </p>
          </div>
          <Link href="/contact" onClick={onClose}>
            <Button className="rounded-full mt-6">
              Start your project
            </Button>
          </Link>
        </div>

        {/* Columns */}
        <div className="flex-1 grid grid-cols-3 gap-x-10">
          {[0, 1, 2].map((colIndex) => {
            const topCat = firstRow[colIndex];
            const bottomCat = secondRow[colIndex];
            const activeRowForCol = openCol[colIndex];
            const activeCat = activeRowForCol === 0 ? topCat : bottomCat;

            return (
              <div key={colIndex}>
                {/* First row heading */}
                <button
                  onClick={() => toggleCol(colIndex, 0)}
                  className={cn(
                    "w-full flex items-center justify-between mb-3 pb-2 border-b border-border cursor-pointer",
                    activeRowForCol === 0 ? "" : "opacity-60 hover:opacity-100"
                  )}
                >
                  <p className={cn(
                    "text-sm uppercase tracking-wider",
                    isItemActive(topCat, pathname) ? "text-primary font-semibold" : activeRowForCol === 0 ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {topCat.label}
                  </p>
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform text-muted-foreground",
                    activeRowForCol === 0 ? "rotate-180" : ""
                  )} />
                </button>

                {/* First row content */}
                {activeRowForCol === 0 && (
                  <ul className="space-y-2 mb-6">
                    {topCat.children!.map((child) => {
                      const linkActive = child.path === pathname;
                      return (
                        <li key={child.label}>
                          <Link
                            href={child.path || "/"}
                            onClick={onClose}
                            className={cn(
                              "group text-sm transition-colors flex items-center gap-1",
                              linkActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"
                            )}
                          >
                            <ChevronRight className={cn(
                              "w-3.5 h-3.5 transition-all duration-200",
                              linkActive ? "opacity-100 ml-0 text-primary" : "opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0"
                            )} />
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* Second row heading */}
                <button
                  onClick={() => toggleCol(colIndex, 1)}
                  className={cn(
                    "w-full flex items-center justify-between mb-3 pb-2 border-b border-border cursor-pointer",
                    activeRowForCol === 1 ? "" : "opacity-60 hover:opacity-100"
                  )}
                >
                  <p className={cn(
                    "text-sm uppercase tracking-wider",
                    isItemActive(bottomCat, pathname) ? "text-primary font-semibold" : activeRowForCol === 1 ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {bottomCat.label}
                  </p>
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform text-muted-foreground",
                    activeRowForCol === 1 ? "rotate-180" : ""
                  )} />
                </button>

                {/* Second row content */}
                {activeRowForCol === 1 && (
                  <ul className="space-y-2">
                    {bottomCat.children!.map((child) => {
                      const linkActive = child.path === pathname;
                      return (
                        <li key={child.label}>
                          <Link
                            href={child.path || "/"}
                            onClick={onClose}
                            className={cn(
                              "group text-sm transition-colors flex items-center gap-1",
                              linkActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"
                            )}
                          >
                            <ChevronRight className={cn(
                              "w-3.5 h-3.5 transition-all duration-200",
                              linkActive ? "opacity-100 ml-0 text-primary" : "opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0"
                            )} />
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Simple horizontal dropdown (desktop) ─── */
const SimpleDropdown = ({
  items,
  onClose,
  pathname,
}: {
  items: MenuItem[];
  onClose: () => void;
  pathname: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.15 }}
    className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-sm z-40"
  >
    <div className="container mx-auto px-6 py-5">
      <div className="flex items-center justify-center gap-10 flex-wrap">
        {items.map((child) => {
          const linkActive = child.path === pathname;
          return (
            <Link
              key={child.label}
              href={child.path || "/"}
              onClick={onClose}
              className={cn(
                "group text-sm transition-colors whitespace-nowrap flex items-center gap-1",
                linkActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              )}
            >
              <ChevronRight className={cn(
                "w-3.5 h-3.5 transition-all duration-200",
                linkActive
                  ? "opacity-100 ml-0 text-primary"
                  : "opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0"
              )} />
              {child.label}
            </Link>
          );
        })}
      </div>
    </div>
  </motion.div>
);

/* ─── Navbar ─── */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rawPathname = usePathname();
  // Normalize: strip trailing slash so "/about/" matches menu data "/about"
  const pathname = rawPathname !== "/" && rawPathname.endsWith("/")
    ? rawPathname.slice(0, -1)
    : rawPathname;
  const isHome = pathname === "/";
  const showBg = scrolled || activeDropdown !== null || mobileOpen;
  // On non-home pages, use white text over the dark hero when not scrolled
  const useLight = !showBg && !isHome;

  const handleEnterItem = (label: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveDropdown(label);
  };

  const handleLeaveItem = () => {
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const handleEnterDropdown = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  const handleLeaveDropdown = () => {
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const closeDropdown = () => setActiveDropdown(null);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          showBg
            ? "bg-background/95 backdrop-blur-sm shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 z-50 shrink-0">
              <img src={logo} alt="CiroStack logo" className="w-8 h-8 object-contain" />
              <span
                className={cn(
                  "font-display font-bold text-2xl md:text-3xl transition-colors duration-300",
                  useLight ? "text-white" : "text-foreground"
                )}
              >
                Ciro<span className="text-primary">Stack</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {menuData.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const active = isItemActive(item, pathname);
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => hasChildren && handleEnterItem(item.label)}
                    onMouseLeave={handleLeaveItem}
                  >
                    {item.path && !hasChildren ? (
                      <Link
                        href={item.path}
                        className={cn(
                          "px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1",
                          active
                            ? "text-primary font-bold"
                            : useLight
                              ? "text-white/90 hover:text-white"
                              : "text-foreground hover:text-primary"
                        )}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        className={cn(
                          "px-3 py-2 text-sm transition-colors duration-200 flex items-center gap-1",
                          active
                            ? "text-primary font-bold"
                            : useLight
                              ? "text-white/90 hover:text-white"
                              : "text-foreground hover:text-primary",
                          !active && activeDropdown === item.label
                            ? "font-bold"
                            : !active ? "font-medium" : ""
                        )}
                      >
                        {item.label}
                        {hasChildren && (
                          <ChevronDown
                            className={cn(
                              "w-3.5 h-3.5 transition-transform duration-200",
                              activeDropdown === item.label && "rotate-180"
                            )}
                          />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 z-50">
              <button
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-300",
                  useLight
                    ? "border-white/30 text-white hover:bg-white/10"
                    : "border-border text-foreground hover:bg-muted"
                )}
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <ThemeToggle useLight={useLight} />
              <Link href="/contact" className="hidden lg:block">
                <Button className="rounded-full px-6" size="sm">
                  Contact us
                </Button>
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  "lg:hidden w-10 h-10 flex items-center justify-center transition-colors duration-300",
                  useLight ? "text-white" : "text-foreground"
                )}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop dropdowns */}
        <AnimatePresence>
          {activeDropdown && (
            <div
              onMouseEnter={handleEnterDropdown}
              onMouseLeave={handleLeaveDropdown}
            >
              {activeDropdown === "Services" ? (
                <ServicesMegaMenu onClose={closeDropdown} pathname={pathname} />
              ) : activeDropdown === "Startups" ? (
                <StartupsMegaMenu onClose={closeDropdown} pathname={pathname} />
              ) : (
                (() => {
                  const item = menuData.find((m) => m.label === activeDropdown);
                  if (!item?.children) return null;
                  return (
                    <SimpleDropdown
                      items={item.children}
                      onClose={closeDropdown}
                      pathname={pathname}
                    />
                  );
                })()
              )}
            </div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background pt-20 overflow-y-auto lg:hidden"
          >
            <MobileMenuContent onNavigate={() => setMobileOpen(false)} pathname={pathname} />
          </motion.div>
        )}
      </AnimatePresence>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Navbar;
