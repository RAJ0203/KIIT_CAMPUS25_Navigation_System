"use client";
import locationsSource from "@/data/locations.json";

import { useEffect, useState, type MouseEvent } from "react";
import { FLOOR_PLANS } from "@/data/floorPlans";
import coordinateSource from "@/data/visualCoordinates.json";

type MapPoint = {
  id: string;
  name: string;
  x: number;
  y: number;
  floor?: number;
};

const LEGACY_W = 1200;
const LEGACY_H = 1696;

const FLOOR_LABELS: Record<number, string> = {
  0: "Ground floor",
  1: "First floor",
  2: "Second floor",
  3: "Third floor",
};

export default function MapInspectorPage() {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [pending, setPending] = useState<{ x: number; y: number } | null>(null);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [message, setMessage] = useState("");
  const [zoom, setZoom] = useState(0.55);
  const [storageReady, setStorageReady] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [autoIndex, setAutoIndex] = useState(0);
  const coordinateLocations = locationsSource as { id: string; name?: string; floor: number; x?: number | null; y?: number | null }[];
  const pendingLocations = coordinateLocations.filter((item) => item.floor === selectedFloor && !points.some((point) => point.id === item.id && point.floor === item.floor) && !(Number.isFinite(item.x) && Number.isFinite(item.y)));
  const nextLocation = pendingLocations[autoIndex] ?? pendingLocations[0];
  const currentFloor = FLOOR_PLANS[selectedFloor];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kiit-map-inspector-points-v1");
      const storedPoints: MapPoint[] = [];
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((p): p is MapPoint => {
            if (
              p === null ||
              typeof p !== "object" ||
              typeof p.id !== "string" ||
              typeof p.name !== "string" ||
              typeof p.x !== "number" ||
              typeof p.y !== "number"
            ) {
              return false;
            }

            if (p.floor === undefined) {
              return (
                p.x >= 0 &&
                p.x <= LEGACY_W &&
                p.y >= 0 &&
                p.y <= LEGACY_H
              );
            }

            if (
              typeof p.floor !== "number" ||
              !Number.isInteger(p.floor) ||
              !Object.prototype.hasOwnProperty.call(FLOOR_PLANS, p.floor)
            ) {
              return false;
            }

            const plan = FLOOR_PLANS[p.floor];
            return (
              p.x >= 0 &&
              p.x <= plan.width &&
              p.y >= 0 &&
              p.y <= plan.height
            );
          });
          storedPoints.push(...valid);
        }
      }

      const sourcePoints = (coordinateSource as { id: string; floor: number; x: number | null; y: number | null; verified?: boolean }[])
        .filter((p) => typeof p.x === "number" && typeof p.y === "number")
        .map((p) => ({
          id: p.id,
          name: p.id,
          floor: p.floor,
          x: p.x as number,
          y: p.y as number
        }));

      const combined: MapPoint[] = [...sourcePoints];
      for (const point of storedPoints) {
        if (!combined.some((p) => p.id === point.id && p.floor === point.floor)) {
          combined.push(point);
        }
      }
      setPoints(combined);
    } catch {
      setMessage("Saved points could not be read; you can continue adding points.");
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (storageReady) {
      localStorage.setItem("kiit-map-inspector-points-v1", JSON.stringify(points));
    }
  }, [points, storageReady]);

  function imagePoint(event: MouseEvent<HTMLImageElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.round(Math.max(0, Math.min(currentFloor.width, (event.clientX - rect.left) * currentFloor.width / rect.width))),
      y: Math.round(Math.max(0, Math.min(currentFloor.height, (event.clientY - rect.top) * currentFloor.height / rect.height))),
    };
  }

  function addPoint() {
    const cleanId = id.trim();
    const cleanName = name.trim();

    if (!pending || !cleanId || !cleanName) {
      setMessage("Choose a point on the map and fill in both fields.");
      return;
    }

    const existing = points.find(
      (p) => p.id.toLowerCase() === cleanId.toLowerCase()
    );

    if (existing && existing.floor !== selectedFloor) {
      setMessage("This ID already belongs to another floor. Check the selected floor.");
      return;
    }

    const updated: MapPoint = {
      id: existing?.id ?? cleanId,
      name: cleanName,
      floor: selectedFloor,
      x: pending.x,
      y: pending.y,
    };

    setPoints((current) => {
      const index = current.findIndex(
        (p) => p.id.toLowerCase() === cleanId.toLowerCase()
      );
      if (index < 0) return [...current, updated];
      return current.map((p, i) => i === index ? updated : p);
    });

    setId("");
    setName("");
    setPending(null);
    setMessage(existing ? "Existing location coordinates updated locally." : "Location added locally.");
    setAutoIndex(0);
  }

  const csv = [
    "id,name,floor,x,y",
    ...points.map((p) =>
      [p.id, '"' + p.name.replace(/"/g, '""') + '"', p.floor ?? "", p.x, p.y].join(",")
    ),
  ].join("\n");

  async function copyCsv() {
    try {
      await navigator.clipboard.writeText(csv);
      setMessage("CSV copied to clipboard.");
    } catch {
      setMessage("Clipboard unavailable. Select and copy the CSV below.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-[#17233f]">
      <style>{`
        @keyframes popIn {
          from { transform: translate(-50%,-50%) scale(.45); opacity: .3; }
          to { transform: translate(-50%,-50%) scale(1); opacity: 1; }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .studio-card { background: rgba(255,255,255,.92); border: 1px solid #e7eaf2; box-shadow: 0 12px 36px rgba(31,48,83,.055); }
        .studio-input { width:100%; border:1px solid #dfe4ef; border-radius:12px; background:#fbfcff; padding:11px 12px; outline:none; transition:border .2s,box-shadow .2s; }
        .studio-input:focus { border-color:#4774f5; box-shadow:0 0 0 3px rgba(71,116,245,.12); }
        .studio-button { transition:transform .18s,box-shadow .18s,background .18s; }
        .studio-button:hover { transform:translateY(-1px); }
        .studio-enter { animation:floatIn .4s ease-out both; }
      `}</style>

      <header className="border-b border-[#e8ebf3] bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2455e6] text-xl font-black text-white shadow-lg shadow-blue-200">K</div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#5270bb]">KIIT - Campus Navigator</p>
              <p className="mt-0.5 text-sm font-semibold text-[#17233f]">Map Studio <span className="font-normal text-[#929bb0]">/ Calibration workspace</span></p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[#dce9df] bg-[#f3fbf5] px-3 py-2 text-xs font-semibold text-[#36784b] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#40a96a]"></span>
            Local preview · No backend changes
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9">
        <section className="studio-enter mb-7 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#dce5ff] bg-[#edf2ff] px-3 py-1.5 text-xs font-semibold text-[#3158ce]">
              <span className="text-base">✳</span> ORIGINAL MAP · PRECISION MODE
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-[-.045em] sm:text-5xl">
              Every point has a <span className="text-[#315ce8]">place.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#69758d] sm:text-base">
              Mark verified rooms, entrances, lifts and stairs on your real floor plan.
              Capture image coordinates without changing the source map.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl border border-[#e5e9f2] bg-white px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#929bb0]">Image size</p>
              <p className="mt-1 font-mono text-sm font-semibold">{currentFloor.width} × {currentFloor.height}</p>
            </div>
            <div className="rounded-2xl border border-[#e5e9f2] bg-white px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#929bb0]">Locations</p>
              <p className="mt-1 text-sm font-bold"><span className="text-[#315ce8]">{points.length.toString().padStart(2, "0")}</span> <span className="font-normal text-[#929bb0]">saved here</span></p>
            </div>
          </div>
        </section>

        <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f0dfb8] bg-[#fff9ec] px-4 py-3.5 text-sm text-[#795c27]">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ffedc6] text-base">✦</span>
            <div>
              <p className="font-bold">Verify before you mark</p>
              <p className="mt-0.5 text-xs leading-5 text-[#8d7448]">Choose a floor, confirm the plan, and click to mark locations. Points are stored locally; export the CSV when ready.</p>
            </div>
          </div>
          <span className="rounded-full border border-[#ead7ac] bg-white/70 px-3 py-1 text-[11px] font-semibold">Original image preserved</span>
        </section>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
          <section className="studio-card min-w-0 overflow-hidden rounded-[22px] studio-enter">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f6] px-4 py-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf2ff] text-lg">▧</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{currentFloor.src.split("/").pop()}</p>
                  <p className="mt-1 text-xs text-[#8993a8]">{FLOOR_LABELS[selectedFloor]} · {currentFloor.width} × {currentFloor.height}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-[#f0f4ff] px-3 py-2 font-mono text-xs font-semibold text-[#3158ce]">
                  {cursor ? `${cursor.x}, ${cursor.y}` : "X: —  Y: —"}
                </span>
                <button type="button" title="Zoom out" onClick={() => setZoom((z) => Math.max(.25, +(z - .1).toFixed(2)))} className="studio-button h-9 w-9 rounded-xl border border-[#e4e8f1] bg-white text-lg hover:bg-[#f5f7ff]">-</button>
                <span className="w-12 text-center text-xs font-semibold text-[#66728b]">{Math.round(zoom / .55 * 100)}%</span>
                <button type="button" title="Zoom in" onClick={() => setZoom((z) => Math.min(1.1, +(z + .1).toFixed(2)))} className="studio-button h-9 w-9 rounded-xl border border-[#e4e8f1] bg-white text-lg hover:bg-[#f5f7ff]">+</button>
                <button type="button" title="Reset zoom" onClick={() => setZoom(.55)} className="studio-button hidden rounded-xl border border-[#e4e8f1] px-3 py-2 text-xs font-semibold hover:bg-[#f5f7ff] sm:block">Reset</button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-b border-[#edf0f6] bg-white px-4 py-3 sm:px-5">
              <label htmlFor="floor-selector" className="text-xs font-bold uppercase tracking-wider text-[#66728b]">Select floor</label>
              <select
                id="floor-selector"
                value={selectedFloor}
                onChange={(event) => {
                  setSelectedFloor(Number(event.target.value));
                  setPending(null);
                  setCursor(null);
                  setMessage("");
                }}
                className="rounded-xl border border-[#dce3f2] bg-white px-3 py-2 text-sm font-semibold text-[#3158ce] outline-none focus:ring-2 focus:ring-blue-200"
              >
                {Object.values(FLOOR_PLANS).map((plan) => (
                  <option key={plan.floor} value={plan.floor}>
                    {FLOOR_LABELS[plan.floor]}
                  </option>
                ))}
              </select>
              <span className="text-xs text-[#8993a8]">Markers are shown for the selected floor.</span>
            </div>

            <div className="relative overflow-auto bg-[#f0f3f9] p-4 sm:p-7" style={{ backgroundImage: "radial-gradient(#d6ddec 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
              <div className="mx-auto w-fit overflow-hidden rounded-lg border border-white bg-white shadow-[0_12px_40px_rgba(32,48,78,.16)]">
                <div className="relative" style={{ width: `${600 * zoom / .55}px`, maxWidth: "none" }}>
                  <img
                    src={currentFloor.src}
                    alt={FLOOR_LABELS[selectedFloor] + " campus floor plan"}
                    width={currentFloor.width}
                    height={currentFloor.height}
                    draggable={false}
                    onMouseMove={(event) => setCursor(imagePoint(event))}
                    onMouseLeave={() => setCursor(null)}
                    onClick={(event) => { setPending(imagePoint(event)); setMessage(""); }}
                    className="block h-auto w-full cursor-crosshair select-none"
                  />
                  {points.filter((point) => point.floor === selectedFloor).map((point) => (
                    <div key={point.id} title={`${point.id} · ${point.name}`} className="pointer-events-none absolute" style={{ left: `${point.x / currentFloor.width * 100}%`, top: `${point.y / currentFloor.height * 100}%` }}>
                      <div className="absolute h-7 w-7 rounded-full border border-[#315ce8]/40 bg-[#315ce8]/10" style={{ left: 0, top: 0, transform: "translate(-50%,-50%)" }} />
                      <div className="absolute h-3 w-3 rounded-full border-2 border-white bg-[#315ce8] shadow-[0_0_0_1px_#315ce8]" style={{ left: 0, top: 0, transform: "translate(-50%,-50%)" }} />
                      <span className="absolute left-3 top-1 whitespace-nowrap rounded-md bg-white/95 px-1.5 py-1 text-[10px] font-bold text-[#3158ce] shadow-sm">{point.id}</span>
                    </div>
                  ))}
                  {pending && (
                    <div className="pointer-events-none absolute" style={{ left: `${pending.x / currentFloor.width * 100}%`, top: `${pending.y / currentFloor.height * 100}%` }}>
                      <div className="absolute h-8 w-8 rounded-full border-2 border-[#315ce8]/50 bg-[#315ce8]/10" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
                      <div className="absolute h-3.5 w-3.5 rounded-full border-[3px] border-white bg-[#315ce8] shadow-[0_0_0_2px_#315ce8]" style={{ left: "0", top: "0", transform: "translate(-50%,-50%)", animation: "popIn .2s ease-out" }} />
                    </div>
                  )}
                </div>
              </div>
              <div className="pointer-events-none absolute bottom-5 left-5 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-[10px] font-semibold tracking-wide text-[#7c879d] shadow-sm backdrop-blur">
                <span className="mr-2 text-[#315ce8]">⌖</span> CLICK MAP TO SELECT A POINT
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf0f6] px-4 py-3.5 text-xs sm:px-5">
              <div className="flex items-center gap-2 text-[#768198]">
                <span className="h-2 w-2 rounded-full bg-[#315ce8]"></span>
                {pending ? `Selected pixel · ${pending.x}, ${pending.y}` : "No point selected yet"}
              </div>
              <p className="text-[#9aa3b5]">Coordinates are image pixels, not walking distance.</p>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="studio-card rounded-[22px] p-5 studio-enter" style={{ animationDelay: ".06s" }}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#315ce8] text-lg text-white shadow-lg shadow-blue-200">⌖</div>
                <div>
                  <p className="text-base font-bold">Pin a location</p>
                  <p className="mt-1 text-xs text-[#8993a8]">Record a verified map point</p>
                </div>
              </div>

              <div className="mb-4 rounded-2xl border border-[#dce5ff] bg-[#f2f5ff] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#7385bd]">Selected coordinates</p>
                <p className="mt-2 font-mono text-xl font-bold tracking-tight text-[#3158ce]">
                  {pending ? `${pending.x} , ${pending.y}` : "— , —"}
                </p>
                <p className="mt-1 text-xs text-[#8491b6]">{pending ? "Ready to label this point" : "Click anywhere on the map first"}</p>
              </div>

              <div className="mb-4 rounded-xl border border-[#dce5ff] bg-[#f8faff] p-3">
                <p className="text-xs font-bold text-[#3158ce]">AUTOMATIC LOCATION QUEUE</p>
                <p className="mt-2 text-sm font-semibold">{nextLocation ? `Next: ${nextLocation.id}` : "All locations on this floor recorded"}</p>
                <p className="mt-1 text-xs text-[#8993a8]">{pendingLocations.length} locations remaining on this floor</p>
                <button type="button" onClick={() => { if (nextLocation) { setId(nextLocation.id); setName(nextLocation.name ?? nextLocation.id); } }} disabled={!nextLocation} className="studio-button mt-3 w-full rounded-lg bg-[#edf2ff] px-3 py-2 text-xs font-bold text-[#3158ce] disabled:opacity-40">
                  Use next location ID
                </button>
              </div>
              <label htmlFor="point-id" className="mb-2 block text-xs font-bold text-[#46536e]">LOCATION ID <span className="text-[#315ce8]">*</span></label>
              <input id="point-id" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. B018" className="studio-input mb-4 text-sm" />

              <label htmlFor="point-name" className="mb-2 block text-xs font-bold text-[#46536e]">DISPLAY NAME <span className="text-[#315ce8]">*</span></label>
              <input id="point-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Room B018" className="studio-input text-sm" />

              <button type="button" onClick={addPoint} className="studio-button mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#315ce8] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-[#244bd0]">
                <span className="text-lg">+</span> Add verified location
              </button>

              {message && <p role="status" className="mt-3 rounded-xl bg-[#f4f6fb] px-3 py-2.5 text-xs leading-5 text-[#5e6a82]">{message}</p>}
            </section>

            <section className="studio-card rounded-[22px] p-5 studio-enter" style={{ animationDelay: ".12s" }}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-bold">Your locations</p>
                  <p className="mt-1 text-xs text-[#8993a8]">Temporary collection</p>
                </div>
                <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-[#edf2ff] px-2 text-sm font-bold text-[#3158ce]">{points.length}</span>
              </div>

              {points.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#d9dfeb] bg-[#fafbfe] px-4 py-7 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf2ff] text-2xl text-[#5276e8]">⌖</div>
                  <p className="mt-3 text-sm font-bold text-[#46536e]">Your map starts here</p>
                  <p className="mx-auto mt-1 max-w-[220px] text-xs leading-5 text-[#929bb0]">Select a verified room or landmark to add your first point.</p>
                </div>
              ) : (
                <div className="max-h-64 space-y-2 overflow-auto">
                  {points.map((p, index) => (
                    <div key={p.id} className="flex items-center gap-3 rounded-xl border border-[#edf0f6] p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f4ff] text-xs font-bold text-[#3158ce]">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{p.id}</p>
                        <p className="truncate text-xs text-[#8993a8]">{p.name}</p>
                        <p className="mt-1 text-[10px] font-semibold text-[#6579b6]">{p.floor === undefined ? "Unassigned floor" : FLOOR_LABELS[p.floor]}</p>
                        <p className="mt-1 font-mono text-[10px] text-[#6579b6]">{p.x}, {p.y}</p>
                      </div>
                      <button type="button" title={`Remove ${p.id}`} onClick={() => setPoints((current) => current.filter((item) => item.id !== p.id))} className="studio-button rounded-lg px-2 py-1 text-sm text-[#9aa3b5] hover:bg-[#fff0f0] hover:text-[#d14b58]">×</button>
                    </div>
                  ))}
                </div>
              )}

              <button type="button" onClick={() => {
  const blob = new Blob([JSON.stringify(points, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kiit-map-coordinates-backup.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setMessage("JSON coordinate backup downloaded.");
}} disabled={points.length === 0} className="studio-button mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce3f2] bg-white px-4 py-3 text-sm font-bold text-[#3158ce] hover:bg-[#f4f6ff] disabled:cursor-not-allowed disabled:opacity-40">
  Download JSON backup
</button>
              <button type="button" onClick={copyCsv} disabled={points.length === 0} className="studio-button mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce3f2] bg-white px-4 py-3 text-sm font-bold text-[#3158ce] hover:bg-[#f4f6ff] disabled:cursor-not-allowed disabled:opacity-40">
                ↗ Export / Copy CSV
              </button>
              {points.length > 0 && (
                <textarea readOnly aria-label="Recorded coordinates as CSV" value={csv} onFocus={(e) => e.currentTarget.select()} className="mt-3 h-24 w-full rounded-xl border border-[#e2e7f0] bg-[#fafbfe] p-3 font-mono text-[10px] text-[#53617b]" />
              )}
            </section>

            <p className="px-2 text-center text-[11px] leading-5 text-[#9aa3b5]">
              Built for careful map calibration. Nothing is sent to your backend or saved automatically.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
