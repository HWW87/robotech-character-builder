/**
 * Generador de skill_id determinístico
 * Punto 5: Implementar skill_id único y eliminar dependencia de strings display
 *
 * Ejemplo:
 *   generateSkillId("Pilot Jet", "PILOT") → "PILOT_PILOT_JET_v1"
 *   generateSkillId("Rifles", "COMBAT") → "COMBAT_RIFLES_v1"
 *
 * Ventajas:
 * - IDs únicos y reproducibles
 * - Imposible confundir skills con mismo nombre en categorías diferentes
 * - Compatible con refactoreo de JSON
 * - Versionable (_v1, _v2 para cambios de reglas)
 */

import type { SkillId } from '../shared/types';
import { SkillCategory, createSkillId } from '../shared/types';

/**
 * Genera un skill_id determinístico basado en nombre y categoría
 *
 * @param name_es Nombre del skill en español (display name)
 * @param category Categoría del skill (PILOT, COMBAT, etc.)
 * @param version Versión del skill (default: 1)
 * @returns SkillId como "CATEGORY_NORMALIZED_NAME_v{version}"
 */
export function generateSkillId(
  name_es: string,
  category: SkillCategory,
  version: number = 1
): SkillId {
  // 1. Normalizar nombre: mayúsculas, espacios a underscore, chars especiales
  const normalized = name_es
    .toUpperCase()
    .replace(/\s+/g, '_') // espacios → underscore
    .replace(/[^A-Z0-9_]/g, '') // eliminar chars especiales
    .replace(/_+/g, '_') // underscore múltiples → simple
    .replace(/^_|_$/g, ''); // trim underscores

  // 2. Construir ID: CATEGORY_NORMALIZED_v{version}
  const id = `${category}_${normalized}_v${version}`;

  return createSkillId(id);
}

/**
 * Ejemplo de cómo se usaría al cargar JSON:
 *
 * const skill = {
 *   id: generateSkillId("Pilot Jet", SkillCategory.PILOT),
 *   name_es: "Pilot Jet",
 *   name_en: "Pilot Jet",
 *   category: SkillCategory.PILOT,
 *   base: 60,
 *   perLevel: 4,
 *   hasPerLevelAdvance: true,
 * };
 *
 * // Resultado:
 * // id: "PILOT_PILOT_JET_v1"
 */

/**
 * Normaliza un nombre de skill para comparaciones
 * Usado para matchear skills introducidos manualmente con el catálogo
 */
export function normalizeSkillName(name: string): string {
  return name
    .replace(/^Pilot\s+/i, '')  // Eliminar prefijo "Pilot "
    .replace(/^W\.P\.\s+/i, '')  // Eliminar prefijo "W.P. "
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // espacios múltiples → simple
    .replace(/[^\w\s]/g, ''); // eliminar puntuación
}

/**
 * Busca un skill en el catálogo by display name (fuzzy match)
 * Punto 5: evitar que typos rompan lookups
 */
export function findSkillIdByName(
  displayName: string,
  skillMap: Map<SkillId, { name_es: string }>
): SkillId | null {
  const normalized = normalizeSkillName(displayName);

  for (const [skillId, skill] of skillMap) {
    if (normalizeSkillName(skill.name_es) === normalized) {
      return skillId;
    }
  }

  return null;
}
