# 📋 Plan de Migración a TypeScript — Robotech Character Builder

## 🎯 Objetivo Final
Transformar el proyecto de un **prototipo basado en strings** a una **plataforma táctica estructurada, tipada y extensible**, lista para expansión **Macross → Southern Cross → Invid**.

---

## � 12 Puntos de Migración

### **Punto 1️⃣: Activar TypeScript en el proyecto**
Instalar TypeScript y crear `tsconfig.json` en modo estricto.

```bash
npm install -D typescript @types/react @types/react-dom @types/node
npx tsc --init
```

**tsconfig.json recomendado:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Meta**: ✅ TypeScript compilador activo, strict mode habilitado

---

### **Punto 2️⃣: Migrar primero la capa de dominio**
Antes que la UI, estructurar `src/domain/` con la lógica pura de negocio.

**Estructura recomendada:**
```
src/
├── domain/
│   ├── skills/
│   │   ├── skill.ts
│   │   ├── skill-repository.ts
│   │   └── skill-calculator.ts
│   ├── occ/
│   │   ├── occ.ts
│   │   ├── occ-repository.ts
│   │   └── occ-rules.ts
│   ├── mecha/
│   │   ├── mecha.ts
│   │   └── mecha-repository.ts
│   ├── character/
│   │   ├── character.ts
│   │   ├── character-service.ts
├── ui/
│   ├── components/
│   ├── pages/
│   ├── hooks/
├── data/
│   ├── occ_rdf.json
│   ├── skills_rdf.json
│   └── mechas.json
```

**Meta**: ✅ Dominio separado de UI, funciones puras sin React

---

### **Punto 3️⃣: Definir tipos base con discriminantes**
Crear tipos únicos para `SkillId`, `OccId`, `MechaId`, `AlignmentId`.

**src/domain/shared/types.ts:**
```typescript
// Branded types para máxima seguridad
export type SkillId = string & { readonly __brand: 'SkillId' };
export type OccId = string & { readonly __brand: 'OccId' };
export type MechaId = string & { readonly __brand: 'MechaId' };
export type AlignmentId = string & { readonly __brand: 'AlignmentId' };

export const createSkillId = (value: string): SkillId => value as SkillId;
export const createOccId = (value: string): OccId => value as OccId;
export const createMechaId = (value: string): MechaId => value as MechaId;
export const createAlignmentId = (value: string): AlignmentId => value as AlignmentId;

// Atributos base
export enum Attribute {
  IQ = "IQ",
  ME = "ME",
  MA = "MA",
  PS = "PS",
  PP = "PP",
  PE = "PE",
  PB = "PB",
  SPD = "SPD"
}

// Eras del universo Robotech
export enum Era {
  MACROSS = "Macross",
  SOUTHERN_CROSS = "Southern Cross",
  INVID = "Invid"
}

// Categorías de skills
export enum SkillCategory {
  PILOT = "PILOT",
  COMBAT = "COMBAT",
  TECHNICAL = "TECHNICAL",
  COMMUNICATIONS = "COMMUNICATIONS",
  DOMESTIC = "DOMESTIC",
  PHYSICAL = "PHYSICAL",
  ESPIONAGE = "ESPIONAGE"
}
```

**Meta**: ✅ IDs tipados, imposible mezclar strings

---

### **Punto 4️⃣: Crear interfaces formales para dominios**

**src/domain/skills/skill.ts:**
```typescript
import { SkillId, SkillCategory } from '../shared/types';

export interface Skill {
  readonly id: SkillId;
  readonly name_es: string;
  readonly name_en: string;
  readonly category: SkillCategory;
  readonly base: number;
  readonly perLevel: number;
  readonly exclusiveToOcc?: string;
}

export interface SkillInstance {
  readonly skillId: SkillId;
  readonly level: number;
  readonly manualBonus: number;
}
```

**src/domain/occ/occ.ts:**
```typescript
import { OccId, SkillId, Era } from '../shared/types';

export interface OCC {
  readonly id: OccId;
  readonly name_es: string;
  readonly name_en: string;
  readonly category: string;
  readonly era: Era;
  readonly description_es: string;
  readonly factions: string[];
  readonly primarySkills: SkillId[]; // IDs, no strings
  readonly secondarySkillsAllowed: {
    readonly count: number;
    readonly categories: SkillCategory[];
  };
}
```

