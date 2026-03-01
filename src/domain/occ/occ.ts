/**
 * Dominio OCC - Interfaz y tipos
 * Punto 4: Interfaces formales para OCC
 */

import type { OccId, SkillId, Era, SkillCategory } from '../shared/types';

/**
 * Definición de una Occupational Character Class
 * Immutable, representa la OCC como está definida en occ_rdf.json
 */
export interface OCC {
  readonly id: OccId;
  readonly name_es: string;
  readonly name_en: string;
  readonly category: string;
  readonly era: Era;
  readonly description_es: string;
  readonly factions: string[];
  readonly primarySkills: SkillId[]; // Punto 5: usar IDs, no strings
  readonly secondarySkillsAllowed: {
    readonly count: number;
    readonly categories: SkillCategory[];
  };
}

/**
 * Configuración de bonus de skill por OCC
 * Mapea skill_id -> bonus (ej. PILOT_PILOT_JET_v1 -> 10)
 */
export type OccSkillBonuses = Record<SkillId, number>;
