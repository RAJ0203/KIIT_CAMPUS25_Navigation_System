# Data Schema

This document clarifies project-specific conventions for the canonical data files. It supplements, and does not replace, the canonical data-file contract in the Master Team Coordination Document.

## `data/locations.json`

Each location record uses the required canonical fields:

- `id`
- `name`
- `block`
- `floor`
- `x`
- `y`
- `type`

`x` and `y` are numeric SVG coordinates when established by a reliable source. When a reliable coordinate has not been established, the value is JSON `null`. Coordinates must not be fabricated or represented with placeholder numbers.

An optional `metadata` object may preserve source and verification information, including:

- `status`: `source-confirmed`, `provisional-transcription`, or `unresolved`
- `source`: inspected source filename and page or section reference
- `source_section`: separate section, table, or page reference when `source` is a filename
- `notes`: concise provenance or reconciliation notes

These are project-specific metadata conventions. They are not claimed to have been specified by the original Master Team Coordination Document. They do not introduce undocumented required top-level fields or conflict with the canonical location fields.

Source confidence must be preserved. Source-confirmed records must not be silently represented as provisional, and provisional or unresolved records must not be silently represented as verified. Unresolved physical placeholders are excluded from canonical location data until their identity is established. Provisional records may be retained only when their status is explicit in `metadata`.

Room IDs preserve the source room label, such as `A001`, `B018`, or `C203`. Lift metadata records preserve the source lift label and are not graph connectors. Corridor junctions, staircase access points, and entrances require a source-supported stable ID before they can be accepted as canonical locations.

No edge weights, graph connections, or Dijkstra state belong in `locations.json`.