**src/domain/mecha/mecha.ts:**
```typescript
import { MechaId, Era } from '../shared/types';

export interface MDCLocation {
  readonly value: number;
  readonly each: boolean;
}

export interface WeaponSystem {
  readonly name_es: string;
  readonly name_en: string;
  readonly damage: string;
  readonly range: string;
  readonly notes?: string;
}

export interface Mecha {
  readonly id: MechaId;
  readonly name_es: string;
  readonly name_en: string;
  readonly era: Era;
  readonly category: string;
  readonly description_es: string;
  readonly mdcByLocation: Record<string, MDCLocation>;
  readonly weaponSystems: WeaponSystem[];
  readonly modes?: string[];
}
```

**Meta**: ✅ Interfaces formales con tipos de dominio

---

### **Punto 5️⃣: Implementar skill_id determinístico**
Eliminar dependencia de strings display, usar IDs únicos basados en nombre+categoria.

**src/domain/skills/skill-id-generator.ts:**
```typescript
import { SkillId, createSkillId } from '../shared/types';

/**
 * Genera un skill_id determinístico basado en nombre y categoría.
 * Ejemplo: "Pilot Jet" + "PILOT" → "PILOT_PILOT_JET_v1"
 */
export function generateSkillId(
  name_es: string,
  category: SkillCategory
): SkillId {
  const normalized = name_es
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '');
  
  return createSkillId(`${category}_${normalized}_v1`);
}

// Actualizar JSON con skill_id:
// {
//   "id": "PILOT_PILOT_JET_v1",
//   "name_es": "Pilot Jet",
//   "category": "PILOT",
//   "base": 60,
//   "perLevel": 4
// }
```

**Meta**: ✅ Skills con ID único, eliminadas dependencias de strings

---

### **Punto 6️⃣: Refactorizar calculateSkills() con tipado fuerte**

**src/domain/character/skill-calculator.ts:**
```typescript
import { Skill, SkillInstance } from '../skills/skill';
import { SkillId } from '../shared/types';

export interface SkillCalculationResult {
  readonly skillId: SkillId;
  readonly name_es: string;
  readonly base: number;
  readonly occBonus: number;
  readonly manualBonus: number;
  readonly perLevelBonus: number;
  readonly total: number;
}

/**
 * Calcula el total de un skill considerando:
 * - base: valor base del skill
 * - occBonus: bonus otorgado por la OCC
 * - perLevel: incremento por nivel (solo si level > 1)
 * - manualBonus: bonus manual del jugador
 */
export function calculateSkillTotal(
  skill: Skill,
  occBonus: number,
  characterLevel: number,
  manualBonus: number = 0
): SkillCalculationResult {
  const perLevelBonus = skill.perLevel * Math.max(0, characterLevel - 1);
  const total = skill.base + occBonus + perLevelBonus + manualBonus;

  return {
    skillId: skill.id,
    name_es: skill.name_es,
    base: skill.base,
    occBonus,
    manualBonus,
    perLevelBonus,
    total: Math.min(total, 98), // Cap en 98 (reglas Palladium)
  };
}

export function calculateCharacterSkills(
  primarySkills: SkillInstance[],
  secondarySkills: SkillInstance[],
  skillRepository: SkillRepository,
  occBonuses: Record<SkillId, number>,
  characterLevel: number
): SkillCalculationResult[] {
  const results: SkillCalculationResult[] = [];

  for (const instance of [...primarySkills, ...secondarySkills]) {
    const skill = skillRepository.getById(instance.skillId);
    if (!skill) continue;

    const occBonus = occBonuses[skill.id] || 0;
    const result = calculateSkillTotal(
      skill,
      occBonus,
      characterLevel,
      instance.manualBonus
    );
    results.push(result);
  }

  return results;
}
```

**Meta**: ✅ calculateSkills tipado, usa skill_id, no strings

---

### **Punto 7️⃣: Aplicar avance por nivel a skills secundarios**
Excepto donde explícitamente se indique lo contrario.

**En skill.ts:**
```typescript
export interface Skill {
  readonly id: SkillId;
  // ... otros campos
  readonly perLevel: number;
  readonly hasPerLevelAdvance: boolean; // Default true
}
```

