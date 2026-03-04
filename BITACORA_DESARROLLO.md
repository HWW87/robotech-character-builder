# Bitácora de Desarrollo

## Objetivo
Mantener contexto técnico e historial de decisiones para evitar pérdida de información entre iteraciones.

---

## 2026-03-03

### Estado general
- Rama activa: `feature/typescript`
- Build: ✅ OK
- Tests: ✅ `14 passed`, `3 skipped`

### Cambios aplicados (alta prioridad)

#### FIX 1 — Tipados Zod completos
- Archivo: `src/domain/validation/schemas.ts`
- Se agregó `AlignmentSchema`.
- Se agregó `ValidatedAlignment = z.infer<typeof AlignmentSchema>`.
- Se agregó `validateAlignments(data)`.

#### FIX A — Secondary skills avanzan por nivel
- Archivo: `src/utils/skillCalculator.js`
- Se dejó el cálculo de `perLevelBonus` para todas las skills (OCC y secundarias).

#### FIX B — OCC usa SkillIds reales
- Archivo: `src/infrastructure/repositories/OccRepository.ts`
- `OccRepository` ahora recibe `SkillRepository` por constructor (inyección).
- `primarySkills` se resuelve con `resolveSkillId(...)` usando `skill_id ?? skill`.
- Se filtra `rule_type === "TEXT_ONLY"` para no tratar texto narrativo como skill canónica.

### Coherencia de repositorios
- Archivo: `src/infrastructure/repositories/SkillRepository.ts`
- Se exportó la clase `SkillRepository` para habilitar DI.
- Se agregaron aliases OCC→skill canónica para mejorar resolución (variantes/plurales).

### Estado de warnings OCC
- Se redujeron fuertemente warnings de skills no resueltas.
- Pendiente narrativo no determinístico:
  - `Hand to Hand (choose one: Expert or Martial Arts)`

### Decisiones
- Source of Truth para SkillId: `SkillRepository`.
- No "brandear" nombres libres como IDs de dominio.
- En casos narrativos/choice, no forzar resolución automática sin regla explícita.

### Estado final — Ciclo completado
✅ FIX A: Secondary skills avanzan por nivel (aplicado).
✅ FIX B: OccRepository inyecta SkillRepository y resuelve IDs reales (aplicado).
✅ Alias OCC→skill canónica agregados.
✅ Tests: 14 passed, 3 skipped.
✅ Build: OK.

### Cambios en rama
```
src/utils/skillCalculator.js
  - Línea 70-76: perLevelBonus = perLevel * Math.max(0, level - 1) 
    (antes: condicional isSecondary)

src/infrastructure/repositories/OccRepository.ts
  - Línea 11: import { SkillRepository, skillRepository } from './SkillRepository'
  - Línea 16: constructor(private skillRepo: SkillRepository)
  - Línea 26: static getInstance(skillRepo = skillRepository)
  - Línea 107-120: resolución con .filter(TEXT_ONLY), skill_id/skill fallback, resolveSkillId()

src/infrastructure/repositories/SkillRepository.ts
  - Línea 18-32: occAliasByNormalizedName Map (14 aliases frecuentes)
  - Línea 156-170: lógica de resolución con fallback a alias
  - Clase ahora exportada (DI ready)

src/domain/validation/schemas.ts
  - Línea 95-110: AlignmentSchema + ValidatedAlignment
  - Línea 162-172: validateAlignments()
```

### Próximo paso sugerido
- Manejo explícito de entradas `CHOICE` (narrativas sin skill canónica): investigar si marcar explícitamente en OCC o silenciar warning.

---

## 2026-03-03 — ANÁLISIS SPEC CHARACTER_CREATION_SPEC

### 📋 GAP ANALYSIS (Especificación vs Código)

#### ✅ IMPLEMENTADO (Funcional)
- **Screen A (Personal/Faction)**: `PersonalDataPage`, `FactionPage`, inputs básicos OK
- **Screen B (Attributes)**: `AttributesPage`, almacenamiento atributos base OK
- **Screen D (OCC Selection)**: `OCCPage`, `OCCSelector`, validación de requisitos pendiente
- **Screen E (Skills)**: `SkillManager`, selección de otras skills, limites (`select_count`)
- **Screen H (Summary/Export)**: `SummaryView`, JSON export/import OK

#### ❌ FALTA O INCOMPLETO (Critical Path)

