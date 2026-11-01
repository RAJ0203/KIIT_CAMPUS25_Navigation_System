// Turns the backend's ordered path of canonical node IDs into drawable pieces.
// This file never routes: it only reads the path it is given, in order.
import type { Location } from "@/types/campus";

/** Consecutive path nodes that sit on the same floor. */
export interface FloorSegment {
  floor: number;
  nodes: Location[];
}

/** Two consecutive path nodes whose floors differ (a staircase transition). */
export interface FloorTransition {
  fromId: string;
  toId: string;
  fromFloor: number;
  toFloor: number;
}

/** Two consecutive path nodes whose blocks differ. */
export interface BlockTransition {
  fromId: string;
  toId: string;
  fromBlock: string;
  toBlock: string;
}

export type RouteGeometry =
  | {
      ok: true;
      nodes: Location[];
      segments: FloorSegment[];
      floorTransitions: FloorTransition[];
      blockTransitions: BlockTransition[];
    }
  | { ok: false; unknownIds: string[] };

export function buildRouteGeometry(
  path: string[],
  locations: Location[]
): RouteGeometry {
  const byId = new Map<string, Location>();
  for (const loc of locations) byId.set(loc.id, loc);

  const unknownIds = Array.from(new Set(path.filter((id) => !byId.has(id))));
  if (unknownIds.length > 0) return { ok: false, unknownIds };

  const nodes = path.map((id) => byId.get(id) as Location);
  const segments: FloorSegment[] = [];
  const floorTransitions: FloorTransition[] = [];
  const blockTransitions: BlockTransition[] = [];

  nodes.forEach((node, i) => {
    const prev = i > 0 ? nodes[i - 1] : null;

    if (prev === null || prev.floor !== node.floor) {
      segments.push({ floor: node.floor, nodes: [node] });
    } else {
      segments[segments.length - 1].nodes.push(node);
    }

    if (prev !== null && prev.floor !== node.floor) {
      floorTransitions.push({
        fromId: prev.id,
        toId: node.id,
        fromFloor: prev.floor,
        toFloor: node.floor,
      });
    }

    if (prev !== null && prev.block !== node.block) {
      blockTransitions.push({
        fromId: prev.id,
        toId: node.id,
        fromBlock: prev.block,
        toBlock: node.block,
      });
    }
  });

  return { ok: true, nodes, segments, floorTransitions, blockTransitions };
}