**En skill-calculator.ts:**
```typescript
export function calculateSkillTotal(
  skill: Skill,
  occBonus: number,
  characterLevel: number,
  manualBonus: number = 0
): SkillCalculationResult {
  // Si skill.hasPerLevelAdvance es false, perLevelBonus = 0
  const perLevelBonus = skill.hasPerLevelAdvance 
    ? skill.perLevel * Math.max(0, characterLevel - 1)
    : 0;

  const total = skill.base + occBonus + perLevelBonus + manualBonus;
  // ...
}
```

**Meta**: ✅ Secondary skills avanzan por nivel, excepto si `hasPerLevelAdvance=false`

---

### **Punto 8️⃣: Introducir validación con Zod**
Validar datos de JSON en tiempo de carga.

```bash
npm install zod zod-to-json-schema
```

**src/domain/validation/schemas.ts:**
```typescript
import { z } from 'zod';
import { Era, SkillCategory } from '../shared/types';

const SkillSchema = z.object({
  id: z.string().min(1),
  name_es: z.string().min(1),
  name_en: z.string().min(1),
  category: z.nativeEnum(SkillCategory),
  base: z.number().int().min(0).max(98),
  perLevel: z.number().int().min(0).max(10),
  exclusiveToOcc: z.string().optional(),
  hasPerLevelAdvance: z.boolean().default(true),
});

const OccSchema = z.object({
  id: z.string().min(1),
  name_es: z.string().min(1),
  name_en: z.string().min(1),
  category: z.string(),
  era: z.nativeEnum(Era),
  description_es: z.string(),
  factions: z.array(z.string()),
  primarySkills: z.array(z.string()),
  secondarySkillsAllowed: z.object({
    count: z.number().int().positive(),
    categories: z.array(z.nativeEnum(SkillCategory)),
  }),
});

const MechaSchema = z.object({
  id: z.string().min(1),
  name_es: z.string().min(1),
  name_en: z.string().min(1),
  era: z.nativeEnum(Era),
  category: z.string(),
  description_es: z.string(),
  mdcByLocation: z.record(z.object({
    value: z.number().int().positive(),
    each: z.boolean(),
  })),
  weaponSystems: z.array(z.object({
    name_es: z.string(),
    name_en: z.string(),
    damage: z.string(),
    range: z.string(),
    notes: z.string().optional(),
  })),
  modes: z.array(z.string()).optional(),
});

export const validateSkills = (data: unknown) => SkillSchema.array().parse(data);
export const validateOccs = (data: unknown) => OccSchema.array().parse(data);
export const validateMechas = (data: unknown) => MechaSchema.array().parse(data);
```

**En repository:**
```typescript
export class SkillRepository {
  constructor(rawData: unknown) {
    const validated = validateSkills(rawData);
    this.skills = validated;
  }
}
```

**Meta**: ✅ JSON validado contra esquemas, errores detectados temprano

---

### **Punto 9️⃣: Separar dominio de UI**
Funciones puras sin dependencias de React.

**Estructura:**
```
src/
├── domain/
│   ├── character/
│   │   └── character-service.ts        ← Lógica pura
│   └── skills/
│       └── skill-calculator.ts         ← Lógica pura
├── ui/
│   ├── hooks/
│   │   └── useCharacterData.ts         ← Hook de React
│   └── components/
│       └── SkillManager.tsx            ← UI puro
├── infrastructure/
│   ├── repositories/
│   │   └── skill-repository.ts         ← Carga de datos
│   └── adapters/
│       └── character-local-storage.ts  ← Persistencia
```

**Regla Oro**: `src/domain/**` nunca importa React o `@/ui/**`

**Meta**: ✅ Dominio testeable sin mocks de React

---

### **Punto 🔟: Migrar gradualmente componentes React a .tsx**
Cuando dominio esté estable (puntos 1-9 completados).

**Orden:**
1. Componentes sin props complejas
2. Componentes con datos del dominio
3. Páginas
4. App.tsx

**Ejemplo modernizado:**
```typescript
// src/ui/components/SkillManager.tsx
import React, { FC } from 'react';
import { useCharacterData } from '../hooks/useCharacterData';
import { SkillCalculationResult } from '../../domain/character/skill-calculator';

interface SkillManagerProps {
  skills: SkillCalculationResult[];
  onSkillBonus: (skillId: string, bonus: number) => void;
}

const SkillManager: FC<SkillManagerProps> = ({ skills, onSkillBonus }) => {
  return (
    <div className="skill-grid">
      {skills.map(skill => (
        <div key={skill.skillId} className="skill-card">
          <h3>{skill.name_es}</h3>
          <p>Total: {skill.total}</p>
        </div>
      ))}
    </div>
  );
};

export default SkillManager;
```

