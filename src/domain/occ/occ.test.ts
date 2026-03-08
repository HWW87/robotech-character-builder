import { describe, expect, it } from "vitest";
import { validateOccAttributeRequirements } from "./occ";

describe("validateOccAttributeRequirements", () => {
  it("blocks OCC when required minimum is not met", () => {
    const result = validateOccAttributeRequirements(
      {
        attribute_requirements: {
          minimums: { IQ: 8 },
        },
      },
      { IQ: 6 }
    );

    expect(result.isValid).toBe(false);
    expect(result.unmetMinimums).toEqual([
      { attribute: "IQ", required: 8, actual: 6 },
    ]);
  });

  it("accepts OCC when required minimums are met", () => {
    const result = validateOccAttributeRequirements(
      {
        attribute_requirements: {
          minimums: { IQ: 8, PP: 7 },
        },
      },
      { IQ: 10, PP: 9 }
    );

    expect(result.isValid).toBe(true);
    expect(result.unmetMinimums).toHaveLength(0);
  });

  it("only warns for parseable preferred thresholds when unmet", () => {
    const result = validateOccAttributeRequirements(
      {
        attribute_requirements: {
          preferred: ["P.P. 9+", "High P.E."],
        },
      },
      { PP: 8, PE: 12 }
    );

    expect(result.warnings).toContain("PP: preferred 9+ (you have 8)");
    expect(result.warnings).toContain("High P.E.");
  });
});
