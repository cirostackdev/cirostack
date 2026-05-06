import type { StartupOverrideMap } from "./types";
import { byStageContent } from "./by-stage";

export const startupContentOverrides: StartupOverrideMap = {
  ...byStageContent,
  // TODO: by-vertical, by-product, by-founder, by-challenge, by-engagement
};
