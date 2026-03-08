# Copilot Guidelines - Robotech Character Builder

## 🎯 Core Principles

### 1. **Prefer Deterministic IDs**
- Use branded types: `SkillId`, `OccId`, `MechaId`, `AlignmentId`
- All IDs follow pattern: `CATEGORY_NAME_v{version}` (e.g., `PILOT_PILOT_JET_v1`)
- IDs are immutable and unique across the entire system

```typescript
// ✅ CORRECT
const skillId: SkillId = createSkillId("PILOT_PILOT_JET_v1");
const skill = getSkillById(skillId);

// ❌ WRONG
const skill = allSkills.find(s => s.name === "Pilot Jet");
```

### 2. **Do Not Compare Skills by Display Name**
- Never use `if (skill.name_es === 'Pilot Jet')` for comparisons
- Always resolve names to IDs first using fuzzy matching
- Use the resolved ID for all further operations

```typescript
// ✅ CORRECT
const skillId = resolveSkillId("Pilot Jet"); // Handles typos, normalization
if (skillId) {
  const skill = getSkillById(skillId);
  // ... use skill object
}

// ❌ WRONG
if (skillName === name_es || skillName.includes(name_es)) {
  // ...
}
```

### 3. **Use resolveSkillId() + getSkillById() Pattern**
- **resolveSkillId()**: Convert human input or legacy data to SkillId
  - Handles fuzzy matching (typos, whitespace)
  - Works with both IDs and display names
  - Returns `null` if not found

- **getSkillById()**: Retrieve Skill object by typed ID
  - Safe, type-checked lookup
  - Returns `undefined` if not found
  - Preferred over direct Map access

```typescript
// Standard workflow
const skillId = resolveSkillId(userInput);
if (!skillId) {
  throw new Error(`Unknown skill: ${userInput}`);
}

const skill = getSkillById(skillId);
if (!skill) {
  // Should never happen if repositories are initialized
  throw new Error(`Invalid skill ID: ${skillId}`);
}

// Use skill object...
```

### 4. **Domain Layer Must Be Pure (No React Imports)**
- Domain files: `src/domain/**/*.ts` - NO React, NO hooks, NO side effects
- No dynamic imports from infrastructure layer
- Only use types and validation logic
- All functions must be deterministic

```typescript
// ✅ CORRECT - Pure domain logic
export function calculateSkillTotal(
  skill: Skill,
  occBonus: number,
  characterLevel: number
): SkillCalculationResult {
  const total = skill.base + occBonus + 
    (skill.perLevel * (characterLevel - 1));
  return { ...skill, total: Math.min(total, 98) };
}

// ❌ WRONG - React import in domain
import { useState } from 'react'; // FORBIDDEN
export function calculateSkills(...) { ... }

// ❌ WRONG - Side effects in domain
export function getSkill(id: string) {
  localStorage.setItem('debug', id); // FORBIDDEN
  return skillMap.get(id);
}
```

### 5. **Validate JSON Data via Zod Schemas Before Using**
- Always validate external data at entry points (repositories)
- Run validation ONCE at initialization, cache results
- Use Zod schemas defined in `src/domain/validation/schemas.ts`
- Never trust JSON data - validate before building domain objects

```typescript
// ✅ CORRECT - Validate at load time
class SkillRepository {
  private initialize(): void {
    const rawData = loadJSON('skills.json');
    
    // Validate with Zod FIRST
    const validated = validateSkills(rawData);
    
    // THEN build domain objects with type-safe data
    for (const skill of validated) {
      const domainSkill: Skill = {
        id: createSkillId(skill.id),
        name_es: skill.name_es,
        // ... trusted data
      };
      this.skillsById.set(domainSkill.id, domainSkill);
    }
  }
}

// ❌ WRONG - Using unvalidated data
const skills = JSON.parse(rawJSON);
for (const s of skills) {
  // Dangerous! s.base could be "foo"
  const total = s.base + bonus;
}
```

## 📦 Repository Pattern

All data access goes through repositories in `src/infrastructure/repositories/`:

```typescript
// In components/hooks
import { resolveSkillId, getSkillById } from '@/infrastructure/repositories/SkillRepository';
import { resolveOccId, getOccById } from '@/infrastructure/repositories/OccRepository';
import { resolveMechaId, getMechaById } from '@/infrastructure/repositories/MechaRepository';

// Use IDs everywhere
const character = {
  occId: resolveOccId("Veritech Pilot"),
  skills: [
    { skillId: resolveSkillId("Pilot Jet"), level: 10 },
    { skillId: resolveSkillId("Mecha Combat"), level: 8 },
  ],
  mechaId: resolveMechaId("VF-1S Veritech"),
};
```

## 🔍 File Organization