**Meta**: ✅ Componentes tipados, deps inyectadas desde props

---

### **Punto 1️⃣1️⃣: Tests unitarios con Vitest**
Resolución de skills y cálculo de progresión.

```bash
npm install -D vitest @vitest/ui
```

**src/domain/character/__tests__/skill-calculator.test.ts:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { calculateSkillTotal } from '../skill-calculator';
import { SkillCategory, createSkillId } from '../../shared/types';
import { Skill } from '../../skills/skill';

describe('SkillCalculator', () => {
  let pilotSkill: Skill;

  beforeEach(() => {
    pilotSkill = {
      id: createSkillId('PILOT_PILOT_JET_v1'),
      name_es: 'Pilot Jet',
      name_en: 'Pilot Jet',
      category: SkillCategory.PILOT,
      base: 60,
      perLevel: 4,
    };
  });

  it('calculates base skill correctly', () => {
    const result = calculateSkillTotal(pilotSkill, 0, 1, 0);
    expect(result.total).toBe(60);
  });

  it('applies OCC bonus', () => {
    const result = calculateSkillTotal(pilotSkill, 10, 1, 0);
    expect(result.total).toBe(70);
  });

  it('applies per-level advancement', () => {
    const result = calculateSkillTotal(pilotSkill, 0, 3, 0);
    // base 60 + perLevel*2 (3-1=2) = 60 + 8 = 68
    expect(result.total).toBe(68);
  });

  it('caps total at 98', () => {
    const result = calculateSkillTotal(pilotSkill, 50, 5, 20);
    // 60 + 50 + 16 + 20 = 146 → capped at 98
    expect(result.total).toBe(98);
  });

  it('applies manual bonus', () => {
    const result = calculateSkillTotal(pilotSkill, 5, 2, 3);
    // 60 + 5 + 4 + 3 = 72
    expect(result.total).toBe(72);
  });
});
```

**package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest --run",
    "test:ui": "vitest --ui"
  }
}
```

**Meta**: ✅ Cobertura de dominio, tests puros sin React

---

### **Punto 1️⃣2️⃣: Normalizar estructura de Mechas**
MDC por ubicación, armas estructuradas, modos definidos.

**Actualizar skills_rdf.json:**
```json
{
  "id": "MECHA_VF1_v1",
  "name_es": "Veritech VF-1 Valkyrie",
  "name_en": "Veritech VF-1 Valkyrie",
  "era": "Macross",
  "category": "Veritech",
  "mdcByLocation": {
    "fuselage": { "value": 150, "each": false },
    "left_wing": { "value": 75, "each": false },
    "right_wing": { "value": 75, "each": false },
    "head": { "value": 40, "each": false },
    "leg_left": { "value": 80, "each": false },
    "leg_right": { "value": 80, "each": false }
  },
  "weaponSystems": [
    {
      "name_es": "Cañón Vulkan (Nariz)",
      "name_en": "Vulcan Cannon (Nose)",
      "damage": "4d6",
      "range": "1200 m",
      "notes": "Tasa de fuego: 1500 rondas/minuto"
    },
    {
      "name_es": "Misiles Aire-Aire",
      "name_en": "Air-to-Air Missiles",
      "damage": "2d6 x 10",
      "range": "50 km",
      "notes": "Máx 6 misiles"
    }
  ],
  "modes": [
    "Fighter",
    "Battloid",
    "GERWALK"
  ]
}
```

**Interfaz actualizada:**
```typescript
export interface Mecha {
  readonly id: MechaId;
  readonly name_es: string;
  readonly name_en: string;
  readonly era: Era;
  readonly category: string;
  readonly mdcByLocation: Record<string, MDCLocation>;
  readonly weaponSystems: WeaponSystem[];
  readonly modes: readonly string[];
}
```

**Meta**: ✅ Mechas estructuradas, listas para batalla

---

## 🗓️ Cronograma Sugerido

