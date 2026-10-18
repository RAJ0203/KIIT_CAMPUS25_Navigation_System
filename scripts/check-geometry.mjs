// Quick checks for routeGeometry. Run: node scripts/check-geometry.mjs
import assert from "node:assert/strict";
import { buildRouteGeometry } from "../src/lib/routeGeometry.ts";
import { MOCK_LOCATIONS, getMockRoute } from "../src/mocks/mockCampus.ts";

// 1. Same-floor mock route keeps order and forms one segment.
const same = getMockRoute({ source: "B018", destination: "B020" });
let g = buildRouteGeometry(same.path, MOCK_LOCATIONS);
assert.equal(g.ok, true);
assert.deepEqual(g.nodes.map((n) => n.id), same.path);
assert.equal(g.segments.length, 1);
assert.equal(g.segments[0].floor, 0);
assert.equal(g.floorTransitions.length, 0);
assert.equal(g.blockTransitions.length, 0);

// 2. Cross-floor mock route splits at the staircase.
const cross = getMockRoute({ source: "C001", destination: "C101" });
g = buildRouteGeometry(cross.path, MOCK_LOCATIONS);
assert.equal(g.ok, true);
assert.deepEqual(
  g.segments.map((s) => [s.floor, s.nodes.map((n) => n.id)]),
  [
    [0, ["C001", "STAIR_C_F0"]],
    [1, ["STAIR_C_F1", "C101"]],
  ]
);
assert.deepEqual(g.floorTransitions, [
  { fromId: "STAIR_C_F0", toId: "STAIR_C_F1", fromFloor: 0, toFloor: 1 },
]);

// 3. An unknown ID is reported, never guessed.
g = buildRouteGeometry(["B018", "ZZZ"], MOCK_LOCATIONS);
assert.equal(g.ok, false);
assert.deepEqual(g.unknownIds, ["ZZZ"]);

// 4. A same-node route (one ID) gives one segment with one node.
g = buildRouteGeometry(["B018"], MOCK_LOCATIONS);
assert.equal(g.ok, true);
assert.equal(g.segments.length, 1);
assert.equal(g.segments[0].nodes.length, 1);

// 5. Block change. TEST FIXTURE ONLY - these two nodes are not campus data.
const fixture = [
  { id: "T1", name: "t1", block: "A", floor: 0, x: 0, y: 0 },
  { id: "T2", name: "t2", block: "B", floor: 0, x: 1, y: 1 },
];
g = buildRouteGeometry(["T1", "T2"], fixture);
assert.deepEqual(g.blockTransitions, [
  { fromId: "T1", toId: "T2", fromBlock: "A", toBlock: "B" },
]);

console.log("ALL CHECKS PASSED");