import { calculateSkills } from "../../utils/skillCalculator";
import { getSouthernCrossSkillCatalog, extractOccSkillNames } from "../../utils/southernCrossRules";

const normalize = (value) => (value || "").trim().toLowerCase();

const getCatalogSkill = (name) => {
  const entry = (getSouthernCrossSkillCatalog() || []).find(
    (skill) => normalize(skill.name) === normalize(name)
  );
  if (!entry) return null;
  return {
    base: Number(entry.base || 0),
    perLevel: Number(entry.per_level || 0),
  };
};

const asOccEntries = (occSkills = []) =>
  occSkills.map((item) => {
    if (typeof item === "string") return { name: item, bonus: 0 };
    return { name: item.skill || item.name || "", bonus: Number(item.bonus || 0) };
  });

export class Book1SkillSelectionEngine {
  selectAndCalculate(input) {
    return calculateSkills(
      input.occSkills,
      input.secondarySkills || [],
      input.level || 1,
      input.extraBonuses || {},
      input.iqBonusPercent
    );
  }
}

export class SouthernCrossSkillSelectionEngine {
  selectAndCalculate(input) {
    const level = input.level || 1;
    const iqBonusPercent = Number(input.iqBonusPercent || 0);
    const mosBonusPercent = Number(input.mosBonusPercent || 0);
    const extraBonuses = input.extraBonuses || {};

    const occEntries = asOccEntries(input.occSkills || []);
    const mosSkills = input.mosSkills || [];
    const otherSkills = input.secondarySkills || [];

    const bySkill = new Map();

    const upsert = (name, type, bonus) => {
      const key = normalize(name);
      if (!key) return;

      const previous = bySkill.get(key);
      if (!previous) {
        bySkill.set(key, { name, type, bonus: Number(bonus || 0) });
        return;
      }

      const higherBonus = Math.max(Number(previous.bonus || 0), Number(bonus || 0));
      const typePriority = { OCC: 3, MOS: 2, Other: 1 };
      const chosenType =
        (typePriority[type] || 0) > (typePriority[previous.type] || 0)
          ? type
          : previous.type;

      bySkill.set(key, {
        name: previous.name,
        type: chosenType,
        bonus: higherBonus,
      });
    };

    occEntries.forEach((entry) => upsert(entry.name, "OCC", entry.bonus));
    mosSkills.forEach((name) => upsert(name, "MOS", mosBonusPercent));

    const blocked = new Set([
      ...extractOccSkillNames(input.occSkills || []),
      ...mosSkills,
    ].map(normalize));

    otherSkills.forEach((name) => {
      if (!blocked.has(normalize(name))) {
        upsert(name, "Other", 0);
      }
    });

    const output = [];

    for (const [, selected] of bySkill) {
      const extra = Number(
        extraBonuses[selected.name] ?? extraBonuses[normalize(selected.name)] ?? 0
      );
      const catalog = getCatalogSkill(selected.name);
      const base = catalog?.base ?? 0;
      const perLevel = catalog?.perLevel ?? 0;
      const perLevelBonus = perLevel * Math.max(0, level - 1);
      const iqBonus = iqBonusPercent ? Math.floor(base * (iqBonusPercent / 100)) : 0;

      output.push({
        skillId: null,
        skill_id: null,
        id: null,
        name: selected.name,
        name_es: selected.name,
        name_en: selected.name,
        base,
        bonus: Number(selected.bonus || 0) + extra,
        iqBonus,
        perLevel,
        perLevelBonus,
        total: Math.min(base + Number(selected.bonus || 0) + extra + iqBonus + perLevelBonus, 98),
        type: selected.type,
        missingInCatalog: !catalog,
      });
    }

    return output;
  }
}

export function getSkillSelectionEngine(moduleId) {
  if (moduleId === "southern_cross_book4") {
    return new SouthernCrossSkillSelectionEngine();
  }
  return new Book1SkillSelectionEngine();
}
