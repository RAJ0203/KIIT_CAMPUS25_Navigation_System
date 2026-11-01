// The ONLY place the frontend talks to the backend.
// Mock mode (default) reads src/mocks/mockCampus.ts. Real mode calls the frozen API contract.
// Phase 4: connect the real endpoints, then delete the mock branches and the mock file.
import type { Location, RouteRequest, RouteResponse } from "@/types/campus";
import { MOCK_LOCATIONS, getMockRoute } from "@/mocks/mockCampus";
import locationsData from "@/data/locations.json";


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


export interface AuthUser {
  id: number;
  username: string;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export async function registerUser(
  username: string,
  password: string
): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.detail ?? "Registration failed"
    );
  }

  return data as AuthUser;
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.detail ?? "Login failed"
    );
  }

  return data as LoginResponse;
}


/** GET /locations - the canonical location list. */
export async function getLocations(): Promise<Location[]> {
  if (USE_MOCK) {
    const canonical = locationsData as Location[];
    const allLocations = [
      ...canonical,
      ...MOCK_LOCATIONS.filter(
        (mockLocation) => !canonical.some((location) => location.id === mockLocation.id)
      ),
    ];


    let savedPoints: {
      id: string;
      x: number;
      y: number;
      floor: number;
    }[] = [];

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("kiit-map-inspector-points-v1");
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            savedPoints = parsed.filter(
              (point): point is { id: string; x: number; y: number; floor: number } =>
                point !== null &&
                typeof point === "object" &&
                typeof point.id === "string" &&
                typeof point.x === "number" &&
                typeof point.y === "number" &&
                typeof point.floor === "number"
            );
          }
        }
      } catch {
        savedPoints = [];
      }
    }


    const savedById = new Map(savedPoints.map((point) => [point.id, point]));
    const mockById = new Map(MOCK_LOCATIONS.map((point) => [point.id, point]));

    return allLocations.map((location) => {
      const savedPoint = savedById.get(location.id);
      const mockPoint = mockById.get(location.id);

      return {
        ...location,
        floor: savedPoint?.floor ?? location.floor,
        x: savedPoint?.x ?? location.x ?? mockPoint?.x ?? null,
        y: savedPoint?.y ?? location.y ?? mockPoint?.y ?? null,
      };
    });
  }

  const response = await fetch(API_BASE_URL + "/locations");

  if (!response.ok) {
    throw new ApiError(response.status, "GET /locations failed");
  }

  const data = (await response.json()) as { locations: Location[] };
  return data.locations;
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
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      data.detail ?? "POST /route failed"
    );
  }
  return (await response.json()) as RouteResponse;
}
