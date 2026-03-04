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
 * @param iqBonusPercent Bonus de IQ como porcentaje (IQ - 14) si IQ >= 17
 * @returns Resultado del cálculo completo
 *
 * Fórmula: total = base + occBonus + iqBonus + perLevelBonus + manualBonus
 * donde:
 *   - iqBonus = base * (iqBonusPercent / 100) [aplicado una sola vez]
 *   - perLevelBonus = perLevel * (level - 1)
 *   - total = min(total, 98)
 */
export function calculateSkillTotal(
  skill: Skill,
  occBonus: number,
  characterLevel: number,
  manualBonus: number = 0,
  iqBonusPercent?: number
): SkillCalculationResult {
  // Per-level advance bonus (si aplica)
  const perLevelBonus = skill.hasPerLevelAdvance
    ? skill.perLevel * Math.max(0, characterLevel - 1)
    : 0;

  // IQ bonus: aplicar porcentaje al base (una sola vez)
  const iqBonus = iqBonusPercent
    ? Math.floor(skill.base * (iqBonusPercent / 100))
    : 0;

  // Suma total
  let total = skill.base + occBonus + iqBonus + perLevelBonus + manualBonus;

  // Cap en 98 (reglas Palladium RPG)
  total = Math.min(total, 98);

  return {
    skillId: skill.id,
    name_es: skill.name_es,
    base: skill.base,
    occBonus,
    iqBonus,
    manualBonus,
    perLevelBonus,
    total,
  };
}

/**
 * Calcula todos los skills de un personaje
 * Combina primary y secondary skills, aplicando bonuses de OCC e IQ
 *
 * @param primarySkills Skills primarios con sus IDs tipados
 * @param secondarySkills Skills secundarios con sus IDs tipados
 * @param skillMap Mapa de Skills por ID (SkillId → Skill)
 * @param occBonuses Bonificadores por OCC (keyed by SkillId)
 * @param characterLevel Nivel del personaje
 * @param iqBonusPercent Bonus de IQ como porcentaje (IQ - 14) si IQ >= 17
 */
export function calculateCharacterSkills(
  primarySkills: SkillInstance[],
  secondarySkills: SkillInstance[],
  skillMap: Map<string, Skill>, // TODO: cambiar a Map<SkillId, Skill>
  occBonuses: Record<string, number>, // TODO: cambiar a Record<SkillId, number>
  characterLevel: number,
  iqBonusPercent?: number
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
      manualBonus,
      iqBonusPercent
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
