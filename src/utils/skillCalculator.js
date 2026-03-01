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
  const addSkill = (name, bonus = 0, isSecondary = false) => {
    // incorporate any manual "varios" bonus
    const extra = extraBonuses[name] || 0;
    bonus += extra;
    let base = 0;
    let perLevel = 0;

    // search flattened data structure
    const entry = getSkillEntry(name);
    if (entry) {
      base = entry.base || 0;
      perLevel = entry.per_level || 0;
    }

    const total = Math.round(base + bonus + (isSecondary ? 0 : (perLevel * (level - 1))));
    allSkills.push({ name, base, bonus, perLevel, total, type: isSecondary ? "Secondary" : "OCC" });
  };

  // Accept either objects ({ name, bonus }) or plain string names
  occSkills.forEach((s) => {
    if (!s) return;
    if (typeof s === "string") addSkill(s, 0, false);
    else addSkill(s.name || s.skill, s.bonus || 0, false);
  });

  secondarySkills.forEach((s) => {
    if (!s) return;
    if (typeof s === "string") addSkill(s, 0, true);
    else addSkill(s.name || s.skill, 0, true);
  });

  return allSkills;
}
