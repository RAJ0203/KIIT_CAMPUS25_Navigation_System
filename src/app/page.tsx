"use client";

import { useEffect, useState } from "react";
import CampusMapSvg from "@/components/map/CampusMapSvg";
import { getLocations, findRoute as requestRoute, USE_MOCK } from "@/lib/api";
import type { Location, RouteResponse } from "@/types/campus";
import { buildRouteGeometry } from "@/lib/routeGeometry";

export default function Home() {
  const [source, setSource] = useState("B018");
  const [destination, setDestination] = useState("B020");
  const [floor, setFloor] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [searched, setSearched] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((error: Error) => setLoadError(error.message));
  }, []);

  async function findRoute() {
    setRouteError(null);
    let result: RouteResponse | null = null;
    try {
      result = await requestRoute({ source, destination });
    } catch (error) {
      setRouteError(error instanceof Error ? error.message : "Route request failed");
    }
    setRoute(result);
    setSearched(true);
    setPlayKey((key) => key + 1);
    // Show the floor where the returned path starts (read from the path, no routing).
    if (result) {
      const start = locations.find((item) => item.id === result.path[0]);
      if (start) setFloor(start.floor);
    }
  }

  const sourceLocation = locations.find((item) => item.id === source);
  const destinationLocation = locations.find((item) => item.id === destination);
  // Split the backend path into floor steps (reads the path only, no routing).
  const geometry = route ? buildRouteGeometry(route.path, locations) : null;

  return (
    <main className="campus-atmosphere min-h-screen px-4 py-6 text-[var(--foreground)] sm:px-6 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-xl font-bold text-[#e7f5c8]">
              C25
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                KIIT CAMPUS25 NAVIGATION
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                KIIT Campus Navigator
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Development preview
          </div>
        </header>

        {USE_MOCK && (
          <div className="mb-6 flex gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm text-amber-100">
            <span className="text-lg">!</span>
            <div>
              <p className="font-semibold">Mock data is active</p>
              <p className="mt-1 leading-6 text-amber-100/70">
                Map positions and routes are placeholders for UI development.
                They are not verified campus navigation results.
              </p>
            </div>
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-white/10 bg-[#121b14] p-5 shadow-2xl shadow-black/10 sm:p-6">
            <div className="mb-6">
              <p className="text-sm text-slate-400">Plan your journey</p>
              <h2 className="mt-1 text-xl font-semibold">Where to?</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="source" className="mb-2 block text-sm font-medium text-slate-300">
                  Starting point
                </label>
                <select
                  id="source"
                  value={source}
                  onChange={(event) => {
                    setSource(event.target.value);
                    setSearched(false);
                    setRoute(null);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#18251a] px-3 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                >
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} ({location.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pl-2">
                <div className="flex flex-col items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-[var(--accent)]" />
                  <span className="h-5 border-l border-dashed border-slate-600" />
                  <span className="h-2.5 w-2.5 rounded-sm bg-[var(--accent)]" />
                </div>
                <p className="text-xs text-slate-500">Choose your destination below</p>
              </div>

              <div>
                <label htmlFor="destination" className="mb-2 block text-sm font-medium text-slate-300">
                  Destination
                </label>
                <select
                  id="destination"
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    setSearched(false);
                    setRoute(null);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#18251a] px-3 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                >
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} ({location.id})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={findRoute}
                className="w-full rounded-xl bg-[var(--accent)] px-4 py-3.5 font-semibold text-slate-950 shadow-lg shadow-black/30 transition hover:bg-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Find route <span className="ml-1">→</span>
              </button>
            </div>

            {(loadError || routeError) && (
              <p className="mt-4 rounded-xl border border-red-300/20 bg-red-300/[0.06] p-3 text-sm text-red-100">
                {loadError ?? routeError}
              </p>
            )}

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Route details
              </p>

              {!searched && (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Select two locations to check whether a matching development route exists.
                </p>
              )}

              {searched && route && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs text-slate-400">Distance</p>
                      <p className="mt-1 text-xl font-semibold">{route.distance}</p>
                      <p className="text-xs text-slate-500">movement units</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs text-slate-400">Path nodes</p>
                      <p className="mt-1 text-xl font-semibold">{route.path.length}</p>
                      <p className="text-xs text-slate-500">mock result</p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-300">Ordered path</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {route.path.map((node, index) => (
                        <span key={`${node}-${index}`} className="rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-2.5 py-1.5 text-xs text-[#e7f5c8]">
                          {node}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-amber-200/70">
                      Illustrative mock output only; not a verified route.
                    </p>
                  </div>
                </div>
              )}

              {searched && !route && (
                <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-slate-200">No mock route available</p>
                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    This pair is not in the current demo data. It does not mean the real campus has no route.
                  </p>
                </div>
              )}
            </div>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#121b14] shadow-2xl shadow-black/10">
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-sm text-slate-400">Navigation workspace</p>
                <h2 className="mt-1 text-lg font-semibold">Campus map</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {sourceLocation?.name ?? source} <span className="mx-1 text-[var(--accent)]">→</span> {destinationLocation?.name ?? destination}
                </p>
              </div>

              <div className="flex items-center gap-1 self-start rounded-xl border border-white/10 bg-[#0b100c] p-1">
                {[0, 1, 2, 3].map((floorNumber) => (
                  <button
                    key={floorNumber}
                    type="button"
                    onClick={() => setFloor(floorNumber)}
                    aria-pressed={floor === floorNumber}
                    className={`rounded-lg px-4 py-2 text-sm transition ${
                      floor === floorNumber
                        ? "bg-[var(--accent)] font-semibold text-slate-950"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Floor {floorNumber}
                  </button>
                ))}
              </div>
            </div>

            {geometry && geometry.ok && (
              <div className="border-b border-white/10 px-5 py-4 text-sm sm:px-6">
                <p className="font-medium text-slate-200">Route steps</p>
                <ol className="mt-3 space-y-2 text-slate-300">
                  {geometry.segments.map((segment, index) => {
                    const first = segment.nodes[0];
                    const last = segment.nodes[segment.nodes.length - 1];
                    const next = geometry.floorTransitions[index];
                    return (
                      <li key={`step-${index}`} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setFloor(segment.floor)}
                          className="text-left hover:text-white"
                        >
                          Floor {segment.floor}: {first.id}
                          {last.id !== first.id ? ` → ${last.id}` : ""}
                        </button>
                        {next && (
                          <p className="text-amber-200/80">
                            Take the stairs: Floor {next.fromFloor} → Floor {next.toFloor}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ol>
                {geometry.blockTransitions.map((change, index) => (
                  <p key={`block-${index}`} className="mt-2 text-slate-400">
                    Block {change.fromBlock} → Block {change.toBlock} (between {change.fromId} and {change.toId})
                  </p>
                ))}
                <p className="mt-3 text-xs text-slate-500">
                  Click a step to show that floor on the map.
                </p>
                <button
                  type="button"
                  onClick={() => setPlayKey((key) => key + 1)}
                  className="mt-3 rounded-lg border border-[var(--accent)]/30 px-3 py-1.5 text-xs font-medium text-[#e7f5c8] transition hover:bg-[var(--accent)]/10"
                >
                  Replay walk
                </button>
              </div>
            )}
            <div className="p-3 sm:p-5">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b100c] p-2 sm:p-4">
                <CampusMapSvg locations={locations} floor={floor} routePath={route?.path ?? []} playKey={playKey} />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1 pb-1">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                    Map nodes
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                    Selected route info
                  </span>
                </div>
                <p className="text-xs text-slate-500">Schematic preview · not to scale</p>
              </div>
            </div>
          </section>
        </section>

        <footer className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>KIIT Campus Navigator · Frontend development preview</p>
          <p>Route computation remains the backend&apos;s responsibility.</p>
        </footer>
      </div>
    </main>
  );
}

