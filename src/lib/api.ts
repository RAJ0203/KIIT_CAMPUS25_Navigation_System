// The ONLY place the frontend talks to the backend.
// Mock mode (default) reads src/mocks/mockCampus.ts. Real mode calls the frozen API contract.
// Phase 4: connect the real endpoints, then delete the mock branches and the mock file.
import type { Location, RouteRequest, RouteResponse } from "@/types/campus";
import { MOCK_LOCATIONS, getMockRoute } from "@/mocks/mockCampus";

// Set NEXT_PUBLIC_USE_MOCK=false in .env.local to call the real backend.
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
// ASSUMPTION: confirm the backend address with Riddhiraj.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** GET /locations - the canonical location list. */
export async function getLocations(): Promise<Location[]> {
  if (USE_MOCK) return MOCK_LOCATIONS;
  const response = await fetch(API_BASE_URL + "/locations");
  if (!response.ok) throw new ApiError(response.status, "GET /locations failed");
  return (await response.json()) as Location[];
}

/**
 * POST /route - JWT protected in API_CONTRACT.md.
 * ASSUMPTION: the token goes in an Authorization Bearer header. The auth contract
 * is not finalized, so confirm with Kshitish and Riddhiraj before relying on it.
 * In mock mode this returns null when the mock has no answer for the pair.
 */
export async function findRoute(
  request: RouteRequest,
  token?: string
): Promise<RouteResponse | null> {
  if (USE_MOCK) return getMockRoute(request);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = "Bearer " + token;
  const response = await fetch(API_BASE_URL + "/route", {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new ApiError(response.status, "POST /route failed");
  return (await response.json()) as RouteResponse;
}
