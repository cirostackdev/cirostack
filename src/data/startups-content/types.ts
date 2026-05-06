import type {
  StartupEntry,
  StartupSolution,
  StartupValueProp,
  StartupStat,
  StartupServiceApplication,
  StartupDeepDiveSection,
  StartupFAQ,
  StartupClientReview,
} from "../startups-generated";

export type StartupOverride = {
  challenges?: string[];
  solutions?: StartupSolution[];
  valueProps?: StartupValueProp[];
  stats?: StartupStat[];
  serviceApplications?: StartupServiceApplication[];
  deepDive?: StartupDeepDiveSection[];
  details?: string[];
  deliverables?: string[];
  startingAt?: string;
  faqs?: StartupFAQ[];
  whoWeHelped?: string[];
  clientReviews?: StartupClientReview[];
};

export type StartupOverrideMap = Record<string, StartupOverride>;
