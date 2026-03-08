import occData from "../data/southern_cross/occs.json";
import mosData from "../data/southern_cross/mos.json";
import armiesData from "../data/southern_cross/armies.json";
import southernSkillsData from "../data/southern_cross/skills.json";

export const MODULE_IDS = {
  BOOK1: "macross_book1",
  SOUTHERN_CROSS: "southern_cross_book4",
};

export function normalizeFactionId(value) {
  if (!value) return "";
  const v = String(value).trim().toLowerCase();
  if (v === "rdf") return "rdf";
  if (v === "southern cross" || v === "southern_cross") return "southern_cross";
  if (v === "zentraedi") return "zentraedi";
  if (v === "invid") return "invid";
  return v;
}

export function getModuleIdByFaction(faction) {
  return normalizeFactionId(faction) === "southern_cross"
    ? MODULE_IDS.SOUTHERN_CROSS
    : MODULE_IDS.BOOK1;
}

export function isSouthernCrossModule(moduleId) {
  return moduleId === MODULE_IDS.SOUTHERN_CROSS;
}

export function getSouthernCrossArmies() {
  return armiesData.armies || [];
}

export function getSouthernCrossOccs() {
  return occData.occs || [];
}

export function getSouthernCrossOccByName(occName) {
  return getSouthernCrossOccs().find((o) => o.name_en === occName) || null;
}

export function getSouthernCrossOccById(occId) {
  return getSouthernCrossOccs().find((o) => o.id === occId) || null;
}

export function getMosForOcc(occId) {
  if (!occId) return [];
  return (mosData.mos || []).filter((m) => (m.occ_ids || []).includes(occId));
}

export function getMosById(mosId) {
  return (mosData.mos || []).find((m) => m.id === mosId) || null;
}

export function getSouthernCrossSkillCatalog() {
  return southernSkillsData.skills || [];
}

export function getMechaRoleForOcc(occName) {
  const occ = getSouthernCrossOccByName(occName);
  return occ?.mecha_role || "Any";
}

export function extractOccSkillNames(occSkills = []) {
  return (occSkills || [])
    .map((s) => {
      if (!s) return "";
      if (typeof s === "string") return s;
      return s.skill || s.name || "";
    })
    .filter(Boolean);
}

export function removeDuplicateSkills(skillNames = [], blockedSet = new Set()) {
  const out = [];
  const seen = new Set([...blockedSet]);
  for (const name of skillNames) {
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push(name);
  }
  return out;
}
