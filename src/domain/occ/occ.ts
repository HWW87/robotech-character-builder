/**
 * Dominio OCC - Interfaz y tipos
 * Punto 4: Interfaces formales para OCC
 * PR#7: Attribute requirement validation
 */

import type { OccId, SkillId, Era, SkillCategory } from '../shared/types';

/**
 * Requisitos de atributos para una OCC
 * Minimums: atributos requeridos (ej. IQ >= 8)
 * Preferred: atributos preferidos pero no requeridos (ej. "High P.P.")
 */
export interface AttributeRequirements {
  readonly minimums?: Record<string, number>; // ej. { IQ: 8, PP: 9 }
  readonly preferred?: string[];
  readonly notes?: string;
}

/**
 * Resultado de validación de requisitos de atributos
 */
export interface AttributeValidationResult {
  readonly isValid: boolean; // true si todos los minimums se cumplen
  readonly unmetMinimums: Array<{ attribute: string; required: number; actual: number }>;
  readonly warnings: string[]; // preferred attributes not met
}

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
  readonly attributeRequirements?: AttributeRequirements; // PR#7
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

/**
 * Valida los requisitos de atributos para una OCC dada
 * @param occ OCC a validar
 * @param characterAttributes Atributos del personaje actual
 * @returns Resultado de validación con detalles de requisitos no cumplidos
 */
export function validateOccAttributeRequirements(
  occ: OCC,
  characterAttributes: Record<string, number>
): AttributeValidationResult {
  const unmetMinimums: Array<{ attribute: string; required: number; actual: number }> = [];
  const warnings: string[] = [];

  // Validar minimums requeridos
  if (occ.attributeRequirements?.minimums) {
    for (const [attr, minValue] of Object.entries(occ.attributeRequirements.minimums)) {
      const actualValue = characterAttributes[attr] || 0;
      if (actualValue < minValue) {
        unmetMinimums.push({
          attribute: attr,
          required: minValue,
          actual: actualValue,
        });
      }
    }
  }

  // Advertencias para preferred attributes (no bloqueantes)
  if (occ.attributeRequirements?.preferred) {
    warnings.push(...occ.attributeRequirements.preferred);
  }

  return {
    isValid: unmetMinimums.length === 0,
    unmetMinimums,
    warnings,
  };
}
