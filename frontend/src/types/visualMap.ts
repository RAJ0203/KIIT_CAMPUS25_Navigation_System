/**
 * Visual mapping types for campus floor plans.
 * Separate from the canonical backend/API schema.
 * Coordinates use original floor-plan image pixels.
 */

export interface FloorPlanDefinition {
  floor: number;
  src: string;
  width: number;
  height: number;
}

export interface VisualCoordinate {
  id: string;
  floor: number;
  x: number;
  y: number;
  verified: boolean;
}

export interface CorridorWaypoint {
  id: string;
  floor: number;
  x: number;
  y: number;
  verified: boolean;
}

export interface VisualRouteSegment {
  floor: number;
  points: CorridorWaypoint[];
}
