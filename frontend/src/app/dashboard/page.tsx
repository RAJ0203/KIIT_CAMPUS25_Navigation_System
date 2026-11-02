"use client";

import { useEffect, useMemo, useState } from "react";
import CampusMapSvg from "@/components/map/CampusMapSvg";
import AuthPanel from "@/components/auth/AuthPanel";
import { motion } from "framer-motion";
import {
  findRoute,
  getLocations,
  USE_MOCK,
  type AuthUser,
} from "@/lib/api";
import type { Location, RouteResponse } from "@/types/campus";
import "./dashboard.css";

export default function NavigationDashboard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [activeFloor, setActiveFloor] = useState(0);
  const [playKey, setPlayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  function handleLogin(accessToken: string, user: AuthUser) {
    setToken(accessToken);
    setAuthUser(user);
    setError("");
  }

  function handleLogout() {
    setToken(null);
    setAuthUser(null);
    setRoute(null);
    setError("");
  }


  useEffect(() => {
    getLocations()
      .then((items) => {
        setLocations(items);
        if (items.length > 0) {
          setSource(items[0].id);
          setDestination(items.length > 1 ? items[1].id : items[0].id);
        }
      })
      .catch(() => setError("Could not load locations. Check the API connection."))
      .finally(() => setLoading(false));
  }, []);


  // Reset playback whenever a new route is received.
useEffect(() => {
    setPlayKey(0);
    setIsPlaying(false);
  }, [route]);

  // Animate through the route only when the user starts navigation.
  useEffect(() => {
    if (!isPlaying || !route || route.path.length === 0) {
      return;
    }

    const maxStep = route.path.length - 1;

    const timer = window.setInterval(() => {
      setPlayKey((current) => Math.min(current + 0.05, maxStep));
    }, 50);

    return () => window.clearInterval(timer);
  }, [isPlaying, route]);

  // Stop playback when the destination is reached.
  useEffect(() => {
    if (
      route &&
      isPlaying &&
      playKey >= route.path.length - 1
    ) {
      setIsPlaying(false);
    }
  }, [playKey, isPlaying, route]);

  // Automatically display the floor of the current waypoint.
  useEffect(() => {
    if (!route || route.path.length === 0) {
      return;
    }

    const currentIndex = Math.min(
      Math.floor(playKey),
      route.path.length - 1
    );

    const currentId = route.path[currentIndex];
    const currentLocation = locations.find(
      (location) => location.id === currentId
    );

    if (currentLocation) {
      setActiveFloor(currentLocation.floor);
    }
  }, [route, playKey, locations]);


  const selectedSource = locations.find((item) => item.id === source);
  const selectedDestination = locations.find((item) => item.id === destination);

  const routeLocations = useMemo(() => {
    if (!route) return [];
    const byId = new Map(locations.map((location) => [location.id, location]));
    return route.path.map((id) => byId.get(id)).filter((item): item is Location => Boolean(item));
  }, [route, locations]);

  function handleStartNavigation() {
    if (!route || route.path.length === 0) return;

    setPlayKey(0);

    const firstLocation = locations.find(
      (location) => location.id === route.path[0]
    );

    if (firstLocation) {
      setActiveFloor(firstLocation.floor);
    }

    setIsPlaying(true);
  }

  function handlePauseNavigation() {
    setIsPlaying(false);
  }

  function handleReplayNavigation() {
    if (!route || route.path.length === 0) return;

    setPlayKey(0);

    const firstLocation = locations.find(
      (location) => location.id === route.path[0]
    );

    if (firstLocation) {
      setActiveFloor(firstLocation.floor);
    }

    setIsPlaying(true);
  }

  const currentWaypointIndex = route
    ? Math.min(Math.floor(playKey), route.path.length - 1)
    : -1;

  async function handleFindRoute() {
    setError("");
    setRoute(null);

    if (!source || !destination) {
      setError("Choose both a starting point and a destination.");
      return;
    }
    if (source === destination) {
      setError("Choose two different locations.");
      return;
    }

    setSearching(true);
    try {
      const result = await findRoute(
        { source, destination },
        token ?? undefined
      );
      if (!result) {
        setError("No route is available for this pair in the current data.");
      } else {
        setRoute(result);
      }
    } catch (err) {
      if (err instanceof Error && "status" in err && err.status === 401) {
        handleLogout();
        setError("Your session expired. Please sign in again.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Route request failed. Please check the backend connection."
        );
      }
    } finally {
      setSearching(false);
    }
  }

  function locationLabel(location: Location) {
    return `${location.id} — ${location.name}`;
  }

  if (!token) {
    return <AuthPanel onLogin={handleLogin} />;
  }

  return (
    <main className="nav-shell">
      <header className="nav-header">
        <a className="nav-brand" href="/dashboard" aria-label="Campus25 dashboard home">
          <span className="brand-mark">C<span>25</span></span>
          <span className="brand-copy">
            <strong>CAMPUS<span>25</span></strong>
            <small>WAYFINDING SYSTEM</small>
          </span>
        </a>
        <div className="header-right">
          <span className="system-dot" />
          <span>{USE_MOCK ? "DEMO DATA MODE" : "LIVE API MODE"}</span>
          <span className="header-divider" />
          <span className="header-tag">
            {authUser?.username ?? "KIIT CAMPUS"}
          </span>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="nav-intro">
        <motion.div
          className="intro-copy"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="eyebrow"><span /> YOUR CAMPUS, CONNECTED</div>
          <h1>Find your way<span>.</span></h1>
          <p>Plan a campus journey with clear directions, location details, and route information.</p>
        </motion.div>
        <div className="intro-badge">
          <span className="badge-icon">✳</span>
          <span><strong>Built for campus life</strong><small>Simple. Clear. Connected.</small></span>
        </div>
      </section>

      <section className="nav-layout">
        <motion.aside
          className="route-panel"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className="panel-heading">
            <div>
              <span className="section-kicker">PLAN A JOURNEY</span>
              <h2>Where to?</h2>
            </div>
            <span className="heading-icon">↗</span>
          </div>

          <div className="location-fields">
            <div className="location-rail" aria-hidden="true">
              <span className="rail-start" />
              <span className="rail-line" />
              <span className="rail-end" />
            </div>
            <label className="field-group">
              <span className="field-label">STARTING POINT</span>
              <select value={source} onChange={(event) => setSource(event.target.value)} disabled={loading}>
                <option value="">Choose a starting point</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>{locationLabel(location)}</option>
                ))}
              </select>
              <span className="field-hint">{selectedSource ? `Block ${selectedSource.block} · Floor ${selectedSource.floor}` : "Select your current location"}</span>
            </label>

            <label className="field-group">
              <span className="field-label">DESTINATION</span>
              <select value={destination} onChange={(event) => setDestination(event.target.value)} disabled={loading}>
                <option value="">Choose a destination</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>{locationLabel(location)}</option>
                ))}
              </select>
              <span className="field-hint">{selectedDestination ? `Block ${selectedDestination.block} · Floor ${selectedDestination.floor}` : "Select where you want to go"}</span>
            </label>
          </div>

          <button className="find-route-button" onClick={handleFindRoute} disabled={loading || searching || locations.length < 2}>
            {searching ? <><span className="button-spinner" /> Finding route…</> : <>Find my route <span>↗</span></>}
          </button>

          {error && <div className="notice notice-error" role="alert">{error}</div>}
          {loading && <div className="notice">Loading campus locations…</div>}

          <div className="panel-footnote">
            <span className="info-icon">i</span>
            <p>Routes use the project API response. Demo routes may be placeholders and are not verified campus directions.</p>
          </div>

          <div className="panel-bottom">
            <span className="tiny-pulse" />
            <span>{locations.length} locations loaded</span>
            <span className="bottom-separator">·</span>
            <span>{USE_MOCK ? "Mock mode" : "Backend mode"}</span>
          </div>
        </motion.aside>

        <motion.section
          className="map-panel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          aria-label="Campus map and route results"
        >
          <div className="map-toolbar">
            <div>
              <span className="section-kicker">SPATIAL OVERVIEW</span>
              <h2>Campus map <span className="map-live-dot" /></h2>
            </div>
            <label className="map-chip">
              FLOOR
              <select
                value={activeFloor}
                onChange={(event) => setActiveFloor(Number(event.target.value))}
                aria-label="Select campus floor"
                style={{
                  marginLeft: "10px",
                  background: "transparent",
                  color: "inherit",
                  border: "none",
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                <option value={0}>Ground</option>
                <option value={1}>First</option>
                <option value={2}>Second</option>
                <option value={3}>Third</option>
              </select>
            </label>
          </div>

          <div className="map-stage">
            <div className="map-grid" aria-hidden="true" />
            <div className="map-image-wrap">
              <CampusMapSvg
                locations={locations}
                floor={activeFloor}
                routePath={route?.path ?? []}
                playKey={playKey}
              />
            </div>
            <div className="map-caption">
              <span className="caption-pin">⌖</span>
              <span><strong>Original campus plan</strong><small>Route overlay awaits verified map coordinates</small></span>
            </div>
          </div>

          <div className="map-legend">
            <span><i className="legend-origin" /> Start point</span>
            <span><i className="legend-destination" /> Destination</span>
            <span className="legend-note">Markers appear when map coordinates are verified.</span>
          </div>

          {route ? (
            <motion.div className="route-results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="results-topline">
                <div>
                  <span className="section-kicker">ROUTE RESPONSE</span>
                  <h3>Journey overview</h3>
                </div>
                <span className="result-status">{USE_MOCK ? "DEMO RESULT" : "API RESULT"}</span>
              </div>
              <div className="result-stats">
                <div className="stat-card">
                  <span className="stat-icon">↗</span>
                  <span className="stat-label">TOTAL DISTANCE</span>
                  <strong>{route.distance} <small>units</small></strong>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">◎</span>
                  <span className="stat-label">PATH WAYPOINTS</span>
                  <strong>{route.path.length}</strong>
                </div>
              </div>
              <div className="navigation-controls">
                {!isPlaying && playKey === 0 && (
                  <button
                    type="button"
                    className="navigation-button navigation-primary"
                    onClick={() => setIsPlaying(true)}
                  >
                    ▶ Start Navigation
                  </button>
                )}

                {isPlaying && (
                  <button
                    type="button"
                    className="navigation-button navigation-primary"
                    onClick={handlePauseNavigation}
                  >
                    Ⅱ Pause
                  </button>
                )}

                {!isPlaying && playKey > 0 && playKey < route.path.length - 1 && (
                  <button
                    type="button"
                    className="navigation-button navigation-primary"
                    onClick={() => setIsPlaying(true)}
                  >
                    ▶ Resume
                  </button>
                )}

                {!isPlaying && playKey >= route.path.length - 1 && (
                  <button
                    type="button"
                    className="navigation-button navigation-primary"
                    onClick={handleReplayNavigation}
                  >
                    ↻ Replay Navigation
                  </button>
                )}
              </div>
              <div className="waypoint-heading">
                <h4>Route sequence</h4>
                <span>{route.path.length} nodes returned</span>
              </div>
              <ol className="waypoint-list">
                {route.path.map((id, index) => {
                  const location = routeLocations[index];
                  return (
                    <li
                      key={`${id}-${index}`}
                      className={index === currentWaypointIndex ? "waypoint-active" : ""}
                    >
                      <span className={`waypoint-number ${index === 0 ? "waypoint-first" : index === route.path.length - 1 ? "waypoint-last" : ""}`}>
                        {index === 0 ? "S" : index === route.path.length - 1 ? "D" : String(index).padStart(2, "0")}
                      </span>
                      <span className="waypoint-copy">
                        <strong>{location?.name ?? id}</strong>
                        <small>{location ? `${location.id} · Block ${location.block} · Floor ${location.floor}` : "Location details unavailable"}</small>
                      </span>
                      <span className="waypoint-arrow">{index === route.path.length - 1 ? "✓" : "↓"}</span>
                    </li>
                  );
                })}
              </ol>
              {USE_MOCK && <p className="demo-disclaimer">Demo response: verify the route against canonical campus data before using it for real navigation.</p>}
            </motion.div>
          ) : (
            <div className="empty-route">
              <div className="empty-route-icon">⌁</div>
              <div><strong>Your journey will appear here</strong><p>Select two locations and choose “Find my route” to request directions.</p></div>
            </div>
          )}
        </motion.section>
      </section>

      <footer className="nav-footer">
        <span> <strong>CAMPUS25</strong> · KIIT navigation project</span>
        <span>Route logic powered by the backend <span className="footer-dot">●</span></span>
      </footer>
    </main>
  );
}
