/**
 * Utilities for working with OCC definitions stored in JSON.
 * ⚠️ DEPRECATED: Use OccRepository desde infrastructure/repositories
 *
 * La mayoría de estas funciones ahora son wrappers sobre OccRepository
 * para mantener compatibilidad con código antiguo.
 */
import { getAllOccs, getOccById, resolveOccId } from "../infrastructure/repositories/OccRepository";
import { getAllSkills, resolveSkillId } from "../infrastructure/repositories/SkillRepository";
import occData from "../data/occ_rdf.json";
import skillsData from "../data/skills_rdf.json";
import southernCrossOccsData from "../data/southern_cross/occs.json";
import southernCrossSkillsData from "../data/southern_cross/skills.json";
import { normalizeFactionId } from "./southernCrossRules";

/**
 * Return the list of OCC display names by faction.
 * @deprecated Usar getOccsByFaction() de OccRepository
 */
export const getOccByFaction = (faction) => {
  const normalizedFaction = normalizeFactionId(faction);

  if (normalizedFaction === "southern_cross") {
    return (southernCrossOccsData.occs || []).map(o => o.name_en);
  }

  const mappedFaction = normalizedFaction === "rdf" ? "RDF" : faction;
  const occs = faction 
    ? getAllOccs().filter(o => !o.factions || o.factions.length === 0 || o.factions.includes(mappedFaction) || o.factions.includes("Any"))
    : getAllOccs();
  return occs.map(o => o.name_en);
};

/**
 * Look up the full definition object for an OCC by its display name (English).
 * @deprecated Usar getOccById() de OccRepository
 */
export const getOccDetails = (name) => {
  const southernOcc = (southernCrossOccsData.occs || []).find(o => o.name_en === name);
  if (southernOcc) return southernOcc;

  const occ = getAllOccs().find(o => o.name_en === name);
  return occ || null;
};

/**
 * Get OCC details by ID (more efficient)
 */
export const getOccDetailsById = (occId) => {
  return getOccById(occId);
};

// legacy helpers left for backwards compatibility
export const getSkillsByFaction = (faction, parsedData) => {
  return getOccByFaction(faction).map((name) => {
    const occ = getOccDetails(name);
    return occ?.primarySkills || [];
  }).flat();
};

// build a simple skill -> category lookup from the data file
const skillToCategory = {};
if (skillsData.skills_by_category) {
  Object.entries(skillsData.skills_by_category).forEach(([cat, entries]) => {
    Object.keys(entries).forEach((skill) => {
      skillToCategory[skill] = cat; // store category name (uppercase)
    });
  });
}

// some OCC names use prefixes like "Pilot " that don't appear in the
// base skill list. Helpers below normalize both sides for comparison.
const normalizeSkillName = (name) => {
  if (!name) return name;
  // strip common prefixes
  return name.replace(/^Pilot +/i, "").trim();
};

export const getAllSkillNames = () => {
  const baseSkills = getAllSkills().map(s => s.name_es);
  const southernSkills = (southernCrossSkillsData.skills || []).map(s => s.name);
  return Array.from(new Set([...baseSkills, ...southernSkills]));
};

/**
 * Given an OCC name, return the list of extra skills the player may choose from
 * when selecting "other skills." The result excludes skills already granted
 * by the OCC and applies simple category filtering based on allowed_categories.
 * @deprecated Usar getOccDetails() + getAllSkills() de los repositories
 */
export const getAllowedSecondarySkills = (occName) => {
  const occ = getOccDetails(occName);
  if (!occ) return [];

  if (occ.id && String(occ.id).startsWith("sc_")) {
    const occSkillSet = new Set((occ.occ_skills || []).map((s) => s.skill));
    return getAllSkillNames().filter((name) => !occSkillSet.has(name));
  }

  const allSkills = getAllSkills();

  // Convertir nombres de skills primarios a IDs para comparación
  const primarySkillIds = new Set();
  for (const skillName of (occ.primarySkills || [])) {
    const skillId = resolveSkillId(skillName);
    if (skillId) {
      primarySkillIds.add(skillId);
    }
  }

  // Filtrar skills: remover OCC-provided skills
  let allowed = allSkills.filter((s) => {
    return !primarySkillIds.has(s.id);
  });

  const allowedCategories = occ.secondarySkillsAllowed?.categories || [];
  if (allowedCategories.length > 0) {
    // Filter by allowed categories
    allowed = allowed.filter((skill) => {
      return allowedCategories.includes(skill.category);
    });
  }

  return allowed.map(s => s.name_es);
};

/**
 * How many other skills may be selected for this OCC? Falls back to Infinity.
 * @deprecated Usar OCC object directamente desde los repositories
 */
export const getOtherSkillLimit = (occName) => {
  const occ = getOccDetails(occName);
  if (!occ) return Infinity;
  if (occ.other_skills?.select_count) return occ.other_skills.select_count;
  return occ.secondarySkillsAllowed?.count ?? Infinity;
};
