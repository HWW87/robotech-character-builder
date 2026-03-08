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

interface LegacyOccAttributeShape {
  attribute_requirements?: AttributeRequirements;
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
  occ: OCC | LegacyOccAttributeShape,
  characterAttributes: Record<string, number>
): AttributeValidationResult {
  const unmetMinimums: Array<{ attribute: string; required: number; actual: number }> = [];
  const warnings: string[] = [];
  const requirements = (occ as OCC).attributeRequirements || (occ as LegacyOccAttributeShape).attribute_requirements;

  const normalizeAttributeName = (raw: string): string => {
    const cleaned = raw.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (cleaned === 'SPEED') return 'Spd';
    if (cleaned.length <= 3) return cleaned;
    return raw;
  };

  // Validar minimums requeridos
  if (requirements?.minimums) {
    for (const [attr, minValue] of Object.entries(requirements.minimums)) {
      const normalizedAttr = normalizeAttributeName(attr);
      const actualValue = characterAttributes[normalizedAttr] || 0;
      if (actualValue < minValue) {
        unmetMinimums.push({
          attribute: normalizedAttr,
          required: minValue,
          actual: actualValue,
        });
      }
    }
  }

  // Advertencias para preferred attributes (no bloqueantes)
  // Si se puede parsear "P.P. 9+", solo advertir cuando no se cumple.
  if (requirements?.preferred) {
    for (const preferredText of requirements.preferred) {
      const thresholdMatch = preferredText.match(/([A-Za-z.]+)\s*(\d+)\+/);
      if (!thresholdMatch) {
        warnings.push(preferredText);
        continue;
      }

      const [, rawAttr, rawThreshold] = thresholdMatch;
      if (!rawAttr || !rawThreshold) {
        warnings.push(preferredText);
        continue;
      }
      const normalizedAttr = normalizeAttributeName(rawAttr);
      const threshold = Number(rawThreshold);
      const actualValue = characterAttributes[normalizedAttr] || 0;

      if (actualValue < threshold) {
        warnings.push(`${normalizedAttr}: preferred ${threshold}+ (you have ${actualValue})`);
      }
    }
  }

  return {
    isValid: unmetMinimums.length === 0,
    unmetMinimums,
    warnings,
  };
}
