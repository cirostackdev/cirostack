/**
 * Industry-specific stats generator.
 * Produces unique, relevant metrics for each industry page
 * based on its slug and parent category.
 */

import type { IndustryStat } from "@/data/industries-generated";

// Deterministic hash from slug for consistent stat variation
function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) - h + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Category-specific stat pools — each has 8+ options to pick 4 from
const categoryStatPools: Record<string, Array<{ value: string; label: string }[]>> = {
  "Retail & E-Commerce": [
    [
      { value: "47%", label: "Avg. Conversion Lift" },
      { value: "2.1s", label: "Page Load Time" },
      { value: "$4.2M", label: "Revenue Recovered" },
      { value: "89%", label: "Cart Recovery Rate" },
    ],
    [
      { value: "3.8x", label: "ROI on Digital" },
      { value: "62%", label: "Repeat Purchase Rate" },
      { value: "< 200ms", label: "Search Latency" },
      { value: "12M+", label: "SKUs Managed" },
    ],
    [
      { value: "340%", label: "Mobile Revenue Growth" },
      { value: "98.5%", label: "Order Accuracy" },
      { value: "24/7", label: "Omnichannel Uptime" },
      { value: "1.4s", label: "Checkout Speed" },
    ],
    [
      { value: "55%", label: "Lower Cart Abandonment" },
      { value: "4.8★", label: "Avg. App Rating" },
      { value: "$18M", label: "GMV Processed" },
      { value: "31%", label: "Higher AOV" },
    ],
    [
      { value: "73%", label: "Customer Retention" },
      { value: "2.4M", label: "Monthly Active Users" },
      { value: "99.9%", label: "Platform Uptime" },
      { value: "< 50ms", label: "API Response Time" },
    ],
    [
      { value: "41%", label: "Lower Return Rate" },
      { value: "5.2x", label: "Inventory Turnover" },
      { value: "180+", label: "Integrations Built" },
      { value: "92%", label: "Fulfilment Accuracy" },
    ],
    [
      { value: "68%", label: "Engagement Increase" },
      { value: "$2.8M", label: "Cost Savings" },
      { value: "< 1s", label: "Recommendation Speed" },
      { value: "84%", label: "Personalisation Hit Rate" },
    ],
    [
      { value: "29%", label: "Higher Margin" },
      { value: "3.1M", label: "Products Catalogued" },
      { value: "99.5%", label: "Delivery Success Rate" },
      { value: "17 Days", label: "Faster Launch" },
    ],
    [
      { value: "156%", label: "YoY Revenue Growth" },
      { value: "4.9★", label: "Customer Satisfaction" },
      { value: "< 2s", label: "Mobile Load Time" },
      { value: "38%", label: "Reduced Support Tickets" },
    ],
    [
      { value: "82%", label: "Repeat Buyers" },
      { value: "$7.6M", label: "Annual GMV" },
      { value: "45%", label: "Faster Time-to-Market" },
      { value: "99.97%", label: "Transaction Success" },
    ],
  ],

  "Healthcare & Medical": [
    [
      { value: "99.99%", label: "HIPAA Compliance" },
      { value: "42%", label: "Reduced Wait Times" },
      { value: "3.2M", label: "Patient Records Managed" },
      { value: "< 3s", label: "EHR Load Time" },
    ],
    [
      { value: "67%", label: "Faster Diagnosis" },
      { value: "100%", label: "HL7/FHIR Compliant" },
      { value: "24/7", label: "Telehealth Uptime" },
      { value: "$5.1M", label: "Admin Cost Savings" },
    ],
    [
      { value: "89%", label: "Patient Satisfaction" },
      { value: "35%", label: "Reduced No-Shows" },
      { value: "12s", label: "Avg. Check-In Time" },
      { value: "4.7★", label: "Platform Rating" },
    ],
    [
      { value: "58%", label: "Faster Intake Process" },
      { value: "Zero", label: "PHI Breaches" },
      { value: "1.8M", label: "Appointments Scheduled" },
      { value: "97%", label: "Claim Approval Rate" },
    ],
    [
      { value: "40%", label: "Lower Readmission" },
      { value: "2.6x", label: "Staff Productivity" },
      { value: "< 500ms", label: "Rx Lookup Speed" },
      { value: "99.9%", label: "System Uptime" },
    ],
    [
      { value: "73%", label: "Digital Adoption Rate" },
      { value: "28%", label: "Revenue Growth" },
      { value: "SOC 2", label: "Certified Compliant" },
      { value: "4.8★", label: "User Satisfaction" },
    ],
    [
      { value: "51%", label: "Reduced Paperwork" },
      { value: "94%", label: "Billing Accuracy" },
      { value: "3.5M", label: "Claims Processed" },
      { value: "< 2min", label: "Report Generation" },
    ],
    [
      { value: "82%", label: "Care Coordination" },
      { value: "$3.4M", label: "Annual Savings" },
      { value: "Zero", label: "Compliance Failures" },
      { value: "45%", label: "Faster Lab Results" },
    ],
    [
      { value: "91%", label: "Treatment Adherence" },
      { value: "63%", label: "Reduced Admin Time" },
      { value: "HIPAA", label: "Full Compliance" },
      { value: "2.1x", label: "Clinician Efficiency" },
    ],
    [
      { value: "76%", label: "Better Outcomes" },
      { value: "18s", label: "Avg. Response Time" },
      { value: "$8.2M", label: "Operational Savings" },
      { value: "99.95%", label: "Data Availability" },
    ],
  ],

  "Financial Services": [
    [
      { value: "99.999%", label: "Transaction Uptime" },
      { value: "< 10ms", label: "Trade Execution" },
      { value: "$2.3B", label: "Assets Managed" },
      { value: "PCI DSS", label: "Level 1 Certified" },
    ],
    [
      { value: "47%", label: "Faster Onboarding" },
      { value: "SOC 2", label: "Type II Compliant" },
      { value: "$890M", label: "Transactions/Month" },
      { value: "Zero", label: "Security Incidents" },
    ],
    [
      { value: "3.8x", label: "ROI on Platform" },
      { value: "72%", label: "Reduced Processing" },
      { value: "< 1s", label: "KYC Verification" },
      { value: "99.9%", label: "Fraud Detection" },
    ],
    [
      { value: "62%", label: "Lower Churn" },
      { value: "4.6★", label: "App Store Rating" },
      { value: "$145M", label: "Revenue Growth" },
      { value: "< 50ms", label: "API Latency" },
    ],
    [
      { value: "84%", label: "Auto-Reconciliation" },
      { value: "38%", label: "Cost Reduction" },
      { value: "24/7", label: "Real-Time Monitoring" },
      { value: "100%", label: "Regulatory Compliance" },
    ],
    [
      { value: "5.2x", label: "Productivity Gain" },
      { value: "91%", label: "Client Retention" },
      { value: "< 3s", label: "Report Generation" },
      { value: "$420M", label: "AUM Integrated" },
    ],
    [
      { value: "56%", label: "Faster Claims" },
      { value: "Zero", label: "Data Breaches" },
      { value: "2.7M", label: "Accounts Managed" },
      { value: "99.97%", label: "Payment Success" },
    ],
    [
      { value: "43%", label: "Revenue Uplift" },
      { value: "< 200ms", label: "Balance Inquiry" },
      { value: "ISO 27001", label: "Certified" },
      { value: "89%", label: "Digital Adoption" },
    ],
    [
      { value: "71%", label: "Fewer Manual Steps" },
      { value: "$6.8M", label: "Fraud Prevented" },
      { value: "100%", label: "Audit Trail" },
      { value: "3.2x", label: "Throughput Increase" },
    ],
    [
      { value: "95%", label: "STP Rate" },
      { value: "28%", label: "Lower OpEx" },
      { value: "< 500ms", label: "Ledger Sync" },
      { value: "4.9★", label: "Client Satisfaction" },
    ],
  ],

  "Real Estate & Property": [
    [
      { value: "38%", label: "Faster Closings" },
      { value: "2.4x", label: "Lead Conversion" },
      { value: "$1.2B", label: "Portfolio Managed" },
      { value: "94%", label: "Occupancy Rate" },
    ],
    [
      { value: "52%", label: "Reduced Vacancy" },
      { value: "4.7★", label: "Tenant Satisfaction" },
      { value: "< 2hr", label: "Maintenance Response" },
      { value: "3.1x", label: "Listing Engagement" },
    ],
    [
      { value: "67%", label: "Faster Lease Signing" },
      { value: "$8.5M", label: "Revenue Growth" },
      { value: "99.9%", label: "Platform Uptime" },
      { value: "41%", label: "Lower Vacancy Cost" },
    ],
    [
      { value: "29%", label: "Higher Rental Yield" },
      { value: "82%", label: "Digital Adoption" },
      { value: "< 48hr", label: "Application Processing" },
      { value: "1.8M", label: "Sq Ft Managed" },
    ],
    [
      { value: "73%", label: "Booking Conversion" },
      { value: "$4.2M", label: "Annual Revenue" },
      { value: "4.9★", label: "Guest Rating" },
      { value: "35%", label: "Reduced OpEx" },
    ],
    [
      { value: "44%", label: "Faster Project Delivery" },
      { value: "97%", label: "Budget Adherence" },
      { value: "12", label: "Concurrent Projects" },
      { value: "3.5x", label: "Investor ROI" },
    ],
    [
      { value: "58%", label: "More Leads Generated" },
      { value: "< 5min", label: "CMA Generation" },
      { value: "91%", label: "Client Satisfaction" },
      { value: "2.8x", label: "Sales Volume" },
    ],
    [
      { value: "61%", label: "Faster Approvals" },
      { value: "$340M", label: "Loans Processed" },
      { value: "99.5%", label: "Compliance Rate" },
      { value: "22 Days", label: "Avg. Closing Time" },
    ],
    [
      { value: "45%", label: "Reduced Downtime" },
      { value: "2.1x", label: "Operational Efficiency" },
      { value: "< 1hr", label: "Issue Resolution" },
      { value: "87%", label: "Tenant Retention" },
    ],
    [
      { value: "83%", label: "Space Utilisation" },
      { value: "4.6★", label: "Member Rating" },
      { value: "32%", label: "Revenue Per Desk" },
      { value: "< 30s", label: "Booking Time" },
    ],
  ],

  "Education & E-Learning": [
    [
      { value: "92%", label: "Course Completion" },
      { value: "3.4x", label: "Student Engagement" },
      { value: "500K+", label: "Learners Served" },
      { value: "4.8★", label: "Platform Rating" },
    ],
    [
      { value: "78%", label: "Knowledge Retention" },
      { value: "< 2s", label: "Content Load Time" },
      { value: "45%", label: "Better Outcomes" },
      { value: "2.6M", label: "Lessons Delivered" },
    ],
    [
      { value: "86%", label: "Employee Completion" },
      { value: "3.1x", label: "Training ROI" },
      { value: "$2.8M", label: "Cost Savings" },
      { value: "< 1wk", label: "Course Deployment" },
    ],
    [
      { value: "94%", label: "Student Match Rate" },
      { value: "4.9★", label: "Tutor Rating" },
      { value: "62%", label: "Grade Improvement" },
      { value: "< 4hr", label: "Avg. Response Time" },
    ],
    [
      { value: "71%", label: "Fluency Acceleration" },
      { value: "12", label: "Languages Supported" },
      { value: "2.3M", label: "Practice Sessions" },
      { value: "88%", label: "Daily Active Users" },
    ],
    [
      { value: "97%", label: "Parent Satisfaction" },
      { value: "< 10s", label: "Check-In Time" },
      { value: "Zero", label: "Safety Incidents" },
      { value: "43%", label: "Admin Time Saved" },
    ],
    [
      { value: "89%", label: "Certification Rate" },
      { value: "2.4x", label: "Skill Acquisition" },
      { value: "180+", label: "Programmes Offered" },
      { value: "4.7★", label: "Graduate Rating" },
    ],
    [
      { value: "65%", label: "Faster Publishing" },
      { value: "3.8M", label: "Digital Textbooks" },
      { value: "99.9%", label: "Content Uptime" },
      { value: "47%", label: "Cost Reduction" },
    ],
    [
      { value: "91%", label: "Job Placement Rate" },
      { value: "14 Wks", label: "Avg. Bootcamp Length" },
      { value: "4.8★", label: "Alumni Rating" },
      { value: "$85K", label: "Avg. Starting Salary" },
    ],
    [
      { value: "83%", label: "Learning Goal Met" },
      { value: "2.9x", label: "Engagement Boost" },
      { value: "1.1M", label: "Assessments Taken" },
      { value: "99.5%", label: "Platform Reliability" },
    ],
  ],

  "Hospitality & Tourism": [
    [
      { value: "34%", label: "Higher RevPAR" },
      { value: "4.8★", label: "Guest Satisfaction" },
      { value: "< 2min", label: "Check-In Time" },
      { value: "91%", label: "Occupancy Rate" },
    ],
    [
      { value: "56%", label: "Direct Bookings" },
      { value: "$3.6M", label: "Revenue Growth" },
      { value: "73%", label: "Repeat Guests" },
      { value: "< 30s", label: "Booking Speed" },
    ],
    [
      { value: "42%", label: "Higher ADR" },
      { value: "2.8x", label: "Online Engagement" },
      { value: "99.9%", label: "Booking Uptime" },
      { value: "88%", label: "Guest Retention" },
    ],
    [
      { value: "29%", label: "Lower OTA Fees" },
      { value: "4.9★", label: "Trip Rating" },
      { value: "$5.2M", label: "Bookings Processed" },
      { value: "67%", label: "Mobile Bookings" },
    ],
    [
      { value: "81%", label: "Table Utilisation" },
      { value: "38%", label: "Higher Spend/Cover" },
      { value: "< 15min", label: "Wait Reduction" },
      { value: "4.7★", label: "Diner Rating" },
    ],
    [
      { value: "63%", label: "Faster Service" },
      { value: "$1.8M", label: "Cost Savings" },
      { value: "97%", label: "Order Accuracy" },
      { value: "3.2x", label: "Delivery Volume" },
    ],
    [
      { value: "47%", label: "Ancillary Revenue" },
      { value: "92%", label: "Guest Satisfaction" },
      { value: "< 5min", label: "Concierge Response" },
      { value: "2.4x", label: "Upsell Conversion" },
    ],
    [
      { value: "71%", label: "Group Booking Rate" },
      { value: "$4.1M", label: "Event Revenue" },
      { value: "4.6★", label: "Venue Rating" },
      { value: "35%", label: "Planning Time Saved" },
    ],
    [
      { value: "54%", label: "Route Optimisation" },
      { value: "89%", label: "Customer Satisfaction" },
      { value: "12K+", label: "Tours Managed" },
      { value: "3.7x", label: "Booking Conversion" },
    ],
    [
      { value: "68%", label: "Online Revenue Share" },
      { value: "4.5★", label: "Platform Rating" },
      { value: "< 1hr", label: "Support Response" },
      { value: "44%", label: "Operational Savings" },
    ],
  ],

  "Manufacturing & Industrial": [
    [
      { value: "32%", label: "Reduced Downtime" },
      { value: "99.8%", label: "Production Uptime" },
      { value: "2.6x", label: "Throughput Increase" },
      { value: "$7.3M", label: "Waste Reduction" },
    ],
    [
      { value: "45%", label: "Faster Changeover" },
      { value: "94%", label: "Quality Rate (FPY)" },
      { value: "< 5ms", label: "Sensor Latency" },
      { value: "3.1x", label: "OEE Improvement" },
    ],
    [
      { value: "58%", label: "Inventory Optimised" },
      { value: "$4.5M", label: "Annual Savings" },
      { value: "99.5%", label: "On-Time Delivery" },
      { value: "2.8x", label: "Supply Chain Visibility" },
    ],
    [
      { value: "41%", label: "Energy Savings" },
      { value: "Zero", label: "Unplanned Stops" },
      { value: "87%", label: "Predictive Accuracy" },
      { value: "< 2min", label: "Alert Response" },
    ],
    [
      { value: "67%", label: "Faster Prototyping" },
      { value: "3.4x", label: "R&D Velocity" },
      { value: "$12M", label: "Revenue from New Lines" },
      { value: "99.9%", label: "System Reliability" },
    ],
    [
      { value: "28%", label: "Lower Scrap Rate" },
      { value: "ISO 9001", label: "Certified" },
      { value: "1.2M", label: "Units/Month" },
      { value: "53%", label: "Cycle Time Reduction" },
    ],
    [
      { value: "74%", label: "Automated QC" },
      { value: "$8.1M", label: "Defect Cost Saved" },
      { value: "< 100ms", label: "Inspection Speed" },
      { value: "99.7%", label: "Compliance Rate" },
    ],
    [
      { value: "39%", label: "Labour Productivity" },
      { value: "2.2x", label: "Order Fulfilment" },
      { value: "85%", label: "Capacity Utilisation" },
      { value: "$3.9M", label: "OpEx Reduction" },
    ],
    [
      { value: "52%", label: "Faster Time-to-Market" },
      { value: "96%", label: "Delivery Accuracy" },
      { value: "4.6★", label: "Client Satisfaction" },
      { value: "Zero", label: "Safety Incidents" },
    ],
    [
      { value: "63%", label: "Better Yield" },
      { value: "3.7x", label: "Data Utilisation" },
      { value: "< 1s", label: "Dashboard Refresh" },
      { value: "$5.6M", label: "Cost Avoidance" },
    ],
  ],

  "Professional Services": [
    [
      { value: "43%", label: "Higher Utilisation" },
      { value: "2.9x", label: "Revenue Per Head" },
      { value: "$6.2M", label: "Billable Revenue" },
      { value: "91%", label: "Client Retention" },
    ],
    [
      { value: "67%", label: "Faster Proposals" },
      { value: "4.8★", label: "Client Rating" },
      { value: "< 24hr", label: "Response Time" },
      { value: "38%", label: "Reduced Overhead" },
    ],
    [
      { value: "52%", label: "Improved Margins" },
      { value: "3.4x", label: "Project Throughput" },
      { value: "99.5%", label: "SLA Compliance" },
      { value: "$4.1M", label: "Cost Savings" },
    ],
    [
      { value: "81%", label: "On-Time Delivery" },
      { value: "2.1x", label: "Team Productivity" },
      { value: "< 1hr", label: "Report Generation" },
      { value: "94%", label: "Scope Adherence" },
    ],
    [
      { value: "59%", label: "Faster Staffing" },
      { value: "$8.7M", label: "Contracts Managed" },
      { value: "4.7★", label: "Employee Satisfaction" },
      { value: "73%", label: "Repeat Business" },
    ],
    [
      { value: "44%", label: "Admin Time Saved" },
      { value: "3.6x", label: "Consulting ROI" },
      { value: "97%", label: "Deliverable Quality" },
      { value: "< 48hr", label: "Turnaround Time" },
    ],
    [
      { value: "71%", label: "Proposal Win Rate" },
      { value: "$2.3M", label: "New Revenue" },
      { value: "88%", label: "Resource Utilisation" },
      { value: "2.5x", label: "Growth Rate" },
    ],
    [
      { value: "36%", label: "Lower Attrition" },
      { value: "4.9★", label: "Service Rating" },
      { value: "< 30min", label: "Onboarding Time" },
      { value: "62%", label: "Process Automation" },
    ],
    [
      { value: "85%", label: "Client Satisfaction" },
      { value: "$5.4M", label: "Portfolio Value" },
      { value: "3.2x", label: "Engagement Depth" },
      { value: "99.9%", label: "Data Security" },
    ],
    [
      { value: "47%", label: "Faster Invoicing" },
      { value: "92%", label: "Collection Rate" },
      { value: "2.7x", label: "Deal Flow" },
      { value: "< 2 Days", label: "Contract Cycle" },
    ],
  ],

  "Media & Entertainment": [
    [
      { value: "4.2M", label: "Monthly Streams" },
      { value: "< 200ms", label: "Buffering Latency" },
      { value: "92%", label: "Content Discovery" },
      { value: "3.8x", label: "Engagement Rate" },
    ],
    [
      { value: "67%", label: "Audience Growth" },
      { value: "$5.4M", label: "Ad Revenue" },
      { value: "4.7★", label: "Platform Rating" },
      { value: "< 1s", label: "Load Time" },
    ],
    [
      { value: "2.1M", label: "Active Subscribers" },
      { value: "45%", label: "Higher Retention" },
      { value: "99.99%", label: "Stream Uptime" },
      { value: "HDR/4K", label: "Quality Support" },
    ],
    [
      { value: "340%", label: "Distribution Reach" },
      { value: "$8.3M", label: "Licensing Revenue" },
      { value: "< 4hr", label: "Publish Cycle" },
      { value: "89%", label: "Creator Satisfaction" },
    ],
    [
      { value: "58%", label: "Higher CPM" },
      { value: "3.5x", label: "Viral Coefficient" },
      { value: "1.8M", label: "Daily Interactions" },
      { value: "< 500ms", label: "Feed Latency" },
    ],
    [
      { value: "74%", label: "Production Efficiency" },
      { value: "$2.9M", label: "Cost Savings" },
      { value: "4K/8K", label: "Resolution Support" },
      { value: "42%", label: "Faster Post-Production" },
    ],
    [
      { value: "81%", label: "Listener Retention" },
      { value: "12M", label: "Downloads" },
      { value: "< 3s", label: "Episode Load" },
      { value: "4.8★", label: "Show Rating" },
    ],
    [
      { value: "63%", label: "Click-Through Rate" },
      { value: "2.6x", label: "Readership Growth" },
      { value: "$3.7M", label: "Subscription Revenue" },
      { value: "< 2s", label: "Article Load" },
    ],
    [
      { value: "47%", label: "Higher Booking Rate" },
      { value: "4.9★", label: "Client Rating" },
      { value: "95%", label: "On-Time Delivery" },
      { value: "2.3x", label: "Portfolio Reach" },
    ],
    [
      { value: "88%", label: "Fill Rate" },
      { value: "$6.1M", label: "Event Revenue" },
      { value: "Zero", label: "Technical Failures" },
      { value: "3.1x", label: "Ticket Sales" },
    ],
  ],

  "Non-Profit & Social Enterprise": [
    [
      { value: "47%", label: "Higher Donations" },
      { value: "2.8x", label: "Donor Retention" },
      { value: "$4.2M", label: "Funds Raised" },
      { value: "91%", label: "Transparency Score" },
    ],
    [
      { value: "63%", label: "Volunteer Engagement" },
      { value: "< 5min", label: "Donation Processing" },
      { value: "3.4x", label: "Outreach Reach" },
      { value: "4.8★", label: "Donor Satisfaction" },
    ],
    [
      { value: "82%", label: "Impact Measurability" },
      { value: "$7.1M", label: "Grants Processed" },
      { value: "35%", label: "Admin Cost Reduction" },
      { value: "97%", label: "Compliance Rate" },
    ],
    [
      { value: "54%", label: "Member Growth" },
      { value: "2.3x", label: "Campaign ROI" },
      { value: "< 1hr", label: "Report Generation" },
      { value: "89%", label: "Stakeholder Trust" },
    ],
    [
      { value: "71%", label: "Community Reach" },
      { value: "$2.6M", label: "Impact Delivered" },
      { value: "99.5%", label: "Data Integrity" },
      { value: "4.7★", label: "Beneficiary Rating" },
    ],
    [
      { value: "38%", label: "Operational Savings" },
      { value: "3.1x", label: "Program Scale" },
      { value: "< 24hr", label: "Grant Turnaround" },
      { value: "92%", label: "Mission Alignment" },
    ],
    [
      { value: "67%", label: "Awareness Growth" },
      { value: "$5.8M", label: "Annual Impact" },
      { value: "100%", label: "Audit Compliance" },
      { value: "2.5x", label: "Advocacy Reach" },
    ],
    [
      { value: "44%", label: "Cost-Per-Impact Down" },
      { value: "4.9★", label: "Partner Rating" },
      { value: "< 3min", label: "Intake Processing" },
      { value: "86%", label: "Program Completion" },
    ],
    [
      { value: "59%", label: "Adoption Increase" },
      { value: "$1.9M", label: "Care Funded" },
      { value: "3.6x", label: "Rescue Capacity" },
      { value: "94%", label: "Placement Success" },
    ],
    [
      { value: "73%", label: "Social ROI" },
      { value: "2.9x", label: "Beneficiaries Served" },
      { value: "< 48hr", label: "Response Time" },
      { value: "$3.3M", label: "Value Created" },
    ],
  ],

  "Technology & Startups": [
    [
      { value: "99.99%", label: "Platform Uptime" },
      { value: "< 50ms", label: "P99 Latency" },
      { value: "4.8★", label: "App Rating" },
      { value: "3.2x", label: "Deployment Speed" },
    ],
    [
      { value: "72%", label: "Faster Ship Cycles" },
      { value: "$12M", label: "ARR Growth" },
      { value: "Zero", label: "Security Breaches" },
      { value: "2.4x", label: "Team Velocity" },
    ],
    [
      { value: "58%", label: "Lower Churn" },
      { value: "< 100ms", label: "API Response" },
      { value: "99.95%", label: "SLA Achievement" },
      { value: "$8.6M", label: "Revenue Impact" },
    ],
    [
      { value: "89%", label: "Model Accuracy" },
      { value: "3.7x", label: "Processing Speed" },
      { value: "< 200ms", label: "Inference Time" },
      { value: "$5.1M", label: "Efficiency Gains" },
    ],
    [
      { value: "4.9★", label: "Store Rating" },
      { value: "2.1M", label: "Downloads" },
      { value: "47%", label: "DAU Growth" },
      { value: "< 1.5s", label: "Cold Start" },
    ],
    [
      { value: "< 10ms", label: "Block Confirmation" },
      { value: "$340M", label: "TVL Secured" },
      { value: "Zero", label: "Smart Contract Exploits" },
      { value: "99.99%", label: "Node Uptime" },
    ],
    [
      { value: "67%", label: "Threat Detection" },
      { value: "< 5min", label: "Incident Response" },
      { value: "SOC 2", label: "Type II Certified" },
      { value: "Zero", label: "Breach Incidents" },
    ],
    [
      { value: "3.8x", label: "CI/CD Speed" },
      { value: "99.9%", label: "Pipeline Success" },
      { value: "< 15min", label: "Deploy Time" },
      { value: "74%", label: "Infra Cost Savings" },
    ],
    [
      { value: "91%", label: "Edge Coverage" },
      { value: "< 20ms", label: "Edge Latency" },
      { value: "2.6x", label: "Data Throughput" },
      { value: "$4.3M", label: "Operational Savings" },
    ],
    [
      { value: "45%", label: "Faster Prototyping" },
      { value: "82%", label: "Developer Adoption" },
      { value: "4.7★", label: "SDK Rating" },
      { value: "< 3s", label: "Build Time" },
    ],
  ],

  "Agriculture & Farming": [
    [
      { value: "31%", label: "Higher Crop Yield" },
      { value: "42%", label: "Water Savings" },
      { value: "$3.8M", label: "Revenue Growth" },
      { value: "2.4x", label: "Harvest Efficiency" },
    ],
    [
      { value: "28%", label: "Feed Cost Reduction" },
      { value: "97%", label: "Herd Health Score" },
      { value: "< 5min", label: "Alert Response" },
      { value: "3.1x", label: "Productivity Gain" },
    ],
    [
      { value: "38%", label: "Equipment Uptime" },
      { value: "$2.1M", label: "Maintenance Savings" },
      { value: "< 1hr", label: "Diagnostic Time" },
      { value: "87%", label: "Predictive Accuracy" },
    ],
    [
      { value: "45%", label: "Yield Improvement" },
      { value: "< 100m", label: "GPS Precision" },
      { value: "2.7x", label: "Input Efficiency" },
      { value: "$5.4M", label: "Cost Avoidance" },
    ],
    [
      { value: "52%", label: "Waste Reduction" },
      { value: "99.5%", label: "Cold Chain Compliance" },
      { value: "< 2hr", label: "Farm-to-Shelf" },
      { value: "4.6★", label: "Buyer Rating" },
    ],
    [
      { value: "34%", label: "Higher Organic Yield" },
      { value: "100%", label: "Certification Maintained" },
      { value: "< 24hr", label: "Audit Readiness" },
      { value: "2.3x", label: "Premium Revenue" },
    ],
    [
      { value: "29%", label: "Lower Bycatch" },
      { value: "94%", label: "Stock Sustainability" },
      { value: "$1.9M", label: "Revenue Growth" },
      { value: "3.5x", label: "Catch Efficiency" },
    ],
    [
      { value: "41%", label: "Timber Yield" },
      { value: "100%", label: "FSC Compliance" },
      { value: "< 3hr", label: "Survey Time" },
      { value: "2.8x", label: "Monitoring Range" },
    ],
    [
      { value: "56%", label: "Co-op Revenue Growth" },
      { value: "4.7★", label: "Member Satisfaction" },
      { value: "< 48hr", label: "Payment Processing" },
      { value: "83%", label: "Resource Sharing" },
    ],
    [
      { value: "63%", label: "Data-Driven Decisions" },
      { value: "$4.7M", label: "Total Savings" },
      { value: "91%", label: "Forecast Accuracy" },
      { value: "2.2x", label: "Labour Productivity" },
    ],
  ],

  "Construction & Engineering": [
    [
      { value: "27%", label: "Faster Project Delivery" },
      { value: "94%", label: "On-Budget Completion" },
      { value: "$8.3M", label: "Cost Savings" },
      { value: "Zero", label: "Safety Incidents" },
    ],
    [
      { value: "35%", label: "Design Efficiency" },
      { value: "3.1x", label: "BIM Adoption" },
      { value: "$4.6M", label: "Rework Avoidance" },
      { value: "99%", label: "Plan Accuracy" },
    ],
    [
      { value: "41%", label: "Faster Procurement" },
      { value: "2.7x", label: "Supply Chain Speed" },
      { value: "< 24hr", label: "Quote Turnaround" },
      { value: "87%", label: "Material Utilisation" },
    ],
    [
      { value: "52%", label: "Reduced Change Orders" },
      { value: "$6.1M", label: "Project Value" },
      { value: "4.7★", label: "Client Satisfaction" },
      { value: "91%", label: "Milestone Adherence" },
    ],
    [
      { value: "38%", label: "Faster Permitting" },
      { value: "100%", label: "Code Compliance" },
      { value: "< 48hr", label: "Inspection Scheduling" },
      { value: "2.4x", label: "Document Throughput" },
    ],
    [
      { value: "44%", label: "Resource Optimisation" },
      { value: "Zero", label: "OSHA Violations" },
      { value: "$3.2M", label: "Liability Savings" },
      { value: "3.5x", label: "Field Reporting" },
    ],
    [
      { value: "33%", label: "Faster Renovations" },
      { value: "96%", label: "Customer Satisfaction" },
      { value: "< 1wk", label: "Estimate Delivery" },
      { value: "$2.8M", label: "Annual Revenue" },
    ],
    [
      { value: "59%", label: "Design Visualisation" },
      { value: "4.8★", label: "Client Rating" },
      { value: "2.9x", label: "Project Pipeline" },
      { value: "< 3 Days", label: "Concept Turnaround" },
    ],
    [
      { value: "45%", label: "Facility Uptime" },
      { value: "$5.7M", label: "Maintenance Savings" },
      { value: "< 30min", label: "Work Order Response" },
      { value: "92%", label: "SLA Compliance" },
    ],
    [
      { value: "31%", label: "Lower Material Waste" },
      { value: "3.3x", label: "Crew Productivity" },
      { value: "99.5%", label: "Quality Compliance" },
      { value: "< 2hr", label: "Daily Reporting" },
    ],
  ],

  "Transportation & Logistics": [
    [
      { value: "23%", label: "Fuel Cost Savings" },
      { value: "99.7%", label: "On-Time Delivery" },
      { value: "2.8x", label: "Fleet Utilisation" },
      { value: "$6.4M", label: "Annual Savings" },
    ],
    [
      { value: "34%", label: "Faster Last-Mile" },
      { value: "< 15min", label: "Route Optimisation" },
      { value: "4.7★", label: "Customer Rating" },
      { value: "3.1x", label: "Delivery Capacity" },
    ],
    [
      { value: "41%", label: "Warehouse Efficiency" },
      { value: "99.8%", label: "Order Accuracy" },
      { value: "< 2hr", label: "Pick-to-Ship" },
      { value: "$4.9M", label: "Cost Reduction" },
    ],
    [
      { value: "52%", label: "Container Utilisation" },
      { value: "2.4x", label: "Throughput" },
      { value: "< 4hr", label: "Customs Clearance" },
      { value: "97%", label: "Shipment Visibility" },
    ],
    [
      { value: "87%", label: "Schedule Adherence" },
      { value: "3.5x", label: "Ridership Growth" },
      { value: "< 30s", label: "Ticketing Speed" },
      { value: "4.6★", label: "Passenger Rating" },
    ],
    [
      { value: "45%", label: "Lower Wait Times" },
      { value: "2.9x", label: "Driver Utilisation" },
      { value: "99.9%", label: "App Uptime" },
      { value: "< 3min", label: "Match Time" },
    ],
    [
      { value: "31%", label: "Freight Cost Down" },
      { value: "94%", label: "Tracking Accuracy" },
      { value: "$8.2M", label: "Revenue Growth" },
      { value: "< 1hr", label: "ETA Accuracy" },
    ],
    [
      { value: "98.5%", label: "OTP Performance" },
      { value: "$3.7M", label: "Fuel Savings" },
      { value: "2.6x", label: "Cargo Volume" },
      { value: "< 5min", label: "Turnaround Reduction" },
    ],
    [
      { value: "38%", label: "Express Delivery" },
      { value: "4.8★", label: "Sender Rating" },
      { value: "99.5%", label: "Parcel Integrity" },
      { value: "< 2hr", label: "Sort Time" },
    ],
    [
      { value: "56%", label: "Route Efficiency" },
      { value: "3.3x", label: "Network Reach" },
      { value: "$5.1M", label: "Operational Savings" },
      { value: "91%", label: "On-Time Performance" },
    ],
  ],

  "Government & Public Sector": [
    [
      { value: "64%", label: "Citizen Satisfaction" },
      { value: "< 5min", label: "Service Processing" },
      { value: "$12M", label: "Cost Savings" },
      { value: "100%", label: "ADA Compliance" },
    ],
    [
      { value: "47%", label: "Faster Permitting" },
      { value: "FedRAMP", label: "Authorised" },
      { value: "3.2x", label: "Digital Adoption" },
      { value: "99.9%", label: "System Uptime" },
    ],
    [
      { value: "82%", label: "Incident Response" },
      { value: "< 90s", label: "Dispatch Time" },
      { value: "Zero", label: "Data Breaches" },
      { value: "4.6★", label: "Officer Rating" },
    ],
    [
      { value: "71%", label: "Paperless Operations" },
      { value: "$8.4M", label: "Administrative Savings" },
      { value: "< 24hr", label: "Request Processing" },
      { value: "Section 508", label: "Compliant" },
    ],
    [
      { value: "53%", label: "Higher Graduation" },
      { value: "2.7x", label: "Resource Utilisation" },
      { value: "4.7★", label: "Educator Rating" },
      { value: "$3.1M", label: "Budget Optimised" },
    ],
    [
      { value: "38%", label: "Faster Claim Processing" },
      { value: "99.5%", label: "Uptime SLA" },
      { value: "HIPAA", label: "Compliant" },
      { value: "2.4x", label: "Patient Throughput" },
    ],
    [
      { value: "99.99%", label: "Grid Reliability" },
      { value: "27%", label: "Energy Savings" },
      { value: "$15M", label: "Infrastructure Value" },
      { value: "< 1hr", label: "Outage Response" },
    ],
    [
      { value: "42%", label: "Filing Efficiency" },
      { value: "100%", label: "Regulatory Compliance" },
      { value: "< 3 Days", label: "Processing Time" },
      { value: "$6.7M", label: "Revenue Collected" },
    ],
    [
      { value: "67%", label: "Digital Services" },
      { value: "3.5x", label: "Citizen Engagement" },
      { value: "< 10min", label: "Registration Time" },
      { value: "94%", label: "Satisfaction Score" },
    ],
    [
      { value: "58%", label: "Visitor Satisfaction" },
      { value: "2.1x", label: "Park Usage" },
      { value: "$2.4M", label: "Revenue Growth" },
      { value: "< 1min", label: "Reservation Time" },
    ],
  ],

  "Sports & Recreation": [
    [
      { value: "47%", label: "Fan Engagement" },
      { value: "4.8★", label: "App Rating" },
      { value: "$5.2M", label: "Merchandise Revenue" },
      { value: "3.1x", label: "Season Ticket Sales" },
    ],
    [
      { value: "62%", label: "Broadcast Reach" },
      { value: "$18M", label: "Media Revenue" },
      { value: "99.99%", label: "Stream Uptime" },
      { value: "2.7x", label: "Sponsorship Value" },
    ],
    [
      { value: "35%", label: "Member Growth" },
      { value: "4.7★", label: "Member Rating" },
      { value: "< 30s", label: "Check-In Time" },
      { value: "$2.8M", label: "Monthly Revenue" },
    ],
    [
      { value: "41%", label: "Member Retention" },
      { value: "2.4x", label: "Class Bookings" },
      { value: "< 1min", label: "Sign-Up Time" },
      { value: "4.6★", label: "Gym Rating" },
    ],
    [
      { value: "73%", label: "Class Attendance" },
      { value: "3.2x", label: "Studio Revenue" },
      { value: "< 15s", label: "Booking Speed" },
      { value: "94%", label: "Client Retention" },
    ],
    [
      { value: "89%", label: "Belt Advancement" },
      { value: "2.8x", label: "Enrolment Growth" },
      { value: "4.9★", label: "Parent Rating" },
      { value: "$1.4M", label: "Annual Revenue" },
    ],
    [
      { value: "52%", label: "Tee Time Utilisation" },
      { value: "4.5★", label: "Golfer Rating" },
      { value: "$3.6M", label: "Club Revenue" },
      { value: "< 2min", label: "Booking Time" },
    ],
    [
      { value: "67%", label: "Participant Growth" },
      { value: "3.4x", label: "Booking Volume" },
      { value: "4.7★", label: "Adventure Rating" },
      { value: "$4.1M", label: "Seasonal Revenue" },
    ],
    [
      { value: "78%", label: "Ticket Sell-Through" },
      { value: "$7.3M", label: "Event Revenue" },
      { value: "< 5s", label: "Ticket Purchase" },
      { value: "2.9x", label: "Repeat Attendance" },
    ],
    [
      { value: "58%", label: "Dancer Retention" },
      { value: "3.1x", label: "Recital Revenue" },
      { value: "4.8★", label: "Parent Rating" },
      { value: "< 20s", label: "Registration Time" },
    ],
  ],

  "Beauty & Personal Care": [
    [
      { value: "43%", label: "Rebooking Rate" },
      { value: "4.8★", label: "Client Rating" },
      { value: "$1.2M", label: "Annual Revenue" },
      { value: "< 30s", label: "Booking Time" },
    ],
    [
      { value: "67%", label: "Client Retention" },
      { value: "2.8x", label: "Revenue Per Chair" },
      { value: "< 1min", label: "Check-In Time" },
      { value: "4.9★", label: "Spa Rating" },
    ],
    [
      { value: "52%", label: "Walk-In Conversion" },
      { value: "3.1x", label: "Product Sales" },
      { value: "91%", label: "Client Satisfaction" },
      { value: "$890K", label: "Monthly Revenue" },
    ],
    [
      { value: "38%", label: "No-Show Reduction" },
      { value: "4.7★", label: "Salon Rating" },
      { value: "2.4x", label: "Service Revenue" },
      { value: "< 15s", label: "Scheduling Speed" },
    ],
    [
      { value: "74%", label: "Skin Improvement" },
      { value: "4.9★", label: "Treatment Rating" },
      { value: "$2.1M", label: "Revenue Growth" },
      { value: "3.5x", label: "Repeat Visits" },
    ],
    [
      { value: "45%", label: "Higher Revenue/Visit" },
      { value: "88%", label: "Booking Fill Rate" },
      { value: "< 2min", label: "Consultation Setup" },
      { value: "4.6★", label: "Artist Rating" },
    ],
    [
      { value: "61%", label: "Online Sales Growth" },
      { value: "3.8x", label: "Brand Reach" },
      { value: "4.8★", label: "Product Rating" },
      { value: "$4.5M", label: "E-Commerce Revenue" },
    ],
    [
      { value: "56%", label: "Customer Loyalty" },
      { value: "2.6x", label: "Product Revenue" },
      { value: "< 24hr", label: "Fulfilment Time" },
      { value: "93%", label: "Satisfaction Score" },
    ],
    [
      { value: "82%", label: "Clinic Utilisation" },
      { value: "4.7★", label: "Patient Rating" },
      { value: "$3.2M", label: "Revenue Growth" },
      { value: "97%", label: "Treatment Success" },
    ],
    [
      { value: "39%", label: "Retail Attach Rate" },
      { value: "3.3x", label: "Appointment Volume" },
      { value: "< 45s", label: "Booking Speed" },
      { value: "4.5★", label: "Google Rating" },
    ],
  ],

  "Automotive": [
    [
      { value: "34%", label: "Higher Close Rate" },
      { value: "$8.2M", label: "Monthly Sales" },
      { value: "4.6★", label: "Dealer Rating" },
      { value: "< 5min", label: "Finance Processing" },
    ],
    [
      { value: "47%", label: "Faster Turnaround" },
      { value: "2.8x", label: "Bay Utilisation" },
      { value: "4.7★", label: "Service Rating" },
      { value: "$1.4M", label: "Revenue Growth" },
    ],
    [
      { value: "61%", label: "Wash Throughput" },
      { value: "3.2x", label: "Membership Revenue" },
      { value: "< 8min", label: "Full Service Time" },
      { value: "4.8★", label: "Customer Rating" },
    ],
    [
      { value: "38%", label: "Inventory Turnover" },
      { value: "99.5%", label: "Part Availability" },
      { value: "$3.6M", label: "Monthly Revenue" },
      { value: "< 1hr", label: "Delivery Time" },
    ],
    [
      { value: "29%", label: "Fleet Cost Savings" },
      { value: "97%", label: "Vehicle Uptime" },
      { value: "2.4x", label: "Utilisation Rate" },
      { value: "< 15min", label: "Dispatch Time" },
    ],
    [
      { value: "73%", label: "Booking Conversion" },
      { value: "4.5★", label: "Rental Rating" },
      { value: "$5.1M", label: "Annual Revenue" },
      { value: "< 3min", label: "Pick-Up Time" },
    ],
    [
      { value: "52%", label: "Repair Efficiency" },
      { value: "3.4x", label: "Insurance Claims" },
      { value: "4.6★", label: "Shop Rating" },
      { value: "$2.3M", label: "Revenue Growth" },
    ],
    [
      { value: "44%", label: "Service Upsell" },
      { value: "2.6x", label: "Tyre Sales Volume" },
      { value: "< 45min", label: "Service Time" },
      { value: "91%", label: "Customer Retention" },
    ],
    [
      { value: "67%", label: "Rider Engagement" },
      { value: "4.8★", label: "Shop Rating" },
      { value: "$1.8M", label: "Revenue Growth" },
      { value: "3.1x", label: "Parts Revenue" },
    ],
    [
      { value: "58%", label: "Detail Upsell Rate" },
      { value: "4.9★", label: "Service Rating" },
      { value: "2.3x", label: "Revenue Per Vehicle" },
      { value: "< 2hr", label: "Full Detail Time" },
    ],
  ],

  "Legal Services": [
    [
      { value: "42%", label: "Faster Case Resolution" },
      { value: "91%", label: "Win Rate" },
      { value: "$6.4M", label: "Billable Revenue" },
      { value: "4.8★", label: "Client Rating" },
    ],
    [
      { value: "67%", label: "Research Time Saved" },
      { value: "3.2x", label: "Case Throughput" },
      { value: "< 24hr", label: "Client Response" },
      { value: "94%", label: "Client Satisfaction" },
    ],
    [
      { value: "53%", label: "Contract Turnaround" },
      { value: "$8.1M", label: "Deal Value" },
      { value: "99.9%", label: "Data Security" },
      { value: "2.7x", label: "Productivity Gain" },
    ],
    [
      { value: "78%", label: "Case Dismissal Rate" },
      { value: "< 4hr", label: "Response Time" },
      { value: "4.9★", label: "Client Rating" },
      { value: "$3.6M", label: "Annual Revenue" },
    ],
    [
      { value: "45%", label: "Faster Visa Processing" },
      { value: "92%", label: "Approval Rate" },
      { value: "3.4x", label: "Case Volume" },
      { value: "4.7★", label: "Client Satisfaction" },
    ],
    [
      { value: "61%", label: "Faster Patent Filing" },
      { value: "$12M", label: "IP Value Protected" },
      { value: "97%", label: "Grant Rate" },
      { value: "< 48hr", label: "Prior Art Search" },
    ],
    [
      { value: "89%", label: "Settlement Success" },
      { value: "2.8x", label: "Case Handling" },
      { value: "$4.2M", label: "Recovered" },
      { value: "< 1hr", label: "Initial Consult" },
    ],
    [
      { value: "56%", label: "Document Automation" },
      { value: "4.6★", label: "Client Rating" },
      { value: "$2.9M", label: "Estate Value" },
      { value: "< 3 Days", label: "Plan Completion" },
    ],
    [
      { value: "73%", label: "Transaction Speed" },
      { value: "$15M", label: "Deals Closed" },
      { value: "99.5%", label: "Compliance" },
      { value: "3.1x", label: "Closing Velocity" },
    ],
    [
      { value: "82%", label: "Access Success" },
      { value: "< 2hr", label: "Intake Time" },
      { value: "$1.7M", label: "Pro Bono Value" },
      { value: "4.5★", label: "Client Rating" },
    ],
  ],

  "Small Business": [
    [
      { value: "34%", label: "Revenue Growth" },
      { value: "4.7★", label: "Customer Rating" },
      { value: "< 1min", label: "Checkout Speed" },
      { value: "2.4x", label: "Foot Traffic" },
    ],
    [
      { value: "47%", label: "Online Orders" },
      { value: "3.1x", label: "Table Turnover" },
      { value: "4.8★", label: "Diner Rating" },
      { value: "$890K", label: "Monthly Revenue" },
    ],
    [
      { value: "41%", label: "Member Retention" },
      { value: "2.6x", label: "Class Attendance" },
      { value: "4.6★", label: "Member Rating" },
      { value: "< 20s", label: "Check-In Time" },
    ],
    [
      { value: "56%", label: "Client Acquisition" },
      { value: "3.4x", label: "Project Pipeline" },
      { value: "91%", label: "Client Satisfaction" },
      { value: "< 2hr", label: "Proposal Time" },
    ],
    [
      { value: "38%", label: "Job Win Rate" },
      { value: "2.8x", label: "Estimate Volume" },
      { value: "$1.2M", label: "Revenue Growth" },
      { value: "4.7★", label: "Homeowner Rating" },
    ],
    [
      { value: "63%", label: "Rebooking Rate" },
      { value: "4.9★", label: "Salon Rating" },
      { value: "< 30s", label: "Booking Time" },
      { value: "3.2x", label: "Revenue Per Stylist" },
    ],
    [
      { value: "52%", label: "Listing Performance" },
      { value: "2.3x", label: "Lead Generation" },
      { value: "4.5★", label: "Agent Rating" },
      { value: "< 24hr", label: "Response Time" },
    ],
    [
      { value: "45%", label: "Tax Filing Speed" },
      { value: "99.9%", label: "Accuracy Rate" },
      { value: "$2.1M", label: "Revenue Managed" },
      { value: "4.8★", label: "Client Rating" },
    ],
    [
      { value: "71%", label: "Proposal Win Rate" },
      { value: "3.5x", label: "Referral Revenue" },
      { value: "88%", label: "Client Retention" },
      { value: "< 1hr", label: "Contract Signing" },
    ],
    [
      { value: "58%", label: "Project Delivery" },
      { value: "4.6★", label: "Client Rating" },
      { value: "2.9x", label: "Income Growth" },
      { value: "< 15min", label: "Invoice Processing" },
    ],
  ],
};

/**
 * Returns 4 unique, industry-relevant stats for a given industry.
 * Uses the industry's position within its parent category for deterministic selection.
 */
export function getIndustryStats(
  slug: string,
  parentCategory: string,
): { value: string; label: string }[] {
  const pool = categoryStatPools[parentCategory];
  if (!pool) {
    // Fallback for unknown categories
    return [
      { value: "99.9%", label: "Platform Uptime" },
      { value: "3x", label: "Faster Deployment" },
      { value: "Zero", label: "Data Breaches" },
      { value: "4.8★", label: "Client Satisfaction" },
    ];
  }
  
  const hash = slugHash(slug);
  const idx = hash % pool.length;
  return pool[idx];
}
