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

### Próximo paso sugerido
- Agregar manejo explícito de entradas `CHOICE` para evitar warning residual sin inventar datos.

---

## Convención de actualización
Agregar entradas por fecha con:
1. Qué se cambió
2. Por qué
3. Impacto en build/tests
4. Pendientes