| Semana | Hito | Puntos | Entregables |
|--------|------|--------|------------|
| **1** | TypeScript Setup | 1️⃣ 2️⃣ | `tsconfig.json`, estructura inicial `src/domain/` |
| **2** | Tipos Base & Dominio | 3️⃣ 4️⃣ 5️⃣ | `src/domain/shared/types.ts`, `skill.ts`, `occ.ts`, `mecha.ts` |
| **3** | Lógica Pura | 6️⃣ 7️⃣ | `skill-calculator.ts` con tests primeros (`TDD`) |
| **4** | Validación | 8️⃣ 9️⃣ | Esquemas Zod, eliminación de dependencias de React en dominio |
| **5** | Migración UI | 🔟 | Componentes `.tsx`, hooks con inyección de dependencias |
| **6** | Cobertura Total | 1️⃣1️⃣ | Tests de `character-service`, integración E2E |
| **7** | Normalización | 1️⃣2️⃣ | JSON actualizado (skill_id, MDC estructurado) |

---

## ✅ Checklist de Migración

**Fase: TypeScript Setup**
- [ ] Punto 1️⃣: `npm install typescript`, `tsconfig.json` en strict mode
- [ ] Git: crear rama `feature/typescript`

**Fase: Dominio**
- [ ] Punto 2️⃣: Crear estructura `src/domain/`
- [ ] Punto 3️⃣: Branded types (`SkillId`, `OccId`, etc.)
- [ ] Punto 4️⃣: Interfaces formales (Skill, OCC, Mecha)
- [ ] Punto 5️⃣: Generador de `skill_id` determinístico
- [ ] Punto 6️⃣: `calculateSkillTotal()` refactorizado
- [ ] Punto 7️⃣: Avance por nivel en secundarios (flag `hasPerLevelAdvance`)

**Fase: Robustez**
- [ ] Punto 8️⃣: Validación Zod, parse en carga
- [ ] Punto 9️⃣: Separación dominio/UI, sin imports de React en `src/domain/`

**Fase: UI & Tests**
- [ ] Punto 🔟: Componentes `.tsx` con props tipadas
- [ ] Punto 1️⃣1️⃣: Tests unitarios (>80% cobertura dominio)
- [ ] Punto 1️⃣2️⃣: JSON actualizado (skill_id, MDC normalizado)

**Cierre**
- [ ] `npm run type-check` → 0 errores
- [ ] `npm run test:run` → todos verdes
- [ ] `npm run build` → sin warnings
- [ ] Merge a `main`, deploy

---

## 🎯 Objetivos por Punto

| Punto | Objetivo | Métrica de Éxito |
|-------|----------|-----------------|
| 1️⃣ | TypeScript listo | `tsc --version`, `tsconfig.json` strict |
| 2️⃣ | Dominio separado | Carpeta `src/domain/` sin imports de React |
| 3️⃣ | Tipos únicos | IDs no son strings, compilador lo refuerza |
| 4️⃣ | Interfaces formales | Intellisense completo en IDEs |
| 5️⃣ | skill_id único | Imposible skill duplicado o ambiguo |
| 6️⃣ | Cálculos tipados | `calculateSkillTotal()` retorna SkillCalculationResult |
| 7️⃣ | Avance consistente | Secundarios avanzan salvo `hasPerLevelAdvance=false` |
| 8️⃣ | Datos validados | Parse JSON con Zod, errores en startup |
| 9️⃣ | Domino puro | Tests de dominio sin mocks de React |
| 🔟 | Componentes tipados | Todas las props tienen tipos explícitos |
| 1️⃣1️⃣ | Cobertura tests | >80% líneas críticas de dominio |
| 1️⃣2️⃣ | Estructura final | Mechas listas para batalla (MDC, armas, modos) |

---

## 🚀 Beneficios Transformacionales

✅ **De Prototipo a Plataforma**: Arquitectura extensible para Macross → Southern Cross → Invid  
✅ **De Strings a IDs**: Imposible confundir skills, OCCs o mechas  
✅ **De Ad-hoc a Reglas**: Sistema de validación que asegura integridad de datos  
✅ **De Frágil a Resistente**: Tests de dominio previenen regresiones  
✅ **De Opaco a Explícito**: Tipos sirven como documentación viva  
✅ **De Monolítico a Modular**: Dominio desacoplado permite testing independiente  

---

