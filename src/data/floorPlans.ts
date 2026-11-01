import type { FloorPlanDefinition } from "@/types/visualMap";

/**
 * Original PNG dimensions.
 * Visual coordinates will use this image coordinate space.
 */
export const FLOOR_PLANS: Record<number, FloorPlanDefinition> = {
  0: {
    floor: 0,
    src: "/floor-plans/ground-floor.png",
    width: 1200,
    height: 848,
  },
  1: {
    floor: 1,
    src: "/floor-plans/first-floor-combined.png",
    width: 1200,
    height: 1041,
  },
  2: {
    floor: 2,
    src: "/floor-plans/second-floor.png",
    width: 1200,
    height: 920,
  },
  3: {
    floor: 3,
    src: "/floor-plans/third-floor.png",
    width: 1200,
    height: 560,
  },
};
