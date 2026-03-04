/**
 * Legacy skill calculator
 * ⚠️ DEPRECATED: Use SkillRepository y calculateCharacterSkills() desde domain layer
 *
 * Esta función se mantiene para compatibilidad con código antiguo
 * Migración: ver infrastructure/repositories/SkillRepository.ts
 */

import { resolveSkillId, getSkillById, getAllSkills } from '../infrastructure/repositories/SkillRepository';
import skillsData from "../data/skills_rdf.json";

// helper to flatten skills_by_category when needed, with basic normalization
const normalizeName = (name) => {
  if (!name) return name;
  // strip common prefixes
  return name
    .replace(/^Pilot\s+/i, "")
    .replace(/^W\.P\.\s*/i, "")
    .trim();
};

const getSkillEntry = (name) => {
  const cats = skillsData.skills_by_category || {};
  const norm = normalizeName(name);
  for (const cat of Object.values(cats)) {
    if (cat[name] !== undefined) {
      return cat[name];
    }
    if (cat[norm] !== undefined) {
      return cat[norm];
    }
  }
  return null;
};

/**
 * Combina OCC skills, Secondary skills y calcula valores finales.
 * @deprecated Usar calculateCharacterSkills() del domain layer en su lugar
 * @param {object} occSkills - lista de habilidades del OCC
 * @param {object} secondarySkills - lista de habilidades secundarias
 * @param {number} level - nivel del personaje
 */
export function calculateSkills(
  occSkills = [],
  secondarySkills = [],
  level = 1,
  extraBonuses = {} // object mapping skill name → additional bonus value
) {
  const allSkills = [];
  const addSkill = (nameOrId, bonus = 0, isSecondary = false) => {
    // Intentar resolver el ID
    const skillId = resolveSkillId(nameOrId);
    
    if (!skillId) {
      console.warn(`⚠️ No se pudo resolver skill: ${nameOrId}`);
      return;
    }

    const skill = getSkillById(skillId);
    if (!skill) {
      console.warn(`⚠️ Skill no encontrado después de resolver ID: ${skillId}`);
      return;
    }

    // Incorporar cualquier bonus manual "varios"
    const extra = extraBonuses[nameOrId] || extraBonuses[skill.name_es] || 0;
    bonus += extra;

    // Usar los datos de dominio en lugar del JSON legacy
    const base = skill.base || 0;
    const perLevel = skill.perLevel || 0;

    // Aplicar bonus per-level solo a skills principales
    const perLevelBonus = isSecondary ? 0 : (perLevel * Math.max(0, level - 1));
    const total = Math.min(base + bonus + perLevelBonus, 98); // cap en 98

    allSkills.push({
      skillId,
      id: skillId,
      name: skill.name_es,
      name_es: skill.name_es,
      name_en: skill.name_en,
      base,
      bonus,
      perLevel,
      perLevelBonus,
      total,
      type: isSecondary ? "Secondary" : "OCC"
    });
  };

  // Accept either objects ({ name, bonus }) or plain string names
  occSkills.forEach((s) => {
    if (!s) return;
    if (typeof s === "string") addSkill(s, 0, false);
    else addSkill(s.name || s.skill || s.skillId, s.bonus || 0, false);
  });

  secondarySkills.forEach((s) => {
    if (!s) return;
    if (typeof s === "string") addSkill(s, 0, true);
    else addSkill(s.name || s.skill || s.skillId, 0, true);
  });

  return allSkills;
}
