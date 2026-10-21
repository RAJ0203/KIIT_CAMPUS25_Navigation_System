import type { Location } from "@/types/campus";

// PROVISIONAL canvas size. Confirm the real coordinate space with Kushagra.
export const MAP_VIEWBOX = { width: 700, height: 450 };

interface CampusMapSvgProps {
  locations: Location[];
  floor: number;
  routePath?: string[];
}

export default function CampusMapSvg({
  locations,
  floor,
  routePath = [],
}: CampusMapSvgProps) {
  const nodes = locations.filter((loc) => loc.floor === floor);
  const routeIds = new Set(routePath);
  const hasRoute = routePath.length > 0;

  return (
    <svg
      viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
      role="img"
      aria-label={`Campus map, floor ${floor}`}
      className="h-auto w-full rounded-lg border border-white/10 bg-[#0b1120]"
    >
      {!nodes.length && (
        <text
          x={MAP_VIEWBOX.width / 2}
          y={MAP_VIEWBOX.height / 2}
          textAnchor="middle"
          className="fill-slate-400 text-sm"
        >
          No locations available on this floor
        </text>
      )}

      {nodes.map((node) => {
        const isOnRoute = routeIds.has(node.id);
        const isStart = hasRoute && routePath[0] === node.id;
        const isEnd =
          hasRoute && routePath[routePath.length - 1] === node.id;

        return (
          <g key={node.id} data-node-id={node.id}>
            {isOnRoute && (
              <circle
                cx={node.x}
                cy={node.y}
                r={12}
                fill={isStart ? "#5ed6b0" : isEnd ? "#ffbd69" : "#8ba4ff"}
                opacity={0.16}
              />
            )}

            <circle
              cx={node.x}
              cy={node.y}
              r={isOnRoute ? 7 : 5}
              fill={
                isStart
                  ? "#5ed6b0"
                  : isEnd
                    ? "#ffbd69"
                    : isOnRoute
                      ? "#8ba4ff"
                      : "#64748b"
              }
              stroke={isOnRoute ? "#e2e8f0" : "#94a3b8"}
              strokeWidth={isOnRoute ? 1.5 : 0.75}
            />

            <text
              x={node.x}
              y={node.y - 13}
              textAnchor="middle"
              fontSize={12}
              fill={isOnRoute ? "#e2e8f0" : "#94a3b8"}
            >
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
