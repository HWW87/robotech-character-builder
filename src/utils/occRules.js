/**
 * Utilities for working with OCC definitions stored in JSON.
 * The source file `occ_rdf.json` contains an array of OCCs each with
 * an optional `factions` list indicating which faction(s) can choose it.
 */
import occData from "../data/occ_rdf.json";
import skillsData from "../data/skills_rdf.json";

/**
 * Return the list of OCC display names.  Faction filtering is currently
 * ignored because the JSON doesn't include faction data; assume all OCCs
 * are available to the selected faction until the data is extended.
 */
export const getOccByFaction = (faction) => {
  if (!occData?.occs) return [];
  if (!faction) return occData.occs.map((o) => o.name_en);
  // return only those occs whose factions list includes the given faction
  return occData.occs
    .filter(
      (o) =>
        !o.factions ||
        o.factions.length === 0 ||
        o.factions.includes(faction) ||
        o.factions.includes("Any")
    )
    .map((o) => o.name_en);
};

/**
 * Look up the full definition object for an OCC by its display name (English).
 */
export const getOccDetails = (name) => {
  if (!occData?.occs) return null;
  return occData.occs.find((o) => o.name_en === name) || null;
};

// legacy helpers left for backwards compatibility – kept for now but
// the app no longer relies on these.
export const getSkillsByFaction = (faction, parsedData) => {
  return getOccByFaction(faction).map((name) => {
    const occ = getOccDetails(name);
    return occ?.occ_skills?.map((s) => s.skill) || [];
  }).flat();
};
// -----------------------------------------------------------------------------
// New helpers for skill filtering and limits

/**
 * Return a flat list of every skill name defined in skills_rdf.json.
 */
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
  if (!skillsData.skills_by_category) return [];
  return Object.values(skillsData.skills_by_category).flatMap((cat) =>
    Object.keys(cat)
  );
};

/**
 * Given an OCC name, return the list of extra skills the player may choose from
 * when selecting "other skills." The result excludes skills already granted
 * by the OCC and applies simple category filtering based on allowed_categories.
 */
export const getAllowedSecondarySkills = (occName) => {
  const occ = getOccDetails(occName);
  if (!occ) return [];

  const allSkills = getAllSkillNames();

  // remove OCC-provided skills, normalizing both lists
  const primary = occ.occ_skills?.map((s) => normalizeSkillName(s.skill)) || [];
  let allowed = allSkills.filter((s) => {
    return !primary.includes(normalizeSkillName(s));
  });

  const categories = occ.other_skills?.allowed_categories || [];
  if (categories.length > 0) {
    // if any category entry allows "Any" we don't further restrict
    if (
      categories.some(
        (c) => c.restriction && c.restriction.toLowerCase().includes("any")
      )
    ) {
      return allowed;
    }

    allowed = allowed.filter((skill) => {
      const skillCat = skillToCategory[skill];
      if (!skillCat) return false;
      return categories.some(
        (c) => c.category.toLowerCase() === skillCat.toLowerCase()
      );
    });
  }

  return allowed;
};

/**
 * How many other skills may be selected for this OCC? Falls back to Infinity.
 */
export const getOtherSkillLimit = (occName) => {
  const occ = getOccDetails(occName);
  if (!occ) return Infinity;
  return occ.other_skills?.select_count ?? Infinity;
};

// -----------------------------------------------------------------------------
