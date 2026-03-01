/**
 * Dominio Skill - Interfaz y tipos
 * Punto 4: Interfaces formales para Skills
 */

import type { SkillId } from '../shared/types';
import { SkillCategory } from '../shared/types';

/**
 * Definición de un Skill en el catálogo
 * Immutable, representa el skill como está definido en skills_rdf.json
 */
export interface Skill {
  readonly id: SkillId;
  readonly name_es: string;
  readonly name_en: string;
  readonly category: SkillCategory;
  readonly base: number;
  readonly perLevel: number;
  readonly exclusiveToOcc?: string;
  readonly hasPerLevelAdvance: boolean; // Punto 7: controla si avanza por nivel
}

/**
 * Instancia de skill seleccionada por un personaje
 * Mutable, contiene decisiones del jugador
 */
export interface SkillInstance {
  readonly skillId: SkillId;
  readonly level: number;
  readonly manualBonus: number;
}

/**
 * Resultado del cálculo de un skill
 * Punto 6: output del calculateSkillTotal
 */
export interface SkillCalculationResult {
  readonly skillId: SkillId;
  readonly name_es: string;
  readonly base: number;
  readonly occBonus: number;
  readonly manualBonus: number;
  readonly perLevelBonus: number;
  readonly total: number;
}
