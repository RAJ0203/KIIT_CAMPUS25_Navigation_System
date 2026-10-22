"use client";

import type { Location } from "@/types/campus";
import { buildRouteGeometry } from "@/lib/routeGeometry";
import { motion, useReducedMotion } from "framer-motion";

export const MAP_VIEWBOX = { width: 700, height: 450 };

interface CampusMapSvgProps {
  locations: Location[];
  floor: number;
  routePath?: string[];
  playKey?: number;
}

export default function CampusMapSvg({
  locations,
  floor,
  routePath = [],
  playKey = 0,
}: CampusMapSvgProps) {
  const nodes = locations.filter((loc) => loc.floor === floor);
  const routeIds = new Set(routePath);
  const hasRoute = routePath.length > 0;
  const reduceMotion = useReducedMotion();

  // Visualize the canonical route; never calculate a new route here.
  const geometry = hasRoute ? buildRouteGeometry(routePath, locations) : null;
  const floorSegments =
    geometry && geometry.ok
      ? geometry.segments.filter((segment) => segment.floor === floor)
      : [];

  const walkSegment = floorSegments.find((segment) => segment.nodes.length > 1);
  const walkX = walkSegment ? walkSegment.nodes.map((node) => node.x) : [];
  const walkY = walkSegment ? walkSegment.nodes.map((node) => node.y) : [];

  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
      role="img"
      aria-label={`Campus map, floor ${floor}`}
      className="h-auto w-full rounded-xl border border-sky-300/20 bg-[#071326] shadow-[0_0_45px_rgba(14,165,233,0.10)]"
    >
      <defs>
        <linearGradient id="campus-map-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b1b34" />
          <stop offset="55%" stopColor="#071326" />
          <stop offset="100%" stopColor="#101a36" />
        </linearGradient>

        <linearGradient id="campus-route-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>

        <pattern
          id="campus-map-grid"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 28 0 L 0 0 0 28"
            fill="none"
            stroke="#60a5fa"
            strokeOpacity="0.10"
            strokeWidth="0.7"
          />
          <circle cx="0" cy="0" r="1" fill="#7dd3fc" fillOpacity="0.22" />
        </pattern>

        <filter id="campus-blue-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="campus-soft-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Atmospheric background */}
      <rect width="700" height="450" fill="url(#campus-map-bg)" />
      <rect width="700" height="450" fill="url(#campus-map-grid)" />

      <circle cx="610" cy="85" r="130" fill="#2563eb" opacity="0.055" />
      <circle cx="105" cy="375" r="150" fill="#06b6d4" opacity="0.045" />

      {/* Decorative map frame */}
      <path
        d="M 20 48 V 20 H 48 M 652 20 H 680 V 48 M 20 402 V 430 H 48 M 652 430 H 680 V 402"
        fill="none"
        stroke="#7dd3fc"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />

      <g opacity="0.8">
        <text x="30" y="40" fontSize="10" letterSpacing="2.5" fill="#7dd3fc">
          CAMPUS GRID
        </text>
        <text
          x="670"
          y="40"
          textAnchor="end"
          fontSize="10"
          letterSpacing="1.5"
          fill="#64748b"
        >
          FLOOR {floor}
        </text>
      </g>

      {!nodes.length && (
        <g>
          <circle
            cx="350"
            cy="215"
            r="34"
            fill="#0e7490"
            fillOpacity="0.12"
            stroke="#38bdf8"
            strokeOpacity="0.35"
          />
          <text
            x="350"
            y="211"
            textAnchor="middle"
            fontSize="13"
            fill="#bae6fd"
          >
            No locations
          </text>
          <text
            x="350"
            y="230"
            textAnchor="middle"
            fontSize="11"
            fill="#64748b"
          >
            available on this floor
          </text>
        </g>
      )}

      {/* Route underglow layer */}
      {floorSegments.map(
        (segment, index) =>
          segment.nodes.length > 1 && (
            <polyline
              key={`route-glow-${index}`}
              points={segment.nodes.map((node) => `${node.x},${node.y}`).join(" ")}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="17"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.16"
              filter="url(#campus-blue-glow)"
            />
          )
      )}

      {/* Bright route core */}
      {floorSegments.map(
        (segment, index) =>
          segment.nodes.length > 1 && (
            <g key={`route-core-${index}`}>
              <polyline
                points={segment.nodes.map((node) => `${node.x},${node.y}`).join(" ")}
                fill="none"
                stroke="url(#campus-route-gradient)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
              />
              <motion.polyline
                points={segment.nodes.map((node) => `${node.x},${node.y}`).join(" ")}
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="3 15"
                initial={{ strokeDashoffset: 0 }}
                animate={reduceMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: -36 }}
                transition={{
                  duration: 1.4,
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: "linear",
                }}
              />
            </g>
          )
      )}

      {/* Locations */}
      {nodes.map((node) => {
        const isOnRoute = routeIds.has(node.id);
        const isStart = hasRoute && routePath[0] === node.id;
        const isEnd = hasRoute && routePath[routePath.length - 1] === node.id;
        const isStair = node.id.toUpperCase().includes("STAIR");
        const nodeColor = isStart
          ? "#34d399"
          : isEnd
            ? "#fb923c"
            : isOnRoute
              ? "#38bdf8"
              : "#64748b";

        return (
          <g key={node.id} data-node-id={node.id}>
            {/* Ambient halo */}
            {isOnRoute && (
              <circle
                cx={node.x}
                cy={node.y}
                r={isStart || isEnd ? 21 : 15}
                fill={nodeColor}
                opacity="0.13"
                filter="url(#campus-soft-glow)"
              />
            )}

            {/* Start/end pulse */}
            {(isStart || isEnd) && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                fill="none"
                stroke={nodeColor}
                strokeWidth="1.5"
                initial={{ r: 11, opacity: 0.8 }}
                animate={
                  reduceMotion
                    ? { r: 11, opacity: 0.8 }
                    : { r: [11, 23], opacity: [0.8, 0] }
                }
                transition={{
                  duration: 1.8,
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: "easeOut",
                }}
              />
            )}

            {/* Staircase diamonds; circular room markers */}
            {isStair ? (
              <g transform={`translate(${node.x} ${node.y}) rotate(45)`}>
                <rect
                  x="-7"
                  y="-7"
                  width="14"
                  height="14"
                  rx="2"
                  fill={isOnRoute ? "#0e7490" : "#172554"}
                  stroke={nodeColor}
                  strokeWidth={isOnRoute ? 2 : 1.2}
                  filter={isOnRoute ? "url(#campus-soft-glow)" : undefined}
                />
              </g>
            ) : (
              <circle
                cx={node.x}
                cy={node.y}
                r={isStart || isEnd ? 8 : isOnRoute ? 6.5 : 4.5}
                fill={isOnRoute ? nodeColor : "#1e293b"}
                stroke={isOnRoute ? "#e0f2fe" : "#64748b"}
                strokeWidth={isOnRoute ? 1.7 : 1}
                filter={isOnRoute ? "url(#campus-soft-glow)" : undefined}
              />
            )}

            {/* Node label */}
            <text
              x={node.x}
              y={node.y - 15}
              textAnchor="middle"
              fontSize={isStart || isEnd ? 12 : 10.5}
              fontWeight={isOnRoute ? 700 : 500}
              fill={isOnRoute ? "#e0f2fe" : "#94a3b8"}
              stroke="#071326"
              strokeWidth="3"
              paintOrder="stroke"
              strokeLinejoin="round"
            >
              {node.id}
            </text>

            {(isStart || isEnd) && (
              <text
                x={node.x}
                y={node.y + 25}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                letterSpacing="1.2"
                fill={nodeColor}
              >
                {isStart ? "START" : "DESTINATION"}
              </text>
            )}
          </g>
        );
      })}

      {/* Walking indicator follows the first drawn segment in path order */}
      {walkSegment && (
        <g>
          <motion.circle
            key={`walk-halo-${playKey}-${floor}`}
            r="13"
            fill="#38bdf8"
            opacity="0.18"
            initial={{ cx: walkX[0], cy: walkY[0] }}
            animate={
              reduceMotion
                ? { cx: walkX[walkX.length - 1], cy: walkY[walkY.length - 1] }
                : { cx: walkX, cy: walkY }
            }
            transition={{
              duration: reduceMotion ? 0 : Math.max(0.9, (walkX.length - 1) * 0.9),
              ease: "linear",
            }}
          />
          <motion.circle
            key={`walk-core-${playKey}-${floor}`}
            r="5.5"
            fill="#ffffff"
            stroke="#38bdf8"
            strokeWidth="2.5"
            filter="url(#campus-blue-glow)"
            initial={{ cx: walkX[0], cy: walkY[0] }}
            animate={
              reduceMotion
                ? { cx: walkX[walkX.length - 1], cy: walkY[walkY.length - 1] }
                : { cx: walkX, cy: walkY }
            }
            transition={{
              duration: reduceMotion ? 0 : Math.max(0.9, (walkX.length - 1) * 0.9),
              ease: "linear",
            }}
          />
        </g>
      )}

      {/* Legend */}
      <g transform="translate(28 408)">
        <circle cx="4" cy="0" r="4" fill="#34d399" />
        <text x="13" y="3.5" fontSize="9" fill="#94a3b8">START</text>

        <circle cx="83" cy="0" r="4" fill="#fb923c" />
        <text x="92" y="3.5" fontSize="9" fill="#94a3b8">DESTINATION</text>

        <rect
          x="190"
          y="-4"
          width="8"
          height="8"
          rx="1"
          fill="#38bdf8"
          transform="rotate(45 194 0)"
        />
        <text x="205" y="3.5" fontSize="9" fill="#94a3b8">STAIRCASE</text>
      </g>

      <text
        x="670"
        y="429"
        textAnchor="end"
        fontSize="9"
        letterSpacing="1"
        fill="#64748b"
      >
        SCHEMATIC · NOT TO SCALE
      </text>
    </svg>
  );
}