| Requerimiento | Ubicación Spec | Estado | Impacto |
|---|---|---|---|
| **Attrs excepcionales (3d6 → si 16-18 roll +1d6)** | Screen B | ❌ No | Generación incompleta |
| **IQ Bonus ≥17** | Screen B, E | ❌ No | Skills mal calculadas |
| **HP Calculation (PE + 1d6)** | Screen C | ❌ No | Vitals sin HP |
| **S.D.C. Base by OCC** | Screen C | ❌ No | Vitals sin SDC |
| **Skill calculation: OCC one-time bonus** | Screen E | ❌ Parcial | Math incorrecta |
| **Skill calculation: IQ one-time bonus** | Screen E | ❌ No | Math incorrecta |
| **Skill cap 98%** | Screen E | ⚠️ Parcial | Aplicado (verificar) |
| **Pantalla Equipment/Credits (Step 4)** | Screen F | ❌ No | Equipo/wages sin UI |
| **Pantalla Alignment (Step 5)** | Screen G | ❌ No | Alineamiento sin selector |
| **Multi-OCC (Optional)** | Sección 2 | ❌ No | Opcional (skip OK) |

#### 🔴 BRECHA EN CharacterState

**Actual** (useCharacterData.js):
```
{
  name, faction, 
  attributes: {IQ, ME, MA, PS, PP, PE, PB, Spd}, 
  occ, skills, mecha, 
  modifiers
}
```

**Requerido** (spec):
```
{
  personal: {name, age, rank?, faction},
  level: {currentLevel},
  attributes: {IQ, ME, MA, PS, PP, PE, PB, Spd, attributeBonuses},
  vitality: {
    hitPoints: {base, initialRoll, totalAtLevel1},
    sdc: {baseByOcc, fromSkills, total}
  },
  occ: {occId, occName, occSkills, otherSkillsChosen},
  skills: {
    calculatedSkills, 
    globalSkillBonuses: {iqBonusPercent, occSkillBonuses}
  },
  equipment: {standardEquipment, wages, personalSavings},
  alignment: {alignmentId, alignmentName, alignmentGroup}
}
```

### 📊 Pantallas vs Spec

| Pantalla | Spec | Actual | Estado |
|---|---|---|---|
| A. Personal/Faction | ✅ | PersonalDataPage, FactionPage | OK |
| B. Attributes | Spec compleja | AttributesPage básico | 🟡 Falta excepcionales + IQ bonus |
| C. HP + S.D.C. | Nueva en spec | ❌ No existe | 🔴 Missing |
| D. OCC Selection | ✅ | OCCPage | OK |
| E. Skills | Spec compleja | SkillManager | 🟡 Falta bonuses + math |
| F. Equipment/Credits | Nueva en spec | ❌ No existe | 🔴 Missing |
| G. Alignment | Nueva en spec | ❌ No existe (datos sí) | 🔴 Missing |
| H. Summary/Export | ✅ | SummaryPage | OK |

### 🎯 Skill Calculation - ACTUAL vs REQUIRED

**Actual** (`skillCalculator.js`):
```
total = base + occ_bonus + manual_extra + perLevel*(level-1)
```
No aplicado/falta:
- IQ bonus (one-time)
- Separación OCC vs se condaria (ambas avanzan ahora)
- OCC bonuses están mezcladas con entrada del usuario

**Requerido**:
```
total = clamp(
  base + 
  occBonus (one-time) +
  iqBonus (one-time, si IQ≥17) +
  perLevel*(level-1),
  max=98
)
```

### 🔧 Pasos Sugeridos para Implementación

1. **Extend CharacterState** (useCharacterData.js): agregar campos vitality, level, equipment, alignment
2. **Screen C + Logic**: Crear HPCalculator, SDCCalculator (widgets + domain layer)
3. **Screen F**: Equipment page con standard gear + wages/savings
4. **Screen G**: Alignment page (selector, alignmentGroup mapping)
5. **Attributes**: Fixear 3d6+1d6, calcular iqBonusPercent
6. **Skill Math**: Aplicar IQ bonus, separar OCC bonuses claramente
7. **Sync**: Validar attribute requirements en OCC selection

---

## 📐 PLAN DE IMPLEMENTACIÓN — 7 PRs SECUENCIALES

### PR#1 — Extend CharacterState + Domain Types
**Rama**: `feature/extend-character-state`
**Objetivo**: Extender CharacterState a la shape completa del spec.

