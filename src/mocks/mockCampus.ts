// ============================================================================
// MOCK DATA - FOR UI DEVELOPMENT ONLY.
// This is NOT the canonical campus graph. Delete this file in Phase 4, when the
// real GET /locations and POST /route are connected.
//  - Node IDs follow examples in the project docs.
//  - x/y values are INVENTED placeholders, not real map positions.
//  - Distances use measurements from the Master Document
//    (B018-B019 = 38, B019-B020 = 14, C001-stairs = 9, stair connector = 26)
//    and are NOT verified route results.
// ============================================================================
import type { Location, RouteRequest, RouteResponse } from "@/types/campus";

export const IS_MOCK_DATA = true;

export const MOCK_LOCATIONS: Location[] = [
  { id: "B018", name: "Room B018", block: "B", floor: 0, x: 120, y: 340, type: "room" },
  { id: "B019", name: "Room B019", block: "B", floor: 0, x: 240, y: 340, type: "room" },
  { id: "B020", name: "Room B020", block: "B", floor: 0, x: 320, y: 340, type: "room" },
  { id: "C001", name: "Room C001", block: "C", floor: 0, x: 520, y: 300, type: "room" },
  { id: "STAIR_C_F0", name: "Staircase C (Floor 0)", block: "C", floor: 0, x: 620, y: 300, type: "stair" },
  { id: "STAIR_C_F1", name: "Staircase C (Floor 1)", block: "C", floor: 1, x: 620, y: 300, type: "stair" },
  { id: "C101", name: "Room C101", block: "C", floor: 1, x: 520, y: 300, type: "room" },
];

// Keyed by "source|destination". Only these two pairs exist in the mock.
const MOCK_ROUTES: Record<string, RouteResponse> = {
  "B018|B020": { distance: 52, path: ["B018", "B019", "B020"] },
  "C001|C101": { distance: 44, path: ["C001", "STAIR_C_F0", "STAIR_C_F1", "C101"] },
};

/** Looks up a stored mock answer. Returns null when the mock has none. */
export function getMockRoute(req: RouteRequest): RouteResponse | null {
  return MOCK_ROUTES[`${req.source}|${req.destination}`] ?? null;
}