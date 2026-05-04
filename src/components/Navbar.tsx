"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
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
  { label: "What we do", path: "/services" },
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
          { label: "Custom Software Development", path: "/services/websites" },
          { label: "Software Development for Startups", path: "/services/startups" },
          { label: "Mobile Apps Development Services", path: "/services/apps" },
          { label: "Cloud Engineering Service", path: "/services/cloud-engineering" },
          { label: "Embedded Software Services", path: "/services/embedded-software" },
        ],
      },
      {
        label: "Improve",
        children: [
          { label: "Generative AI Development Services", path: "/services/ai" },
          { label: "AI & ML Development Services", path: "/services/ai-ml" },
          { label: "Data Engineering and Data Science", path: "/services/data-engineering" },
          { label: "Digital Transformation Solutions", path: "/services/digital-transformation" },
        ],
      },
      {
        label: "Operate",
        children: [
          { label: "DevOps Consulting Services", path: "/services/devops" },
          { label: "Automation Testing Services", path: "/services/automation-testing" },
          { label: "Software Auditing Services", path: "/services/software-auditing" },
          { label: "Identity and Access Management", path: "/services/iam" },
          { label: "Security Audit and Governance", path: "/services/security-audit" },
        ],
      },
      {
        label: "Scale",
        children: [
          { label: "US Nearshore Software Development", path: "/services/nearshore" },
          { label: "Software Development Outsourcing", path: "/services/outsourcing" },
          { label: "Dedicated Development Teams", path: "/services/dedicated-teams" },
        ],
      },
    ],
  },
  {
    label: "Industries",
    children: [
      {
        label: "Technology & Startups",
        children: [
          { label: "Tech Startups", path: "/industries/tech-startups" },
          { label: "SaaS Companies", path: "/industries/saas-companies" },
          { label: "AI Companies", path: "/industries/ai-companies" },
          { label: "Mobile App Developers", path: "/industries/mobile-app-developers" },
          { label: "Cloud Services", path: "/industries/cloud-services" },
          { label: "Cybersecurity", path: "/industries/cybersecurity" },
          { label: "IoT Companies", path: "/industries/iot-companies" },
          { label: "DevOps Tools", path: "/industries/devops-tools" },
          { label: "Developer Tools", path: "/industries/developer-tools" },
          { label: "Blockchain/Crypto", path: "/industries/blockchain-crypto" },
        ],
      },
      {
        label: "Financial Services",
        children: [
          { label: "Fintech Startups", path: "/industries/fintech-startups" },
          { label: "Banks & Credit Unions", path: "/industries/banks-and-credit-unions" },
          { label: "Investment Firms", path: "/industries/investment-firms" },
          { label: "Insurance", path: "/industries/insurance" },
          { label: "Cryptocurrency", path: "/industries/cryptocurrency" },
          { label: "Accounting Firms", path: "/industries/accounting-firms" },
          { label: "Personal Finance", path: "/industries/personal-finance" },
          { label: "Microfinance", path: "/industries/microfinance" },
          { label: "Real Estate Investment", path: "/industries/real-estate-investment" },
          { label: "Credit Unions", path: "/industries/credit-unions" },
        ],
      },
      {
        label: "Healthcare & Medical",
        children: [
          { label: "Telemedicine", path: "/industries/telemedicine" },
          { label: "Hospitals & Clinics", path: "/industries/hospitals-and-clinics" },
          { label: "Mental Health", path: "/industries/mental-health" },
          { label: "Medical Equipment", path: "/industries/medical-equipment" },
          { label: "Pharmacies", path: "/industries/pharmacies-medical" },
          { label: "Laboratories", path: "/industries/laboratories" },
          { label: "Fitness & Wellness", path: "/industries/fitness-and-wellness" },
          { label: "Dental Practices", path: "/industries/dental-practices" },
          { label: "Physical Therapy", path: "/industries/physical-therapy" },
          { label: "Senior Care", path: "/industries/senior-care" },
        ],
      },
      {
        label: "Retail & E-Commerce",
        children: [
          { label: "Online Retail Stores", path: "/industries/online-retail-stores" },
          { label: "Grocery & Food Delivery", path: "/industries/grocery-and-food-delivery" },
          { label: "Fashion & Apparel", path: "/industries/fashion-and-apparel" },
          { label: "Electronics & Gadgets", path: "/industries/electronics-and-gadgets" },
          { label: "Furniture & Home Decor", path: "/industries/furniture-and-home-decor" },
          { label: "Brick & Mortar Retail", path: "/industries/brick-and-mortar-retail" },
          { label: "Pharmacies", path: "/industries/pharmacies" },
          { label: "Beauty & Cosmetics", path: "/industries/beauty-and-cosmetics" },
          { label: "Automotive Parts", path: "/industries/automotive-parts" },
          { label: "Bookstores", path: "/industries/bookstores" },
        ],
      },
      {
        label: "Education & E-Learning",
        children: [
          { label: "Online Courses", path: "/industries/online-courses" },
          { label: "Corporate Training", path: "/industries/corporate-training" },
          { label: "Schools & Universities", path: "/industries/schools-and-universities" },
          { label: "Coding Bootcamps", path: "/industries/coding-bootcamps" },
          { label: "Language Learning", path: "/industries/language-learning" },
          { label: "Tutoring Services", path: "/industries/tutoring-services" },
          { label: "Test Preparation", path: "/industries/test-preparation" },
          { label: "Vocational Training", path: "/industries/vocational-training" },
          { label: "Educational Publishers", path: "/industries/educational-publishers" },
          { label: "Childcare", path: "/industries/childcare" },
        ],
      },
      {
        label: "Professional Services",
        children: [
          { label: "IT Services", path: "/industries/it-services" },
          { label: "Marketing Agencies", path: "/industries/marketing-agencies" },
          { label: "Consulting Agencies", path: "/industries/consulting-agencies" },
          { label: "Recruiting Agencies", path: "/industries/recruiting-agencies" },
          { label: "HR Consulting", path: "/industries/hr-consulting" },
          { label: "Engineering Firms", path: "/industries/engineering-firms" },
          { label: "Law Firms", path: "/industries/law-firms" },
          { label: "Accounting Firms", path: "/industries/accounting-firms-pro" },
          { label: "Architecture Firms", path: "/industries/architecture-firms" },
          { label: "Business Coaching", path: "/industries/business-coaching" },
        ],
      },
      {
        label: "Transportation & Logistics",
        children: [
          { label: "Delivery Services", path: "/industries/delivery-services" },
          { label: "Ride-Sharing", path: "/industries/ride-sharing" },
          { label: "Freight Forwarding", path: "/industries/freight-forwarding" },
          { label: "Trucking Companies", path: "/industries/trucking-companies" },
          { label: "Warehousing", path: "/industries/warehousing-tl" },
          { label: "Courier Services", path: "/industries/courier-services" },
          { label: "Shipping Lines", path: "/industries/shipping-lines" },
          { label: "Public Transportation", path: "/industries/public-transportation" },
          { label: "Aviation", path: "/industries/aviation" },
          { label: "Railway Companies", path: "/industries/railway-companies" },
        ],
      },
      {
        label: "Real Estate & Property",
        children: [
          { label: "Property Management", path: "/industries/property-management" },
          { label: "Real Estate Agencies", path: "/industries/real-estate-agencies" },
          { label: "Vacation Rentals", path: "/industries/vacation-rentals" },
          { label: "Real Estate Investment", path: "/industries/real-estate-investment-prop" },
          { label: "Commercial Real Estate", path: "/industries/commercial-real-estate" },
          { label: "Co-working Spaces", path: "/industries/co-working-spaces" },
          { label: "Mortgage Brokers", path: "/industries/mortgage-brokers" },
          { label: "Property Development", path: "/industries/property-development" },
          { label: "Real Estate Agents", path: "/industries/real-estate-agents" },
          { label: "Facility Management", path: "/industries/facility-management" },
        ],
      },
      {
        label: "Manufacturing & Industrial",
        children: [
          { label: "Factory Automation", path: "/industries/factory-automation" },
          { label: "Supply Chain & Logistics", path: "/industries/supply-chain-and-logistics" },
          { label: "Chemical & Pharmaceutical", path: "/industries/chemical-and-pharmaceutical" },
          { label: "Manufacturing Plants", path: "/industries/manufacturing-plants" },
          { label: "Procurement", path: "/industries/procurement" },
          { label: "Quality Control", path: "/industries/quality-control" },
          { label: "Equipment Maintenance", path: "/industries/equipment-maintenance" },
          { label: "Warehousing", path: "/industries/warehousing" },
          { label: "Distribution", path: "/industries/distribution" },
          { label: "Automotive Manufacturing", path: "/industries/automotive-manufacturing" },
        ],
      },
      {
        label: "Media & Entertainment",
        children: [
          { label: "Gaming", path: "/industries/gaming" },
          { label: "News & Media", path: "/industries/news-and-media" },
          { label: "Music Industry", path: "/industries/music-industry" },
          { label: "Film & Video Production", path: "/industries/film-and-video-production" },
          { label: "Publishing", path: "/industries/publishing" },
          { label: "Podcasting", path: "/industries/podcasting" },
          { label: "Event Production", path: "/industries/event-production" },
          { label: "Photography", path: "/industries/photography" },
          { label: "Social Media Influencers", path: "/industries/social-media-influencers" },
          { label: "Art Galleries", path: "/industries/art-galleries" },
        ],
      },
      {
        label: "Government & Public Sector",
        children: [
          { label: "Federal Agencies", path: "/industries/federal-agencies" },
          { label: "Health Departments", path: "/industries/health-departments" },
          { label: "Tax Authorities", path: "/industries/tax-authorities" },
          { label: "Public Safety", path: "/industries/public-safety" },
          { label: "Local Government", path: "/industries/local-government" },
          { label: "Transportation Departments", path: "/industries/transportation-departments" },
          { label: "Education Departments", path: "/industries/education-departments" },
          { label: "Utilities", path: "/industries/utilities" },
          { label: "Libraries", path: "/industries/libraries" },
          { label: "Parks & Recreation", path: "/industries/parks-and-recreation" },
        ],
      },
      {
        label: "Hospitality & Tourism",
        children: [
          { label: "Hotels & Resorts", path: "/industries/hotels-and-resorts" },
          { label: "Restaurants & Cafes", path: "/industries/restaurants-and-cafes" },
          { label: "Airlines", path: "/industries/airlines" },
          { label: "Travel Agencies", path: "/industries/travel-agencies" },
          { label: "Car Rentals", path: "/industries/car-rentals" },
          { label: "Cruise Lines", path: "/industries/cruise-lines" },
          { label: "Tour Operators", path: "/industries/tour-operators" },
          { label: "Event Venues", path: "/industries/event-venues" },
          { label: "Bed & Breakfasts", path: "/industries/bed-and-breakfasts" },
          { label: "Travel Bloggers", path: "/industries/travel-bloggers" },
        ],
      },
      {
        label: "Construction & Engineering",
        children: [
          { label: "Construction Companies", path: "/industries/construction-companies" },
          { label: "Real Estate Development", path: "/industries/real-estate-development" },
          { label: "Civil Engineering", path: "/industries/civil-engineering" },
          { label: "Architecture Firms", path: "/industries/architecture-firms-ce" },
          { label: "Facility Management", path: "/industries/facility-management-ce" },
          { label: "Building Materials", path: "/industries/building-materials" },
          { label: "Contractors", path: "/industries/contractors" },
          { label: "Subcontractors", path: "/industries/subcontractors" },
          { label: "Renovation Services", path: "/industries/renovation-services" },
          { label: "Landscape Architecture", path: "/industries/landscape-architecture" },
        ],
      },
      {
        label: "Legal Services",
        children: [
          { label: "Corporate Law", path: "/industries/corporate-law" },
          { label: "Intellectual Property", path: "/industries/intellectual-property" },
          { label: "Law Firms", path: "/industries/law-firms-legal" },
          { label: "Immigration Law", path: "/industries/immigration-law" },
          { label: "Real Estate Law", path: "/industries/real-estate-law" },
          { label: "Solo Practitioners", path: "/industries/solo-practitioners" },
          { label: "Family Law", path: "/industries/family-law" },
          { label: "Estate Planning", path: "/industries/estate-planning" },
          { label: "Criminal Defense", path: "/industries/criminal-defense" },
          { label: "Legal Aid", path: "/industries/legal-aid" },
        ],
      },
      {
        label: "Small Business",
        children: [
          { label: "Consultants", path: "/industries/consultants" },
          { label: "Local Retail", path: "/industries/local-retail" },
          { label: "Restaurants", path: "/industries/restaurants-sb" },
          { label: "Real Estate Agents", path: "/industries/real-estate-agents-sb" },
          { label: "Accounting Firms", path: "/industries/accounting-firms-sb" },
          { label: "Law Firms", path: "/industries/law-firms-sb" },
          { label: "Gyms", path: "/industries/gyms-sb" },
          { label: "Contractors", path: "/industries/contractors-sb" },
          { label: "Freelancers", path: "/industries/freelancers" },
          { label: "Salons", path: "/industries/salons-sb" },
        ],
      },
      {
        label: "Non-Profit & Social Enterprise",
        children: [
          { label: "NGOs", path: "/industries/ngos" },
          { label: "Charities", path: "/industries/charities" },
          { label: "Social Enterprises", path: "/industries/social-enterprises" },
          { label: "Foundations", path: "/industries/foundations" },
          { label: "Educational Non-Profits", path: "/industries/educational-non-profits" },
          { label: "Health Advocacy", path: "/industries/health-advocacy" },
          { label: "Environmental Groups", path: "/industries/environmental-groups" },
          { label: "Community Groups", path: "/industries/community-groups" },
          { label: "Religious Organizations", path: "/industries/religious-organizations" },
          { label: "Animal Welfare", path: "/industries/animal-welfare" },
        ],
      },
      {
        label: "Sports & Recreation",
        children: [
          { label: "Sports Teams", path: "/industries/sports-teams" },
          { label: "Sports Leagues", path: "/industries/sports-leagues" },
          { label: "Fitness Centers", path: "/industries/fitness-centers" },
          { label: "Gyms", path: "/industries/gyms" },
          { label: "Sports Events", path: "/industries/sports-events" },
          { label: "Golf Courses", path: "/industries/golf-courses" },
          { label: "Outdoor Recreation", path: "/industries/outdoor-recreation" },
          { label: "Yoga Studios", path: "/industries/yoga-studios" },
          { label: "Martial Arts Schools", path: "/industries/martial-arts-schools" },
          { label: "Dance Studios", path: "/industries/dance-studios" },
        ],
      },
      {
        label: "Automotive",
        children: [
          { label: "Car Dealerships", path: "/industries/car-dealerships" },
          { label: "Fleet Management", path: "/industries/fleet-management" },
          { label: "Rental Cars", path: "/industries/rental-cars" },
          { label: "Auto Parts Stores", path: "/industries/auto-parts-stores" },
          { label: "Auto Repair Shops", path: "/industries/auto-repair-shops" },
          { label: "Motorcycle Shops", path: "/industries/motorcycle-shops" },
          { label: "Tire Shops", path: "/industries/tire-shops" },
          { label: "Body Shops", path: "/industries/body-shops" },
          { label: "Car Washes", path: "/industries/car-washes" },
          { label: "Automotive Detailing", path: "/industries/automotive-detailing" },
        ],
      },
      {
        label: "Agriculture & Farming",
        children: [
          { label: "Agribusiness", path: "/industries/agribusiness" },
          { label: "Precision Agriculture", path: "/industries/precision-agriculture" },
          { label: "Produce Distribution", path: "/industries/produce-distribution" },
          { label: "Agricultural Co-ops", path: "/industries/agricultural-co-ops" },
          { label: "Farm Equipment", path: "/industries/farm-equipment" },
          { label: "Livestock Management", path: "/industries/livestock-management" },
          { label: "Farms", path: "/industries/farms" },
          { label: "Fisheries", path: "/industries/fisheries" },
          { label: "Organic Farming", path: "/industries/organic-farming" },
          { label: "Forestry", path: "/industries/forestry" },
        ],
      },
      {
        label: "Beauty & Personal Care",
        children: [
          { label: "Beauty Clinics", path: "/industries/beauty-clinics" },
          { label: "Cosmetics Brands", path: "/industries/cosmetics-brands" },
          { label: "Salons", path: "/industries/salons" },
          { label: "Spas", path: "/industries/spas" },
          { label: "Skincare", path: "/industries/skincare" },
          { label: "Hair Products", path: "/industries/hair-products" },
          { label: "Barber Shops", path: "/industries/barber-shops" },
          { label: "Nail Salons", path: "/industries/nail-salons" },
          { label: "Estheticians", path: "/industries/estheticians" },
          { label: "Tattoo Shops", path: "/industries/tattoo-shops" },
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

/* ─── Mobile accordion item ─── */
const AccordionItem = ({
  item,
  depth = 0,
  onNavigate,
  pathname,
}: {
  item: MenuItem;
  depth?: number;
  onNavigate: () => void;
  pathname: string;
}) => {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const active = isItemActive(item, pathname);
  const exactActive = item.path === pathname;

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
        onClick={() => setOpen(!open)}
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
              {item.children!.map((child) => (
                <AccordionItem
                  key={child.label}
                  item={child}
                  depth={depth + 1}
                  onNavigate={onNavigate}
                  pathname={pathname}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
            <Button className="rounded-full mt-6" variant="outline">
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

/* ─── Industries mega-menu (desktop) ─── */
const IndustriesMegaMenu = ({ onClose, pathname }: { onClose: () => void; pathname: string }) => {
  const industriesItem = menuData.find((m) => m.label === "Industries")!;
  const categories = industriesItem.children!;

  // Auto-select the category that contains the current page
  const initialIndex = Math.max(0, categories.findIndex((cat) => isItemActive(cat, pathname)));
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(initialIndex);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Scroll the active category into view when the mega menu opens
  useEffect(() => {
    activeBtnRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  const activeCategory = categories[activeCategoryIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-lg z-40"
    >
      <div className="container mx-auto px-6 py-8 flex gap-8">
        {/* Categories Sidebar (Scrollable) */}
        <div className="w-80 shrink-0 border-r border-border pr-2 flex flex-col max-h-[60vh]">
          <h3 className="text-xl font-display font-bold mb-4 px-3 shrink-0">Industries</h3>
          <ul className="space-y-1 overflow-y-auto pr-2 flex-1 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
            {categories.map((category, index) => {
              const catActive = isItemActive(category, pathname);
              return (
                <li key={category.label}>
                  <button
                    ref={index === initialIndex ? activeBtnRef : undefined}
                    onClick={() => setActiveCategoryIndex(index)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between",
                      activeCategoryIndex === index
                        ? "bg-primary/10 text-primary font-medium"
                        : catActive
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {category.label}
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        activeCategoryIndex === index ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sub-industries Grid */}
        <div className="flex-1 py-4 overflow-y-auto max-h-[60vh] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
          <div className="mb-6">
            <h4 className="text-lg font-display font-semibold text-foreground">
              {activeCategory.label}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Select a specialization to see how we can help.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {activeCategory.children!.map((sub) => {
              const subActive = sub.path === pathname;
              return (
                <Link
                  key={sub.label}
                  href={sub.path || "/"}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-2 text-sm transition-colors",
                    subActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"
                  )}
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    subActive ? "bg-primary" : "bg-border group-hover:bg-primary"
                  )} />
                  {sub.label}
                </Link>
              );
            })}
          </div>
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
              ) : activeDropdown === "Industries" ? (
                <IndustriesMegaMenu onClose={closeDropdown} pathname={pathname} />
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
            <div className="container mx-auto px-4 md:px-6 pb-8">
              {menuData.map((item, i) => (
                <div key={item.label}>
                  <AccordionItem
                    item={item}
                    onNavigate={() => setMobileOpen(false)}
                    pathname={pathname}
                  />
                  {i < menuData.length - 1 && (
                    <div className="border-b border-border" />
                  )}
                </div>
              ))}
              <div className="mt-6">
                <Link href="/contact" onClick={() => setMobileOpen(false)}>
                  <Button className="rounded-full px-8" size="lg">
                    Contact us
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
