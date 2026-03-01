import { describe, it, expect } from 'vitest';
import {
  getOccByFaction,
  getOccDetails,
  getAllowedSecondarySkills,
  getOtherSkillLimit,
} from './occRules';

// The JSON file is statically imported, so these tests will exercise our
// filtering logic as well as the structure of the data the user provided.

describe('occRules helpers', () => {
  it('returns a list of OCC names (ignoring faction)', () => {
    const list = getOccByFaction('RDF');
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list).toContain('Destroid Pilot');

    // passing a bogus faction now yields no results
    const list2 = getOccByFaction('FooBar');
    expect(list2).toEqual([]);
  });

  it('lookup by name returns the correct entry', () => {
    const details = getOccDetails('Destroid Pilot');
    expect(details).toBeTruthy();
    expect(details.id).toBe('occ_destroid_pilot');
    expect(details.description_es).toContain('Piloto especializado en Destroids');
  });

  it('returns null for a name that does not exist', () => {
    expect(getOccDetails('Nonexistent OCC')).toBeNull();
  });

  it('other skill limit is read correctly', () => {
    expect(getOtherSkillLimit('Destroid Pilot')).toBe(14);
    expect(getOtherSkillLimit('Veritech Fighter Pilot')).toBe(14);
  });

  it('allowed secondary skills exclude primary occ skills', () => {
    const allowed = getAllowedSecondarySkills('Destroid Pilot');
    expect(allowed).toBeInstanceOf(Array);
    expect(allowed).not.toContain('Automobile'); // normalized primary
    expect(allowed.length).toBeGreaterThan(0);
    // should include something from the Pilot category that is not primary
    expect(allowed).toContain('Jet');
  });
});
