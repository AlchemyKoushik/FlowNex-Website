import { IMPROVEMENT_AREAS, URGENCY_VALUES } from "./types";

export { IMPROVEMENT_AREAS, URGENCY_VALUES };
export type ImprovementAreas = (typeof IMPROVEMENT_AREAS)[number];
export type Urgency = (typeof URGENCY_VALUES)[number];
