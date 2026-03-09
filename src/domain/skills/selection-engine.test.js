import { describe, it, expect } from "vitest";
import {
  SouthernCrossSkillSelectionEngine,
  getSkillSelectionEngine,
} from "./selection-engine";

describe("SouthernCrossSkillSelectionEngine", () => {
  it("applies MOS bonus only to MOS skills", () => {
    const engine = new SouthernCrossSkillSelectionEngine();

    const result = engine.selectAndCalculate({
      occSkills: [{ skill: "Weapon Systems", bonus: 10 }],
      mosSkills: ["Navigation"],
      secondarySkills: ["Intelligence"],
      mosBonusPercent: 15,
      level: 1,
      iqBonusPercent: 0,
      extraBonuses: {},
    });

    const occSkill = result.find((s) => s.name === "Weapon Systems");
    const mosSkill = result.find((s) => s.name === "Navigation");
    const otherSkill = result.find((s) => s.name === "Intelligence");

    expect(occSkill).toBeTruthy();
    expect(mosSkill).toBeTruthy();
    expect(otherSkill).toBeTruthy();

    expect(occSkill.type).toBe("OCC");
    expect(occSkill.bonus).toBe(10);

    expect(mosSkill.type).toBe("MOS");
    expect(mosSkill.bonus).toBe(15);

    expect(otherSkill.type).toBe("Other");
    expect(otherSkill.bonus).toBe(0);
  });

  it("deduplicates OCC/MOS skill and keeps higher bonus", () => {
    const engine = new SouthernCrossSkillSelectionEngine();

    const result = engine.selectAndCalculate({
      occSkills: [{ skill: "Navigation", bonus: 5 }],
      mosSkills: ["Navigation"],
      secondarySkills: ["Navigation", "Intelligence"],
      mosBonusPercent: 10,
      level: 1,
      iqBonusPercent: 0,
      extraBonuses: {},
    });

    const navigationSkills = result.filter((s) => s.name === "Navigation");
    expect(navigationSkills).toHaveLength(1);
    expect(navigationSkills[0].bonus).toBe(10);

    const intelligence = result.find((s) => s.name === "Intelligence");
    expect(intelligence).toBeTruthy();
    expect(intelligence.type).toBe("Other");
  });
});

describe("getSkillSelectionEngine", () => {
  it("returns SouthernCross engine for southern_cross_book4", () => {
    const engine = getSkillSelectionEngine("southern_cross_book4");
    expect(engine.constructor.name).toBe("SouthernCrossSkillSelectionEngine");
  });

  it("returns Book1 engine for other module ids", () => {
    const engine = getSkillSelectionEngine("macross_book1");
    expect(engine.constructor.name).toBe("Book1SkillSelectionEngine");
  });
});
