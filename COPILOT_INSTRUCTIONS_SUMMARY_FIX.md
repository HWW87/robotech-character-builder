# Copilot Instructions (Robotech Character Builder)

## Goal
Fix Summary skill breakdown and ensure it matches Book 1 rules.

## Rules (must match)
- Skill total: total = base + oneTimeBonuses + per_level * (level - 1)
- At level 1, the growth term MUST be 0.
- Display formula must reflect (level - 1), not level.
- If a skill is missing from catalog, do NOT silently show base=0/per_level=0.
  - Show "Missing in catalog" tag OR log a dev warning.

## Summary UI requirements
- For each skill, show:
  - name, type (OCC/Other/Secondary if you keep it)
  - total %
  - breakdown: base + bonuses + (level-1)*per_level
- If per_level is null/undefined, omit that term from the breakdown.

## Data requirements
- Never resolve skills by display name inside UI components.
- Always resolve via SkillRepository / skill_id.

## Acceptance checks
- Level 1 must show: "lvl0*X"
- Level 3 must show: "lvl2*X"
- No "0% (base 0 + 0 + lvl0*0)" for real skills; missing skills are flagged.
