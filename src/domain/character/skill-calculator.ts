/**
 * Calculadora de Skills
 * Punto 6: Refactorizar calculateSkills() para usar skill_id y tipado fuerte
 * Punto 7: Aplicar avance por nivel a skills secundarios
 *
 * Fórmula:
 * total = base + occBonus + perLevelBonus + manualBonus
 * perLevelBonus = skill.perLevel * Math.max(0, characterLevel - 1)
 * total = Math.min(total, 98) // cap en 98 (reglas Palladium)
 *
 * Punto 7: Si hasPerLevelAdvance=false, perLevelBonus=0
 */

import type { Skill, SkillCalculationResult, SkillInstance } from '../skills/skill';

/**
 * Calcula el total de un skill considerando todos los bonificadores
 *
 * @param skill Definición del skill desde catálogo
 * @param occBonus Bonus otorgado por la OCC
 * @param characterLevel Nivel del personaje (1+)
 * @param manualBonus Bonus manual asignado por el jugador
 * @returns Resultado del cálculo completo
 */
export function calculateSkillTotal(
  skill: Skill,
  occBonus: number,
  characterLevel: number,
  manualBonus: number = 0
): SkillCalculationResult {
  // Punto 7: Si hasPerLevelAdvance es false, no sumar per-level
  const perLevelBonus = skill.hasPerLevelAdvance
    ? skill.perLevel * Math.max(0, characterLevel - 1)
    : 0;

  // Suma total
  let total = skill.base + occBonus + perLevelBonus + manualBonus;

  // Cap en 98 (reglas Palladium RPG)
  total = Math.min(total, 98);

  return {
    skillId: skill.id,
    name_es: skill.name_es,
    base: skill.base,
    occBonus,
    manualBonus,
    perLevelBonus,
    total,
  };
}

/**
 * Calcula todos los skills de un personaje
 * Combina primary y secondary skills
 *
 * @param primarySkills Skills primarios con sus IDs tipados
 * @param secondarySkills Skills secundarios con sus IDs tipados
 * @param skillMap Mapa de Skills por ID (SkillId → Skill)
 * @param occBonuses Bonificadores por OCC (keyed by SkillId)
 * @param characterLevel Nivel del personaje
 */
export function calculateCharacterSkills(
  primarySkills: SkillInstance[],
  secondarySkills: SkillInstance[],
  skillMap: Map<string, Skill>, // TODO: cambiar a Map<SkillId, Skill>
  occBonuses: Record<string, number>, // TODO: cambiar a Record<SkillId, number>
  characterLevel: number
): SkillCalculationResult[] {
  const results: SkillCalculationResult[] = [];

  // Combinar primary y secondary
  const allSkills = [
    ...primarySkills,
    ...secondarySkills,
  ];

  for (const instance of allSkills) {
    // Usar el skillId tipado directamente
    const skill = skillMap.get(instance.skillId as string);
    if (!skill) {
      console.warn(`Skill no encontrado: ${instance.skillId}`);
      continue;
    }

    const occBonus = occBonuses[instance.skillId as unknown as string] || 0;
    const manualBonus = instance.manualBonus || 0;

    const result = calculateSkillTotal(
      skill,
      occBonus,
      characterLevel,
      manualBonus
    );

    results.push(result);
  }

  return results;
}

/**
 * Calcula el bonus de un atributo
 * Usado para modificadores en tiradas
 */
export function calculateAttributeBonus(attributeValue: number): number {
  // Regla Palladium: (Attr - 10) / 2, mín -3
  const bonus = Math.floor((attributeValue - 10) / 2);
  return Math.max(bonus, -3);
}
