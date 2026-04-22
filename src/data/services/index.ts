import type { ServiceEntry } from "./types";
import { servicesPart1 } from "./part1";
import { servicesPart2 } from "./part2";
import { servicesPart3 } from "./part3";
import { servicesPart4 } from "./part4";

export const servicesData: Record<string, ServiceEntry> = {
    ...servicesPart1,
    ...servicesPart2,
    ...servicesPart3,
    ...servicesPart4,
};

export type { ServiceEntry };
