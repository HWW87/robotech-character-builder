import { describe, it, expect, vi } from 'vitest';
import { calculateSkills } from './skillCalculator';

// Use real skill names present in src/data/skills_rdf.json
describe('calculateSkills', () => {
  it('combines OCC and secondary skills correctly using normalized names', () => {
    // use an OCC skill that exists in json as "Jet" (Pilot prefix is handled by normalization)
    const occ = [{ name: 'Pilot Jet', bonus: 5 }];
    const sec = [{ name: 'Computer Operation' }];
    const result = calculateSkills(occ, sec, 3);

    // occ skill: base60 + bonus5 + perLevel*4*(level-1)=60+5+8=73
    // FIX 3: secondary skill also advances by level: base60 + 0 + perLevel*5*(level-1)=60+0+10=70
    expect(result).toEqual([
      expect.objectContaining({ name: 'Jet', total: 73, type: 'OCC' }),
      expect.objectContaining({ name: 'Computer Operation', total: 70, type: 'Secondary' }),
    ]);
  });

  it('applies extra manual bonuses', () => {
    const occ = [{ name: 'Pilot Jet', bonus: 5 }];
    const sec = [];
    const extra = { 'Pilot Jet': 10 };
    const res = calculateSkills(occ, sec, 1, extra);
    // base 60 + occ bonus 5 + extra 10 = 75
    expect(res[0].total).toBe(75);
  });

  it('applies iqBonusPercent one-time to base skill value', () => {
    const occ = [{ name: 'Pilot Jet', bonus: 5 }];
    const sec = [];
    const extra = {};
    const iqBonusPercent = 10;
    const res = calculateSkills(occ, sec, 1, extra, iqBonusPercent);

    // base 60 + occ bonus 5 + iqBonus(60*10%=6) = 71
    expect(res[0].iqBonus).toBe(6);
    expect(res[0].total).toBe(71);
  });

  it('flags missing skills and emits warning instead of silently defaulting', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const occ = [{ name: 'Skill That Does Not Exist', bonus: 15 }];
    const result = calculateSkills(occ, [], 1);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        name: 'Skill That Does Not Exist',
        missingInCatalog: true,
        base: null,
        perLevel: undefined,
        total: null,
        bonus: 15,
      })
    );
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
