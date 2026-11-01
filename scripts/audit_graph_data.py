#!/usr/bin/env python3
"""Structural and connectivity audit for the canonical campus graph.

Run from repository root: python scripts/audit_graph_data.py
Horizontal lift access is included as a same-floor landmark only. Lift nodes
are never connected vertically. This script does not invent edges.
"""
from __future__ import annotations
import json
from collections import Counter, defaultdict
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'data'

def load(name):
    with (DATA/name).open(encoding='utf-8') as f: return json.load(f)

def main():
    try:
        locations=load('locations.json'); edges=load('edges.json'); floors=load('floors.json')
    except Exception as exc:
        print(f'FAIL: cannot load graph data: {exc}'); return 2
    by={n['id']:n for n in locations}
    adj={node_id:set() for node_id in by}
    errors=[]; exact=Counter(); undirected=Counter(); types=Counter()
    for i,e in enumerate(edges):
        a,b=e.get('from'),e.get('to'); typ=e.get('type'); types[typ]+=1
        exact[(a,b,typ,e.get('weight'))]+=1
        undirected[(frozenset((a,b)),typ)]+=1
        if a not in by or b not in by:
            errors.append(f'edge[{i}] unknown endpoint: {a!r} -> {b!r}'); continue
        if typ=='stair' and (by[a].get('type')=='lift_metadata' or by[b].get('type')=='lift_metadata'):
            errors.append(f'edge[{i}] incorrectly uses a lift as a vertical connector')
        if typ not in ('horizontal','stair'):
            errors.append(f'edge[{i}] invalid type {typ!r}')
        # Both horizontal and staircase edges are traversable bidirectionally.
        # Lift nodes can be vertices only through measured horizontal edges.
        adj[a].add(b); adj[b].add(a)
    exact_dups=sum(v-1 for v in exact.values() if v>1)
    undirected_dups=sum(v-1 for v in undirected.values() if v>1)
    if exact_dups: errors.append(f'{exact_dups} exact duplicate edge records')
    if undirected_dups: errors.append(f'{undirected_dups} duplicate undirected same-type edge records')
    seen=set(); comps=[]
    for node_id in adj:
        if node_id in seen: continue
        stack=[node_id]; seen.add(node_id); comp=[]
        while stack:
            u=stack.pop(); comp.append(u)
            for v in adj[u]:
                if v not in seen: seen.add(v); stack.append(v)
        comps.append(comp)
    comps.sort(key=len,reverse=True)
    isolated=[n for n,neighbors in adj.items() if not neighbors]
    lift_connected=[n for n in by if by[n].get('type')=='lift_metadata' and adj[n]]
    print(f'Locations: {len(locations)} | Edges: {len(edges)} | Stair connectors: {sum(1 for e in edges if e.get("type")=="stair")}')
    print(f'Edge types: {dict(types)}')
    print(f'Connected components (all nodes; lifts only via horizontal edges): {len(comps)}')
    print(f'Largest components: {[len(c) for c in comps[:10]]}')
    print(f'Isolated nodes: {len(isolated)}')
    print(f'Lift metadata nodes with measured horizontal access: {len(lift_connected)}')
    print(f'Exact duplicate edges: {exact_dups} | Duplicate undirected same-type edges: {undirected_dups}')
    print(f'Unknown/invalid edge errors: {len(errors)}')
    for i,comp in enumerate(comps[:10],1):
        blocks=sorted({by[n].get('block','?') for n in comp})
        print(f'COMPONENT {i}: size={len(comp)} blocks={blocks}')
    if isolated:
        print('Isolated nodes (review; not automatically defects):')
        for node_id in isolated:
            n=by[node_id]
            print(f' - {node_id} | {n.get("type")} | {n.get("block")} F{n.get("floor")}')
    if errors:
        print('AUDIT RESULT: FAIL'); [print(' - '+e) for e in errors]; return 1
    print('AUDIT RESULT: PASS (structural references/duplicates/lift vertical policy)')
    print('Connectivity is descriptive: isolated nodes/components require source review, not invented edges.')
    return 0
if __name__=='__main__': raise SystemExit(main())