```
src/
├── domain/                 # Pure logic, no React, NO external dependencies
│   ├── skills/
│   │   ├── skill.ts       # Interfaces: Skill, SkillInstance
│   │   └── skill-id-generator.ts  # generateSkillId(), resolveSkillId()
│   ├── occ/
│   │   └── occ.ts         # Interfaces: OCC, OccSkillBonuses
│   ├── character/
│   │   └── skill-calculator.ts  # Pure calculations
│   ├── validation/
│   │   └── schemas.ts     # Zod schemas for all entities
│   └── shared/
│       └── types.ts       # Branded types
│
├── infrastructure/         # I/O, caching, validation
│   └── repositories/
│       ├── SkillRepository.ts    # Load, validate, cache skills
│       ├── OccRepository.ts      # Load, validate, cache OCCs
│       └── MechaRepository.ts    # Load, validate, cache Mechas
│
├── hooks/                 # React hooks (can use repositories)
│   └── useCharacterData.js
│
└── utils/                 # Legacy utilities (being refactored)
    ├── skillCalculator.js  # Now wraps domain logic
    ├── occRules.js         # Now delegates to repositories
    └── mechaStats.js       # Now delegates to repositories
```

## ❌ Anti-Patterns to Avoid

```typescript
// ❌ String-based comparisons
if (skillName === "Pilot Jet") { ... }
if (occName.includes("Pilot")) { ... }

// ❌ Unvalidated JSON
const data = JSON.parse(rawJSON);
const boatData = data.skills[0]; // What if it's undefined?

// ❌ React imports in domain
// domain/character/handler.ts
import { useContext } from 'react'; // FORBIDDEN

// ❌ Comparing objects by property
const filtered = skills.filter(s => s.name === other.name);
// Better: filter by ID instead

// ❌ Storing raw strings in state/localStorage
character.skillId = "Pilot Jet"; // Should be SkillId type
```

## ✅ Patterns to Follow

```typescript
// ✅ ID-based lookups
const skillId = resolveSkillId(input) || throwError();
const skill = getSkillById(skillId) || throwError();

// ✅ Guard clauses
if (!skillId) {
  console.error(`Invalid skill: ${input}`);
  return null;
}

// ✅ Zod validation at boundaries
const validated = validateSkills(externalData); // Throws or parses

// ✅ Pure domain functions
function calculateTotal(skill: Skill, bonus: number): number {
  return Math.min(skill.base + bonus, 98);
}

// ✅ Type-safe collections
const skillMap: Map<SkillId, Skill> = new Map();
```

## 🚀 Working with Repositories

```typescript
// Initialize repositories (happens automatically on first import)
import { resolveSkillId, getSkillById } from '@/infrastructure/repositories/SkillRepository';

// Get all data
import { getAllSkills, getSkillsMap } from '@/infrastructure/repositories/SkillRepository';
const skills = getAllSkills(); // Returns Skill[]
const skillMap = getSkillsMap(); // Returns Map<SkillId, Skill>

// Search/filter
const pilotSkills = getAllSkills()
  .filter(s => s.category === SkillCategory.PILOT);

// ID resolution with error handling
try {
  const skillId = resolveSkillId(userInput) || throwError();
  const skill = getSkillById(skillId);
  // process skill...
} catch (error) {
  console.error('Skill resolution failed:', error);
}
```

## 📝 Code Review Checklist

When reviewing changes, check:

- [ ] No display name comparisons (use `resolveSkillId()`)
- [ ] No React imports in `domain/**` files
- [ ] All external data validated with Zod schemas
- [ ] ID lookups use `resolveSkillId()` → `getSkillById()` pattern
- [ ] Types use branded ID types (SkillId, OccId, MechaId)
- [ ] Domain functions are pure (no side effects)
- [ ] Repository initialization errors are handled
- [ ] No unvalidated JSON.parse() usage

## 🔧 Common Tasks

### Update a skill's value
```typescript
const skillId = resolveSkillId("Pilot Jet");
const skill = getSkillById(skillId);
// Skill objects are immutable, create new character object
return { ...character, skills };
```

### Find all skills in a category
```typescript
import { getAllSkills } from '@/infrastructure/repositories/SkillRepository';

const combatSkills = getAllSkills()
  .filter(s => s.category === SkillCategory.COMBAT);
```

### Validate user input before using
```typescript
const skillId = resolveSkillId(userInput);
if (!skillId) {
  return { error: `Unknown skill: ${userInput}` };
}
// Safe to use skillId now
```

## 📞 Questions?

If unsure about:
- ID types: See `src/domain/shared/types.ts`
- Skill operations: See `src/domain/skills/skill.ts`
- Validation: See `src/domain/validation/schemas.ts`
- Lookups: See `src/infrastructure/repositories/`

Remember: **When in doubt, use IDs and validate!**
