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

## Convención de actualización
Agregar entradas por fecha con:
1. Qué se cambió
2. Por qué
3. Impacto en build/tests
4. Pendientes
