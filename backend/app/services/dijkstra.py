
import heapq
from math import inf
from typing import Hashable


Node = Hashable
Graph = dict[Node, list[tuple[Node, float | int]]]


def dijkstra(
    graph: Graph,
    source: Node,
    destination: Node,
) -> tuple[float | int, list[Node]]:
    """
    Find the shortest path between source and destination.

    Args:
        graph: Weighted adjacency list.
               Example: {"A": [("B", 4), ("C", 2)]}
        source: Starting node.
        destination: Target node.

    Returns:
        A tuple containing:
        - Total shortest-path distance.
        - Ordered list of nodes along the path.

    Raises:
        ValueError: If the source or destination is missing,
                    or if an edge has a negative weight.
    """

    if source not in graph:
        raise ValueError(f"Source node '{source}' does not exist.")

    if destination not in graph:
        raise ValueError(f"Destination node '{destination}' does not exist.")

    # Validate the edge weights before running Dijkstra.
    for node, neighbours in graph.items():
        for neighbour, weight in neighbours:
            if neighbour not in graph:
                raise ValueError(
                    f"Node '{node}' references unknown neighbour '{neighbour}'."
                )

            if weight < 0:
                raise ValueError(
                    f"Negative edge weight detected: {node} -> {neighbour}."
                )

    # Initially, every node is unreachable.
    distance: dict[Node, float | int] = {
        node: inf for node in graph
    }

    # Store the previous node for path reconstruction.
    predecessor: dict[Node, Node | None] = {
        node: None for node in graph
    }

    distance[source] = 0

    # Min-priority queue: (distance, node).
    priority_queue: list[tuple[float | int, Node]] = [
        (0, source)
    ]

    while priority_queue:
        current_distance, current_node = heapq.heappop(priority_queue)

        # Ignore outdated queue entries.
        if current_distance != distance[current_node]:
            continue

        # The shortest distance to the destination is now finalized.
        if current_node == destination:
            break

        # Examine every outgoing edge.
        for neighbour, weight in graph[current_node]:
            new_distance = current_distance + weight

            # Relax the edge if a shorter path is found.
            if new_distance < distance[neighbour]:
                distance[neighbour] = new_distance
                predecessor[neighbour] = current_node

                heapq.heappush(
                    priority_queue,
                    (new_distance, neighbour),
                )

    # No path exists.
    if distance[destination] == inf:
        return inf, []

    # Reconstruct the path backwards from the destination.
    path: list[Node] = []
    current_node: Node | None = destination

    while current_node is not None:
        path.append(current_node)
        current_node = predecessor[current_node]

    path.reverse()

    return distance[destination], path
