# Southern Cross (Book 4) Module

## Scope

This module extends the base Book 1 flow with Southern Cross-specific rules:

- Faction `southern_cross`
- Army selection (15 armies)
- OCC -> MOS -> Other skills pipeline
- Skill duplication guards between OCC, MOS and Other
- MOS bonus applied only to MOS-selected skills
- Mecha filtering by OCC role (`ATAC` / `TASC`)

## Data Sources

- `src/data/southern_cross/armies.json`
- `src/data/southern_cross/occs.json`
- `src/data/southern_cross/mos.json`
- `src/data/southern_cross/skills.json`

## State Extensions

- `moduleId`: `macross_book1` | `southern_cross_book4`
- `southernCross`:
  - `armyId`, `armyName`
  - `mosId`, `mosName`
  - `mosBonusPercent`
  - `mosSkills[]`

## Selection Engines

- `Book1SkillSelectionEngine`
- `SouthernCrossSkillSelectionEngine`

The Southern Cross engine deduplicates skills and keeps only the highest bonus when a skill appears in multiple sources.

## Flow Changes

- If `moduleId === southern_cross_book4`:
  - Faction -> Army -> Attributes -> Vitality -> OCC -> MOS -> Skills -> Equipment -> Mecha -> Alignment -> Summary
- Else:
  - Original flow without Army/MOS pages

## Rules Enforced

1. MOS bonus applies only to MOS skills.
2. Other skills cannot duplicate OCC or MOS picks.
3. If OCC and MOS share a skill, keep a single row and apply the higher bonus.
4. Southern Cross mecha list is filtered by OCC role (`ATAC` => veritech, `TASC` => destroid).
