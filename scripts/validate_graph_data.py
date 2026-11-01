#!/usr/bin/env python3
import json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
L = json.loads((ROOT / 'data/locations.json').read_text(encoding='utf-8'))
E = json.loads((ROOT / 'data/edges.json').read_text(encoding='utf-8'))
F = json.loads((ROOT / 'data/floors.json').read_text(encoding='utf-8'))
errors=[]; warnings=[]
ids=[x.get('id') for x in L]
if len(ids)!=len(set(ids)): errors.append('duplicate location IDs')
by={x['id']:x for x in L}
for i,e in enumerate(E):
 if e.get('from') not in by or e.get('to') not in by: errors.append(f'edge {i}: endpoint missing: {e}')
 if not isinstance(e.get('weight'),int) or isinstance(e.get('weight'),bool) or e['weight']<=0: errors.append(f'edge {i}: weight must be positive integer')
 if e.get('type') not in ('horizontal','stair'): errors.append(f'edge {i}: invalid type')
 if e.get('type')=='stair':
  if e['weight']!=26: errors.append(f'edge {i}: stair weight is not 26')
  a,b=by.get(e['from']),by.get(e['to'])
  if a and b and (a.get('type')!='stair_access' or b.get('type')!='stair_access' or a.get('block')!=b.get('block') or abs(a.get('floor',-99)-b.get('floor',-99))!=1): errors.append(f'edge {i}: invalid staircase endpoint/floor pair')
  if a and b and (a['id'].rsplit('_F',1)[0]!=b['id'].rsplit('_F',1)[0]): errors.append(f'edge {i}: staircase identity mismatch')
 if e.get('type')=='stair' and (by.get(e['from'],{}).get('type')=='lift_metadata' or by.get(e['to'],{}).get('type')=='lift_metadata'): errors.append(f'edge {i}: lift cannot be stair connector')
keys=[(e.get('from'),e.get('to'),e.get('type')) for e in E]
if len(keys)!=len(set(keys)): errors.append('duplicate directed edges')
keyset=set(keys)
for e in E:
 if (e['to'],e['from'],e['type']) in keyset: errors.append(f'duplicate reverse edge pair: {e["from"]}<->{e["to"]}')
mir={(x['from'],x['to'],x['weight']) for x in F.get('connectors',[])}
expected={(e['from'],e['to'],e['weight']) for e in E if e['type']=='stair'}
if mir!=expected: errors.append('floors.json connectors do not exactly mirror staircase edges')
if F.get('stairCost')!=26: errors.append('floors.json stairCost must be 26')
print(f'Locations: {len(L)} | Edges: {len(E)} | Stair connectors: {len(expected)}')
print(f'Blocks: {", ".join(sorted({x.get("block", "?") for x in L}))}')
if errors:
 print('FAIL'); [print(' - '+x) for x in errors]; sys.exit(1)
print('PASS: structural graph validation')
print('NOTE: horizontal edges are interpreted bidirectionally by the graph loader; floors.json connectors are metadata mirrors only.')