**Cambios**:
- `src/hooks/useCharacterData.js`: Agregar campos (vitality, level, equipment, alignment, etc.)
- `src/domain/shared/types.ts`: Crear tipos TypeScript para CharacterState (optional pero recomendado)
- Actualizar localStorage default

**Impacto**: Preparación para las 6 PRs siguientes; se rompería algo si no se hace primero.
**Tests**: useCharacterData.test.jsx

---

### PR#2 — Attributes Exceptional + IQ Bonus Calculation
**Rama**: `feature/attributes-exceptional`
**Objetivo**: Implementar 3d6 + 1d6 (si 16-18) e IQ bonus.

**Cambios**:
- `src/pages/AttributesPage.jsx`: Agregar "Roll All" + lógica 3d6→+1d6
- `src/components/AttributesView.jsx`: UI para excepcionales
- `src/domain/shared/types.ts`: Agregar `attributeBonuses` type
- `src/utils/modifiers.js`: Crear `calculateAttributeBonuses(attributes)` 
  - Retorna `{iqBonusPercent}` si IQ≥17
- Actualizar `useCharacterData` para guardar `attributeBonuses`

**Testing**: Roll 3d6, verif 16-18 triggers +1d6, IQ≥17 calcula bonus correcto

---

### PR#3 — Screen C (HP + S.D.C.)
**Rama**: `feature/vitality-screen`
**Objetivo**: Crear pantalla Step 2 (antes de OCC).

**Cambios**:
- `src/pages/VitalityPage.jsx`: Nueva página (después AttributesPage, antes OCCPage)
- `src/components/HPCalculator.jsx`: Widget para PE + 1d6
- `src/components/SDCCalculator.jsx`: Widget para base by OCC + skills
- `src/domain/vitality/vitality.ts`: Lógica de cálculo (pure functions)
  - `calculateHP(pe, initialRoll, level)` 
  - `calculateSDC(occSdc, skillBonuses)`
- Actualizar `App.jsx` routing (insertar VitalityPage en flow)
- Actualizar bitácora con nueva pantalla

**Testing**: Verif HP = PE + roll, SDC = base + skills

---

### PR#4 — Screen F (Equipment + Credits)
**Rama**: `feature/equipment-screen`
**Objetivo**: Crear pantalla Step 4 (después Skills).

**Cambios**:
- `src/pages/EquipmentPage.jsx`: Nueva página
- `src/components/EquipmentView.jsx`: Mostrar standard gear + wages
- `src/domain/equipment/equipment.ts`: 
  - `getStandardEquipment(occId)`
  - `calculateMonthlyWages(occId, level)`
  - `generatePersonalSavings(occId)` (dice formula)
- Data: Agregar `standard_equipment`, `wages`, `savings_formula` a `occ_rdf.json`
- Actualizar routing

---

### PR#5 — Screen G (Alignment Selector)
**Rama**: `feature/alignment-screen`
**Objetivo**: Crear pantalla Step 5.

**Cambios**:
- `src/pages/AlignmentPage.jsx`: Nueva página (last step, antes Summary)
- `src/components/AlignmentSelector.jsx`: Selector + grupo display
- `src/domain/alignment/alignment.ts`: 
  - Type `AlignmentGroup = "Good" | "Selfish" | "Evil"`
  - Función `mapAlignmentToGroup(alignmentId): AlignmentGroup`
- Usar `AlignmentRepository` (ya existe con Zod)
- Actualizar routing

---

### PR#6 — Skill Math Refactor (IQ Bonus + Separación OCC)
**Rama**: `feature/skill-math-complete`
**Objetivo**: Implementar full skill calculation per spec.

**Cambios**:
- `src/domain/skills/skill-calculator.ts` (NEW):
  ```ts
  interface SkillCalcInput {
    base: number;
    occBonus?: number; // one-time
    iqBonus?: number;  // one-time, if IQ≥17
    perLevel: number;
    level: number;
    manualBonus?: number;
  }
  
  export function calculateSkill(input: SkillCalcInput): SkillResult {
    const perLevelComponent = input.perLevel * Math.max(0, input.level - 1);
    const total = clamp(
      input.base + 
      (input.occBonus ?? 0) + 
      (input.iqBonus ?? 0) + 
      perLevelComponent + 
      (input.manualBonus ?? 0),
      0, 98
    );
    return {...};
  }
  ```
