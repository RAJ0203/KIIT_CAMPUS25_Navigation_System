
"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Location } from "@/types/campus";
import { buildRouteGeometry } from "@/lib/routeGeometry";
import { FLOOR_PLANS } from "@/data/floorPlans";


export const MAP_VIEWBOX = { width: 700, height: 450 };

interface CampusMapSvgProps {
  locations: Location[];
  floor: number;
  routePath?: string[];
  playKey?: number;
}

function isValidCoordinate(
  location: Location
): location is Location & { x: number; y: number } {
  const plan = FLOOR_PLANS[location.floor];
  const maxWidth = plan?.width ?? MAP_VIEWBOX.width;
  const maxHeight = plan?.height ?? MAP_VIEWBOX.height;

  return (
    location.x !== null &&
    location.y !== null &&
    Number.isFinite(location.x) &&
    Number.isFinite(location.y) &&
    location.x >= 0 &&
    location.x <= maxWidth &&
    location.y >= 0 &&
    location.y <= maxHeight
  );
}

export default function CampusMapSvg({
  locations,
  floor,
  routePath = [],
  playKey = 0,
}: CampusMapSvgProps) {
  const id = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();

  const backgroundId = `${id}-background`;
  const gridId = `${id}-grid`;
  const routeGradientId = `${id}-route-gradient`;
  const glowId = `${id}-glow`;

  // Keep marker positions sourced from the API/mock data.
  // Visual pixel-coordinate overrides are disabled until alignment is verified.
  const renderLocations = locations;

  const nodes = renderLocations.filter((node) => node.floor === floor);
  const routeIds = new Set(routePath);
  const hasRoute = routePath.length > 0;
  const geometry = hasRoute ? buildRouteGeometry(routePath, renderLocations) : null;
  const validGeometry = geometry !== null && geometry.ok ? geometry : null;
  const unknownRouteIds =
    geometry !== null && !geometry.ok ? geometry.unknownIds : [];
  const routeNodes = validGeometry?.nodes ?? [];

  const safePosition = Number.isFinite(playKey) ? playKey : 0;
  const boundedPosition = Math.max(
    0,
    Math.min(safePosition, Math.max(0, routeNodes.length - 1)),
  );

  const currentRouteIndex = Math.floor(boundedPosition);
  const segmentProgress = boundedPosition - currentRouteIndex;
  const currentNode = routeNodes[currentRouteIndex];
  const nextNode = routeNodes[currentRouteIndex + 1];

  const routeHasInvalidCoordinates = routeNodes.some(
    (node) => !isValidCoordinate(node),
  );

  const visibleRouteIsComplete =
    validGeometry !== null && !routeHasInvalidCoordinates;

  const drawableNodes = nodes.filter(isValidCoordinate);

  const drawableRouteSegments =
    validGeometry?.segments
      .filter((segment) => segment.floor === floor)
      .map((segment) => ({
        ...segment,
        nodes: segment.nodes.filter(isValidCoordinate),
      })) ?? [];

  const previousNode =
    currentRouteIndex > 0 ? routeNodes[currentRouteIndex - 1] : undefined;

  const floorTransitionAtCurrentStep =
    previousNode !== undefined &&
    currentNode !== undefined &&
    previousNode.floor !== currentNode.floor;

  const canInterpolate =
    currentNode !== undefined &&
    nextNode !== undefined &&
    currentNode.floor === floor &&
    nextNode.floor === floor &&
    isValidCoordinate(currentNode) &&
    isValidCoordinate(nextNode);

  const markerX =
    currentNode && canInterpolate && nextNode
      ? currentNode.x +
        (nextNode.x - currentNode.x) * segmentProgress
      : currentNode?.x ?? 0;

  const markerY =
    currentNode && canInterpolate && nextNode
      ? currentNode.y +
        (nextNode.y - currentNode.y) * segmentProgress
      : currentNode?.y ?? 0;

  const markerVisible =
    hasRoute &&
    currentNode !== undefined &&
    currentNode.floor === floor &&
    isValidCoordinate(currentNode);

  const floorPlan = FLOOR_PLANS[floor];
  const sourceWidth = floorPlan?.width ?? MAP_VIEWBOX.width;
  const sourceHeight = floorPlan?.height ?? MAP_VIEWBOX.height;

  const mapScale = Math.min(
    MAP_VIEWBOX.width / sourceWidth,
    MAP_VIEWBOX.height / sourceHeight,
  );

  const renderedWidth = sourceWidth * mapScale;
  const renderedHeight = sourceHeight * mapScale;
  const mapOffsetX = (MAP_VIEWBOX.width - renderedWidth) / 2;
  const mapOffsetY = (MAP_VIEWBOX.height - renderedHeight) / 2;

  const mapX = (x: number) =>
    mapOffsetX + (x / sourceWidth) * renderedWidth;

  const mapY = (y: number) =>
    mapOffsetY + (y / sourceHeight) * renderedHeight;

  const mapPoint = (node: Location & { x: number; y: number }) =>
    `${mapX(node.x)},${mapY(node.y)}`;

  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
      role="img"
      aria-label={`Campus reference map, floor ${floor}`}
      className="h-auto w-full rounded-xl border border-slate-200 bg-[#F8FAFC] shadow-sm"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={backgroundId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>

        <linearGradient id={routeGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>

        <pattern
          id={gridId}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 28 0 L 0 0 0 28"
            fill="none"
            stroke="#94A3B8"
            strokeOpacity="0.12"
            strokeWidth="0.7"
          />
          <circle
            cx="0"
            cy="0"
            r="1"
            fill="#64748B"
            fillOpacity="0.22"
          />
        </pattern>

        <filter
          id={glowId}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        width={MAP_VIEWBOX.width}
        height={MAP_VIEWBOX.height}
        fill={`url(#${backgroundId})`}
      />

      {floorPlan ? (
        <image
          href={floorPlan.src}
          x={mapOffsetX}
          y={mapOffsetY}
          width={renderedWidth}
          height={renderedHeight}
          preserveAspectRatio="none"
        />
      ) : (
        <rect
          width={MAP_VIEWBOX.width}
          height={MAP_VIEWBOX.height}
          fill={`url(#${gridId})`}
        />
      )}

      <circle cx="610" cy="85" r="130" fill="#E2E8F0" opacity="0.055" />
      <circle cx="105" cy="375" r="150" fill="#E2E8F0" opacity="0.045" />

      <path
        d="M 20 48 V 20 H 48 M 652 20 H 680 V 48 M 20 402 V 430 H 48 M 652 430 H 680 V 402"
        fill="none"
        stroke="#64748B"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />

      <g opacity="0.85">
        <text
          x="30"
          y="40"
          fontSize="10"
          letterSpacing="2.5"
          fill="#64748B"
        >
          CAMPUS NAVIGATION
        </text>

        <text
          x="670"
          y="40"
          textAnchor="end"
          fontSize="10"
          letterSpacing="1.5"
          fill="#64748B"
        >
          FLOOR {floor}
        </text>
      </g>

      <g>
        <rect
          x="28"
          y="58"
          width="220"
          height="25"
          rx="12.5"
          fill="#FFF7ED"
          stroke="#FDBA74"
          strokeWidth="0.8"
        />

        <circle cx="42" cy="70.5" r="3.5" fill="#EA580C" />

        <text
          x="52"
          y="74"
          fontSize="9"
          fontWeight="600"
          fill="#9A3412"
        >
          REFERENCE MAP · ALIGNMENT PENDING
        </text>
      </g>

      {nodes.length === 0 && (
        <g>
          <circle
            cx="350"
            cy="215"
            r="34"
            fill="#DBEAFE"
            fillOpacity="0.35"
            stroke="#2563EB"
            strokeOpacity="0.35"
          />

          <text
            x="350"
            y="211"
            textAnchor="middle"
            fontSize="13"
            fill="#334155"
          >
            No locations
          </text>

          <text
            x="350"
            y="230"
            textAnchor="middle"
            fontSize="11"
            fill="#64748B"
          >
            available on this floor
          </text>
        </g>
      )}

      {hasRoute && geometry !== null && !geometry.ok && (
        <g>
          <rect
            x="75"
            y="175"
            width="550"
            height="86"
            rx="12"
            fill="#FFF7ED"
            stroke="#FDBA74"
          />

          <text
            x="350"
            y="200"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="#9A3412"
          >
            Route geometry unavailable
          </text>

          <text
            x="350"
            y="221"
            textAnchor="middle"
            fontSize="10"
            fill="#9A3412"
          >
            Some route IDs are missing from the location data.
          </text>

          <text
            x="350"
            y="240"
            textAnchor="middle"
            fontSize="9"
            fill="#9A3412"
          >
            {unknownRouteIds.slice(0, 5).join(", ")}
          </text>
        </g>
      )}

      {visibleRouteIsComplete &&
        drawableRouteSegments.map(
          (segment, index) =>
            segment.nodes.length > 1 && (
              <g key={`route-segment-${index}`}>
                <polyline
                  points={segment.nodes.map(mapPoint).join(" ")}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.12"
                />

                <polyline
                  points={segment.nodes.map(mapPoint).join(" ")}
                  fill="none"
                  stroke={`url(#${routeGradientId})`}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <motion.polyline
                  points={segment.nodes.map(mapPoint).join(" ")}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="3 15"
                  initial={{ strokeDashoffset: 0 }}
                  animate={
                    reduceMotion
                      ? { strokeDashoffset: 0 }
                      : { strokeDashoffset: -36 }
                  }
                  transition={{
                    duration: 1.4,
                    repeat: reduceMotion ? 0 : Infinity,
                    ease: "linear",
                  }}
                />
              </g>
            ),
        )}

      {drawableNodes.map((node) => {
        const x = mapX(node.x);
        const y = mapY(node.y);
        const isOnRoute = routeIds.has(node.id);
        const isStart = hasRoute && routePath[0] === node.id;
        const isEnd =
          hasRoute && routePath[routePath.length - 1] === node.id;

        const description = `${node.id} ${node.type ?? ""}`.toUpperCase();
        const isStairOrLift = /STAIR|LIFT|ELEVATOR/.test(description);

        const nodeColor = isStart
          ? "#34D399"
          : isEnd
            ? "#FB923C"
            : isOnRoute
              ? "#38BDF8"
              : "#64748B";

        return (
          <g key={node.id} data-node-id={node.id}>
            {isOnRoute && (
              <circle
                cx={x}
                cy={y}
                r={isStart || isEnd ? 21 : 15}
                fill={nodeColor}
                opacity="0.13"
              />
            )}

            {(isStart || isEnd) && (
              <motion.circle
                cx={x}
                cy={y}
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

            {isStairOrLift ? (
              <g transform={`translate(${x} ${y}) rotate(45)`}>
                <rect
                  x="-7"
                  y="-7"
                  width="14"
                  height="14"
                  rx="2"
                  fill={isOnRoute ? "#0E7490" : "#172554"}
                  stroke={nodeColor}
                  strokeWidth={isOnRoute ? 2 : 1.2}
                  filter={isOnRoute ? `url(#${glowId})` : undefined}
                />
              </g>
            ) : (
              <circle
                cx={x}
                cy={y}
                r={isStart || isEnd ? 8 : isOnRoute ? 6.5 : 4.5}
                fill={isOnRoute ? nodeColor : "#FFFFFF"}
                stroke={isOnRoute ? "#1D4ED8" : "#94A3B8"}
                strokeWidth={isOnRoute ? 1.7 : 1}
                filter={isOnRoute ? `url(#${glowId})` : undefined}
              />
            )}

            <text
              x={x}
              y={y - 15}
              textAnchor="middle"
              fontSize={isStart || isEnd ? 12 : 10.5}
              fontWeight={isOnRoute ? 700 : 500}
              fill={isOnRoute ? "#075985" : "#475569"}
              stroke="#FFFFFF"
              strokeWidth="3"
              paintOrder="stroke"
              strokeLinejoin="round"
            >
              {node.id}
            </text>

            {(isStart || isEnd) && (
              <text
                x={x}
                y={y + 25}
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

      {/* Animated navigation marker: follows the returned route coordinates */}
      {markerVisible && currentNode && (
        <motion.g
          initial={false}
          animate={{
            x: mapX(markerX),
            y: mapY(markerY),
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.75,
            ease: "linear",
          }}
          data-active-waypoint={currentNode.id}
          aria-label={`Navigation position: ${currentNode.name}`}
        >
          {!reduceMotion && (
            <motion.circle
              cx="0"
              cy="0"
              r="15"
              fill="#2563EB"
              fillOpacity="0.12"
              animate={{
                scale: [0.9, 1.2, 0.9],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <circle
            cx="0"
            cy="0"
            r="9"
            fill="#2563EB"
            fillOpacity="0.16"
          />

          <circle
            cx="0"
            cy="0"
            r="5.5"
            fill="#FFFFFF"
            stroke="#1D4ED8"
            strokeWidth="2.5"
          />

          <circle cx="0" cy="0" r="2" fill="#2563EB" />
        </motion.g>
      )}

      {floorTransitionAtCurrentStep && (
        <g>
          <rect
            x="405"
            y="58"
            width="265"
            height="25"
            rx="12.5"
            fill="#EFF6FF"
            stroke="#93C5FD"
            strokeWidth="0.8"
          />

          <text
            x="537.5"
            y="74"
            textAnchor="middle"
            fontSize="9"
            fontWeight="600"
            fill="#1D4ED8"
          >
            FLOOR TRANSITION IN RETURNED PATH
          </text>
        </g>
      )}

      <g transform="translate(28 408)">
        <circle cx="4" cy="0" r="4" fill="#15803D" />
        <text x="13" y="3.5" fontSize="9" fill="#475569">
          START
        </text>

        <circle cx="83" cy="0" r="4" fill="#DC2626" />
        <text x="92" y="3.5" fontSize="9" fill="#475569">
          DESTINATION
        </text>

        <rect
          x="190"
          y="-4"
          width="8"
          height="8"
          rx="1"
          fill="#2563EB"
          transform="rotate(45 194 0)"
        />
        <text x="205" y="3.5" fontSize="9" fill="#475569">
          STAIRCASE / LIFT
        </text>
      </g>

      <text
        x="670"
        y="429"
        textAnchor="end"
        fontSize="9"
        letterSpacing="0.7"
        fill="#9A3412"
      >
        COORDINATES NOT YET VERIFIED
      </text>
    </svg>
  );
}