## 🔧 Scripts Sugeridos en package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run type-check && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "test": "vitest",
    "test:run": "vitest --run",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --run --coverage",
    "lint-types": "tsc --noEmit && echo '✅ All types OK!'"
  }
}
```

---

## 📚 Arquitectura Final Esperada

```
src/
├── domain/                           ← Lógica pura (sin React)
│   ├── shared/
│   │   ├── types.ts                 ← SkillId, OccId, Enums
│   │   └── constants.ts
│   ├── skills/
│   │   ├── skill.ts                 ← Interface Skill
│   │   ├── skill-repository.ts
│   │   └── skill-id-generator.ts
│   ├── occ/
│   │   ├── occ.ts
│   │   ├── occ-repository.ts
│   │   └── occ-rules.ts
│   ├── mecha/
│   │   ├── mecha.ts
│   │   └── mecha-repository.ts
│   ├── character/
│   │   ├── character.ts
│   │   ├── skill-calculator.ts      ← Cálculo + tests
│   │   └── character-service.ts
│   └── validation/
│       └── schemas.ts               ← Zod schemas
│
├── infrastructure/                   ← Adaptadores (sin React)
│   ├── repositories/
│   │   ├── skill-repository.ts
│   │   ├── occ-repository.ts
│   │   └── mecha-repository.ts
│   └── adapters/
│       ├── character-local-storage.ts
│       └── json-loader.ts
│
├── ui/                              ← React layer
│   ├── components/
│   │   ├── PersonalDataForm.tsx
│   │   ├── SkillManager.tsx
│   │   ├── OCCSelector.tsx
│   │   └── MechaSelector.tsx
│   ├── pages/
│   │   ├── PersonalDataPage.tsx
│   │   └── SkillsPage.tsx
│   ├── hooks/
│   │   └── useCharacterData.ts
│   ├── App.tsx
│   └── main.tsx
│
├── data/                            ← JSON (tipado)
│   ├── skills_rdf.json              ← Con skill_id
│   ├── occ_rdf.json
│   ├── mechas.json
│   └── alignments.json
│
└── __tests__/
    ├── domain/
    │   ├── skill-calculator.test.ts
    │   └── character-service.test.ts
    └── integration/
        └── character-flow.test.ts
```

---

## 🎓 Filosofía del Plan

Este plan **no es una conversión mecánica** .js → .ts. Es una **refactorización arquitectónica** que:

1. **Extrae dominio** de la UI (puntos 2-9)
2. **Tipifica desde adentro** (tipos base primero, UI después)
3. **Valida datos en entrada** (Zod, no en componentes)
4. **Hace testeable** sin mocks (dominio puro)
5. **Prepara extensión** (Macross hoy, Southern Cross mañana)

**Énfasis**: Puntos 1-9 son cambios de arquitectura. Punto 10+ son cosméticos. Prioriza puntos 2-6.

---

## 🚨 Desafíos Comunes

| Desafío | Solución |
|---------|----------|
| "¿Dónde va X?" | Si toca datos: `src/domain/`. Si toca UI: `src/ui/`. |
| "TypeScript es lento" | Compilación offline, Vite cachea. Invisible en dev. |
| "Refactor es riesgoso" | TDD (tests primero). Dominio + tests, luego UI. |
| "JSON parsing complejo" | Zod valida, TypeError nunca llega a TS. |
| "Tests son tedious" | Dominio puro = sin mocks. 1 test = claridad. |

---

## 📞 Próximos Pasos Recomendados

1. **Semana 1**: Crear rama, instalar TypeScript, estructura `src/domain/`
2. **Semana 2-3**: Codificar tipos y `skill-calculator.ts` con tests
3. **Semana 4**: Validación Zod, actualizar JSON
4. **Semana 5-6**: UI y merge progresivo a `main`

**Criterio de aceptación final**: Proyecto listo para:
- ✅ Agregar nueva OCC sin modificar código
- ✅ Nueva skill sin name/id conflicts
- ✅ Nuevo mecha con estructura automáticamente validada
- ✅ Expansión a nueva Era sin breaking changes

---

**Versión**: 2.0 (Based on 12-Point Plan)  
**Autor**: Robotech TypeScript Migration Team  
**Fecha**: 01/03/2026  
**Estado**: 🟢 Listo para Implementación — Inicia Punto 1️⃣