- `src/utils/skillCalculator.js`: Refactor para usar nueva lógica
  - Pasar `iqBonus` desde CharacterState
  - Separar OCC bonuses per skill
- Actualizar `SummaryPage` para pasar `iqBonusPercent` a calculateSkills
- Tests: Verif IQ bonus aplicado una sola vez, OCC bonus separado, cap 98

---

### PR#7 — Attribute Requirement Validation in OCC
**Rama**: `feature/occ-attribute-gating`
**Objetivo**: Validar minimums antes de seleccionar OCC.

**Cambios**:
- `src/utils/occRules.js`: Agregar `getOccAttributeRequirements(occId)`
- `src/pages/OCCPage.jsx`: 
  - Validar atributos antes de permitir click
  - Mostrar warning si no cumple
  - Bloquear Next si no válido
- `src/domain/occ/occ.ts`: Type `AttributeRequirements`
- Data: Agregar `attribute_requirements` a `occ_rdf.json`

---

### 📋 Orden de Ejecución (Dependencias)

```
PR#1 (Extend State) ← required by all
  ├─→ PR#2 (Attributes)
  ├─→ PR#3 (Vitality)
  └─→ PR#4 (Equipment)
         ├─→ PR#5 (Alignment) → PR#6 (Skill Math)
         └─→ PR#6 (Skill Math)
              └─→ PR#7 (OCC Gating)
```

**Recomendación**: Hacer PR#1, PR#2, PR#3 juntos (son independientes de PR#4/5/6); luego PR#6 afecta skill ui; PR#7 es final.

---

## 2026-03-03 — PR#1 IMPLEMENTADO: Extend CharacterState

### ✅ Completado
- `src/domain/shared/types.ts`: 
  - Agregadas interfaces completas: PersonalData, LevelData, VitalityData, OccData, SkillsData, EquipmentData, AlignmentData
  - Nueva interface CharacterState (jerárquica, per spec)
  - Tipo `AlignmentGroup` ('Good' | 'Selfish' | 'Evil')
  
- `src/hooks/useCharacterData.js`:
  - Actualizado DEFAULT_CHARACTER_STATE a nueva estructura
  - Agregada función `migrateCharacter()` para compatibilidad hacia atrás
  - localStorage migration automática al cargar datos

### 🎯 Impacto
- TypeScript: ✅ type-check OK
- Build: ✅ OK (910.32 kB, gzip 271.62 kB)
- Tests: Pendiente (probablemente requieren parches menores)
- Breaking Changes: SÍ (CharacterState.name → CharacterState.personal.name, etc.)

### 📝 Próximo Paso
PR#2 (Attributes Exceptional) depende de PR#1. Los componentes necesitarán actualizaciones para acceder a nueva estructura en PRs subsecuentes.

### 🔄 Nota de Implementación
Este PR es foundational. Los siguientes PRs actualizarán componentes para usar:
- `character.personal.*` en lugar de `character.*` para nombre/edad/facción
- `character.attributes` mantiene igual estructura interna
- `character.vitality.hitPoints.total` para HP
- `character.skills.calculatedSkills` para skills
- etc.

### 🚀 Status Final PR#1
- Commit: `2cf2e9b` "feat: PR#1 extend CharacterState"
- Branch: feature/typescript
- Pushed: ✅

---

## Convención de actualización
Agregar entradas por fecha con:
1. Qué se cambió
2. Por qué
3. Impacto en build/tests
4. Pendientes

---

## 2026-03-03 � PR#2: Attributes Exceptional + IQ Bonus Calculation [COMPLETADO]

### Status
? **PR#2 COMPLETADO** - Commit \ea81b6a\ pushed to feature/typescript

### Cambios Implementados

#### 1. AttributeForm.jsx - Roll Logic (3d6 + Exceptional)
- Nueva funci�n \oll3d6WithExceptional()\ 
- 3d6 base, si result 16-18: +1d6
- Bot�n actualizado a "Roll All (3D6 + Exceptional)"

#### 2. modifiers.js - New Function (IQ Bonus)
- \calculateAttributeBonuses(attrs)\: {iqBonusPercent?}
- Si IQ >= 17: iqBonusPercent = IQ - 14

#### 3. AttributesPage.jsx - Bonuses Persistence
- Import \calculateAttributeBonuses\
- Memoizaci�n + useEffect ? update("attributeBonuses")

