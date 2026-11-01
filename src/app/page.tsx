"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CampusMapSvg from "@/components/map/CampusMapSvg";
import {
  getLocations,
  findRoute as requestRoute,
  USE_MOCK,
} from "@/lib/api";
import { buildRouteGeometry } from "@/lib/routeGeometry";
import type { Location, RouteResponse } from "@/types/campus";

const MILLISECONDS_PER_SEGMENT = 1400;

export default function Home() {
  const [source, setSource] = useState("B018");
  const [destination, setDestination] = useState("B020");

  const [locations, setLocations] = useState<Location[]>([]);
  const [route, setRoute] = useState<RouteResponse | null>(null);

  // The position can be fractional: 1.5 means halfway between
  // route nodes at indices 1 and 2.
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackFinished, setPlaybackFinished] = useState(false);

  const [searched, setSearched] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [findingRoute, setFindingRoute] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Refs preserve playback timing across React renders and pause/resume.
  const playbackPositionRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const previousTimestampRef = useRef<number | null>(null);
  const elapsedInSegmentRef = useRef(0);

  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    previousTimestampRef.current = null;
  }, []);

  const resetJourney = useCallback(() => {
    cancelAnimation();

    playbackPositionRef.current = 0;
    elapsedInSegmentRef.current = 0;

    setPlaybackPosition(0);
    setIsPlaying(false);
    setPlaybackFinished(false);
  }, [cancelAnimation]);

  // Load canonical locations through the existing API layer.
  useEffect(() => {
    let active = true;

    getLocations()
      .then((data) => {
        if (!active) return;

        setLocations(data);
        setLoadError(null);
      })
      .catch((error: unknown) => {
        if (!active) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load campus locations.",
        );
      })
      .finally(() => {
        if (active) setLoadingLocations(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Animate continuously along the backend's ordered route.
  // This effect interpolates playback progress, not route geometry.
  useEffect(() => {
    if (!isPlaying || !route || route.path.length < 2) {
      cancelAnimation();
      return;
    }

    const lastIndex = route.path.length - 1;

    const animate = (timestamp: number) => {
      if (previousTimestampRef.current === null) {
        previousTimestampRef.current = timestamp;
      }

      const delta = Math.min(
        timestamp - previousTimestampRef.current,
        100,
      );

      previousTimestampRef.current = timestamp;

      elapsedInSegmentRef.current += delta;

      const segmentProgress = Math.min(
        elapsedInSegmentRef.current / MILLISECONDS_PER_SEGMENT,
        1,
      );

      const segmentStart = Math.floor(playbackPositionRef.current);
      const nextPosition = Math.min(
        segmentStart + segmentProgress,
        lastIndex,
      );

      playbackPositionRef.current = nextPosition;
      setPlaybackPosition(nextPosition);

      if (segmentProgress >= 1) {
        if (segmentStart >= lastIndex - 1) {
          playbackPositionRef.current = lastIndex;
          setPlaybackPosition(lastIndex);
          setIsPlaying(false);
          setPlaybackFinished(true);
          animationFrameRef.current = null;
          previousTimestampRef.current = null;
          elapsedInSegmentRef.current = 0;
          return;
        }

        playbackPositionRef.current = segmentStart + 1;
        setPlaybackPosition(segmentStart + 1);
        elapsedInSegmentRef.current = 0;
      }

      animationFrameRef.current =
        window.requestAnimationFrame(animate);
    };

    animationFrameRef.current =
      window.requestAnimationFrame(animate);

    return cancelAnimation;
  }, [isPlaying, route, cancelAnimation]);

  async function findRoute() {
    cancelAnimation();

    if (source === destination) {
      setRoute(null);
      setSearched(true);
      setRouteError("Choose two different locations.");
      resetJourney();
      return;
    }

    setFindingRoute(true);
    setRouteError(null);
    setIsPlaying(false);
    setPlaybackFinished(false);
    setPlaybackPosition(0);
    playbackPositionRef.current = 0;
    elapsedInSegmentRef.current = 0;

    try {
      const result = await requestRoute({ source, destination });

      setSearched(true);

      if (!result) {
        setRoute(null);
        setRouteError(
          "No route is available for this pair in the current data.",
        );
        return;
      }

      if (!Array.isArray(result.path) || result.path.length === 0) {
        setRoute(null);
        setRouteError("The route response contains no path nodes.");
        return;
      }

      setRoute(result);
      setPlaybackPosition(0);
      playbackPositionRef.current = 0;
      elapsedInSegmentRef.current = 0;
    } catch (error: unknown) {
      setRoute(null);
      setRouteError(
        error instanceof Error ? error.message : "Route request failed.",
      );
    } finally {
      setFindingRoute(false);
    }
  }

  function togglePlayback() {
    if (!route || route.path.length < 2) return;

    if (playbackFinished) {
      playbackPositionRef.current = 0;
      elapsedInSegmentRef.current = 0;
      setPlaybackPosition(0);
      setPlaybackFinished(false);
      setIsPlaying(true);
      return;
    }

    if (!isPlaying) {
      previousTimestampRef.current = null;
      setIsPlaying(true);
      return;
    }

    // Preserve fractional progress when paused.
    cancelAnimation();
    setIsPlaying(false);
  }

  const sourceLocation = locations.find(
    (location) => location.id === source,
  );

  const destinationLocation = locations.find(
    (location) => location.id === destination,
  );

  // Geometry only interprets the path returned by the backend.
  const geometry = route
    ? buildRouteGeometry(route.path, locations)
    : null;

  const unknownRouteIds =
    geometry && !geometry.ok ? geometry.unknownIds : [];

  const routeGeometryValid = Boolean(geometry?.ok);

  // Keep the active waypoint synchronized with the fractional position.
  const currentStepIndex = route
    ? Math.min(
        Math.floor(playbackPosition + 0.000001),
        route.path.length - 1,
      )
    : 0;

  const currentNodeId = route?.path[currentStepIndex] ?? null;

  const currentLocation = currentNodeId
    ? locations.find((location) => location.id === currentNodeId)
    : undefined;

  const nextNodeId =
    route && currentStepIndex < route.path.length - 1
      ? route.path[currentStepIndex + 1]
      : null;

  const nextLocation = nextNodeId
    ? locations.find((location) => location.id === nextNodeId)
    : undefined;

  // The active route waypoint selects the displayed floor automatically.
  const displayedFloor =
    currentLocation?.floor ?? sourceLocation?.floor ?? 0;

  const progress =
    route && route.path.length > 1
      ? (playbackPosition / (route.path.length - 1)) * 100
      : 0;

  const canPlay =
    Boolean(route) &&
    route!.path.length > 1 &&
    unknownRouteIds.length === 0;

  return (
    <main className="campus-atmosphere min-h-screen px-4 py-6 text-[var(--foreground)] sm:px-6 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-xl font-bold text-blue-700">
              C25
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                KIIT CAMPUS25 NAVIGATION
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                KIIT Campus Navigator
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                One journey. Automatic floor transitions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 sm:self-auto">
            <span
              className={`h-2 w-2 rounded-full ${
                USE_MOCK ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />

            {USE_MOCK ? "Development preview" : "Connected API"}
          </div>
        </header>

        {USE_MOCK && (
          <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <span className="text-lg" aria-hidden="true">
              !
            </span>

            <div>
              <p className="font-semibold">Development data is active</p>

              <p className="mt-1 leading-6 text-amber-800">
                Routes and map positions may be illustrative. Do not use this
                preview as verified, real-world campus navigation.
              </p>
            </div>
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <p className="text-sm text-slate-500">Plan your journey</p>

              <h2 className="mt-1 text-xl font-semibold">Where to?</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose a starting point and destination. The backend supplies
                the route, and navigation follows its ordered nodes.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="source"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Starting point
                </label>

                <select
                  id="source"
                  value={source}
                  disabled={loadingLocations || locations.length === 0}
                  onChange={(event) => {
                    setSource(event.target.value);
                    setRoute(null);
                    setSearched(false);
                    setRouteError(null);
                    resetJourney();
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:cursor-not-allowed disabled:bg-slate-50"
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
                  <span className="h-5 border-l border-dashed border-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-sm bg-[var(--accent)]" />
                </div>

                <p className="text-xs text-slate-500">
                  Your destination is the endpoint of the journey.
                </p>
              </div>

              <div>
                <label
                  htmlFor="destination"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Destination
                </label>

                <select
                  id="destination"
                  value={destination}
                  disabled={loadingLocations || locations.length === 0}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    setRoute(null);
                    setSearched(false);
                    setRouteError(null);
                    resetJourney();
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:cursor-not-allowed disabled:bg-slate-50"
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
                disabled={
                  loadingLocations ||
                  findingRoute ||
                  locations.length === 0
                }
                className="w-full rounded-xl bg-[var(--accent)] px-4 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {findingRoute ? "Finding route..." : "Find route →"}
              </button>
            </div>

            {loadingLocations && (
              <p className="mt-4 text-sm text-slate-500">
                Loading campus locations...
              </p>
            )}

            {loadError && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {loadError}
              </div>
            )}

            {routeError && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {routeError}
              </div>
            )}

            {!loadingLocations && !loadError && locations.length === 0 && (
              <p className="mt-4 text-sm text-slate-500">
                No locations are available.
              </p>
            )}

            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Route summary
              </p>

              {!searched && (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Your route details will appear here after you find a route.
                </p>
              )}

              {searched && route && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Distance</p>
                      <p className="mt-1 text-xl font-semibold">
                        {route.distance}
                      </p>
                      <p className="text-xs text-slate-500">
                        movement units
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Waypoints</p>
                      <p className="mt-1 text-xl font-semibold">
                        {route.path.length}
                      </p>
                      <p className="text-xs text-slate-500">
                        ordered path nodes
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-600">
                      Backend-provided path
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {route.path.map((node, index) => (
                        <span
                          key={`${node}-${index}`}
                          className={`rounded-lg border px-2.5 py-1.5 text-xs ${
                            index === currentStepIndex
                              ? "border-blue-500 bg-blue-50 font-semibold text-blue-700"
                              : "border-[var(--accent)]/20 bg-[var(--accent)]/10 text-blue-700"
                          }`}
                        >
                          {node}
                        </span>
                      ))}
                    </div>

                    {USE_MOCK && (
                      <p className="mt-3 text-xs leading-5 text-amber-700">
                        This is a mock route, not a verified campus route.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {searched && !route && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">
                    No route to display
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {routeError ?? "No route was returned for this pair."}
                  </p>
                </div>
              )}
            </div>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-sm text-slate-500">
                  Navigation workspace
                </p>

                <h2 className="mt-1 text-lg font-semibold">Live journey</h2>

                <p className="mt-1 text-sm text-slate-500">
                  {sourceLocation?.name ?? source}
                  <span className="mx-2 text-[var(--accent)]">→</span>
                  {destinationLocation?.name ?? destination}
                </p>
              </div>

              <div className="self-start rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                {playbackFinished
                  ? "Destination reached"
                  : isPlaying
                    ? "Navigation in progress"
                    : route
                      ? playbackPosition > 0
                        ? "Navigation paused"
                        : "Route ready"
                      : "Awaiting route"}
              </div>
            </div>

            {unknownRouteIds.length > 0 && (
              <div
                role="alert"
                className="border-b border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
              >
                <p className="font-semibold">
                  Some route nodes are missing from the location data.
                </p>

                <p className="mt-1">
                  Playback is disabled until these IDs can be resolved:{" "}
                  {unknownRouteIds.join(", ")}.
                </p>
              </div>
            )}

            {route && geometry?.ok && (
              <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Automatic navigation
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-slate-800">
                      {playbackFinished
                        ? "You have reached the destination"
                        : `Current waypoint: ${currentNodeId ?? route.path[0]}`}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Floor {displayedFloor}
                      {nextLocation
                        ? ` · Next: ${nextLocation.name} (${nextLocation.id})`
                        : " · End of route"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={togglePlayback}
                      disabled={!canPlay}
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {playbackFinished
                        ? "Play again"
                        : isPlaying
                          ? "Pause"
                          : playbackPosition > 0
                            ? "Resume"
                            : "Start navigation"}
                    </button>

                    <button
                      type="button"
                      onClick={resetJourney}
                      disabled={!route}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Journey progress</span>
                    <span>
                      {Math.min(
                        Math.floor(playbackPosition) + 1,
                        route.path.length,
                      )}{" "}
                      of {route.path.length} waypoints
                    </span>
                  </div>

                  <div
                    className="h-2.5 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label="Journey progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                  >
                    <div
                      className="h-full rounded-full bg-blue-600 transition-[width] duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {route && geometry?.ok && (
              <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium text-slate-700">
                    Your route sequence
                  </p>

                  <p className="text-xs text-slate-500">
                    Floor changes follow the ordered route automatically.
                  </p>
                </div>

                <ol className="mt-4 space-y-3">
                  {route.path.map((nodeId, index) => {
                    const location = locations.find(
                      (item) => item.id === nodeId,
                    );

                    const isCurrent = index === currentStepIndex;
                    const isComplete = index < currentStepIndex;

                    return (
                      <li
                        key={`${nodeId}-${index}`}
                        className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                          isCurrent
                            ? "border-blue-300 bg-blue-50"
                            : isComplete
                              ? "border-emerald-200 bg-emerald-50/60"
                              : "border-slate-200 bg-white"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            isCurrent
                              ? "bg-blue-600 text-white"
                              : isComplete
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {isComplete ? "✓" : index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {location?.name ?? nodeId}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {nodeId}
                            {location
                              ? ` · Block ${location.block} · Floor ${location.floor}`
                              : " · Location metadata unavailable"}
                          </p>
                        </div>

                        {isCurrent && (
                          <span className="shrink-0 text-xs font-semibold text-blue-700">
                            Current
                          </span>
                        )}

                        {isComplete && (
                          <span className="shrink-0 text-xs font-medium text-emerald-700">
                            Passed
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>

                {geometry.blockTransitions.length > 0 && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Block transitions in the returned path
                    </p>

                    {geometry.blockTransitions.map((transition, index) => (
                      <p
                        key={`block-transition-${index}`}
                        className="mt-2 text-sm text-slate-600"
                      >
                        Block {transition.fromBlock} → Block{" "}
                        {transition.toBlock}
                        <span className="text-slate-400">
                          {" "}
                          · {transition.fromId} to {transition.toId}
                        </span>
                      </p>
                    ))}
                  </div>
                )}

                {geometry.floorTransitions.length > 0 && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Floor transitions in the returned path
                    </p>

                    {geometry.floorTransitions.map((transition, index) => (
                      <p
                        key={`floor-transition-${index}`}
                        className="mt-2 text-sm text-slate-600"
                      >
                        Floor {transition.fromFloor} → Floor{" "}
                        {transition.toFloor}
                        <span className="text-slate-400">
                          {" "}
                          · {transition.fromId} to {transition.toId}
                        </span>
                      </p>
                    ))}

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Detected floor changes do not independently verify a
                      staircase, lift, or cross-floor connection.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Active map
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-800">
                    Floor {displayedFloor}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    The active floor follows the current journey waypoint.
                  </p>
                </div>

                {currentLocation && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
                    {currentLocation.name}
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 sm:p-5">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 sm:p-4">
                <CampusMapSvg
                  locations={locations}
                  floor={displayedFloor}
                  routePath={route?.path ?? []}
                  playKey={playbackPosition}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1 pb-1">
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                    Map locations
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    Starting point
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                    Destination
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Schematic preview · not to scale
                </p>
              </div>

              {!route && (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center">
                  <p className="font-medium text-slate-700">
                    Your journey will appear here
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Select your locations and choose Find route to begin.
                  </p>
                </div>
              )}

              {route && !routeGeometryValid && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Map playback is unavailable because some route nodes
                  cannot be resolved to known locations.
                </div>
              )}
            </div>
          </section>
        </section>

        <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>KIIT Campus Navigator · Frontend development preview</p>

          <p>Route computation remains the backend&apos;s responsibility.</p>
        </footer>
      </div>
    </main>
  );
}