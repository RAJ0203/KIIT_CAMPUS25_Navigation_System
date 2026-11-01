// Canonical types. Mirror docs/DATA_SCHEMA.md and docs/API_CONTRACT.md exactly.
// Do not add, rename or remove fields without change control (docs/CHANGELOG.md).

/** One entry of locations.json / GET /locations. */
export interface Location {
  id: string; // canonical node ID, e.g. "B018"
  name: string; // human-readable display name
  block: string; // campus block, e.g. "A", "B", "C"
  floor: number; // floor number (0-3)
  x: number; // SVG/map x-coordinate
  y: number; // SVG/map y-coordinate
  type?: string; // optional node type; allowed values are NOT frozen
}

/** POST /route request body. */
export interface RouteRequest {
  source: string;
  destination: string;
}

/** POST /route response body: total movement units + ordered canonical node IDs. */
export interface RouteResponse {
  distance: number;
  path: string[];
}