### Validaciones
- ? Build: 910.58 kB
- ? Type-check: OK
- ? Tests: 14/17 green
- ? Git: Commit + push

### Pr�ximo: PR#3 (Vitality Screen)

---

## 2026-03-04 � PR#3: Vitality Screen (HP + S.D.C.) [COMPLETADO]

### Status
? **PR#3 COMPLETADO** - Commit \ecd23c8\ pushed to feature/typescript

### Cambios Implementados

#### 1. vitality.ts (Domain Logic)
- \calculateHP(pe, initialRoll, level): HitPoints\
  - HP = PE + 1d6 (at creation)
  - Returns {base, initialRoll, totalAtLevel1}
- \calculateSDC(baseByOcc, skillBonuses): SdcData\
  - S.D.C. = OCC base + skill bonuses
- \getSDCBaseByOcc(occId): number\
  - Placeholder mapping with DEFAULT_SDC_BY_OCC
  - TODO: Load from occ_rdf.json future

#### 2. HPCalculator.jsx (Component)
- Roll 1d6 button with visual feedback
- Displays PE (base), Roll (1d6), Total
- Calls onHPChange with HitPoints object
- Styled per retro theme

#### 3. SDCCalculator.jsx (Component)
- Shows OCC base S.D.C.
- Input field for skill bonuses (e.g., Boxing +5)
- Displays Total S.D.C.
- Calls onSDCChange with SdcData object

#### 4. VitalityPage.jsx (Container)
- Step 3 in character creation flow
- Combines HPCalculator + SDCCalculator
- Validates that both HP and S.D.C. are set before Next
- Navigation: Previous ? Attributes, Next ? O.C.C.
- Persists to character.vitality via update()

#### 5. App.jsx (Routing)
- Import VitalityPage
- Add na route: /vitality ? VitalityPage
- Insert in nav bar between Attributes and O.C.C.
- Route sequence: /attributes ? /vitality ? /occ

### Validaciones
- ? Build: 915.03 kB (OK, +4.45 kB vs PR#2)
- ? Type-check: OK (tsc --noEmit)
- ? Tests: 14/17 green (3 skipped)
- ? Git: Commit + push a origin/feature/typescript

### Impacto
- **PR#4 (Equipment)**: Procede sin cambios
- **PR#5 (Alignment)**: Independent (no dependencies)
- **PR#6 (Skill Math)**: Character.vitality now available for validation

### Estructura CharacterState
\\\
character.vitality = {
  hitPoints: {base, initialRoll, totalAtLevel1},
  sdc: {baseByOcc, fromSkills?, total}
}
\\\

### Nota T�cnica
- HP c�lculo simple per Robotech spec (PE + 1d6)
- S.D.C. base valores placeholder (pending occ_rdf.json update)
- Skill bonuses (Boxing, etc.) implementado como input manual (future: load from skills)

### Pr�ximo: PR#4 (Equipment Screen)

---

## 2026-03-04 � FIX: Pages Updated for CharacterState Structure [HOTFIX]

### Problem
Skills page (and other pages) were blank after PR#1 because components were accessing old CharacterState paths.

### Root Cause
PR#1 changed CharacterState from flat structure to hierarchical:
- OLD: \character.faction\, \character.occ\ (string), \character.skills\ (array)
- NEW: \character.personal.faction\, \character.occ\ (object), \character.occ.otherSkillsChosen\

Pages were still using old paths ? blank screens/errors.

### Solution Applied
Updated all affected pages to use new CharacterState structure:

#### Pages Fixed
1. **SkillsPage.jsx**: Extract \personal.faction\, \occ.occName\, \occ.otherSkillsChosen\
2. **OCCPage.jsx**: Extract \personal.faction\, \occ.occName\, update entire \occ\ object
3. **MechaPage.jsx**: Extract \personal.faction\, \mecha.mechaName\
4. **SummaryPage.jsx**: Extract \level.currentLevel\, \occ.occSkills\, \occ.otherSkillsChosen\
5. **PersonalDataPage.jsx**: Pass \character.personal\, update personal subfields
6. **FactionPage.jsx**: Update \character.personal.faction\

### Validaciones
- ? Build: 915.30 kB
- ? Type-check: OK
- ? Tests: 14/17 green
- ? Git: Commit \d1124a0\ + push

### Impact
All pages now correctly read/write to hierarchical CharacterState. Skills page functional again.

### Next
Continue with PR#4 (Equipment Screen) as originally planned.
