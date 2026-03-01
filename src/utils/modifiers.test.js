import { describe, it, expect } from 'vitest';
import { calcModifiers } from './modifiers';

describe('calcModifiers', () => {
  it('returns zero modifiers for low attributes', () => {
    const attrs = { IQ: 10, ME: 10, MA: 10, PS: 10, PP: 10, PE: 10, PB: 10 };
    expect(calcModifiers(attrs)).toEqual({
      skillsBonus: 0,
      saveVsInsanity: 0,
      trustIntimidate: 0,
      handToHandDamage: 0,
      dodgeParryStrike: 0,
      saveComaDeath: 0,
      charmImpress: 0,
    });
  });

  it('computes correct bonuses when thresholds reached', () => {
    const attrs = { IQ: 18, ME: 17, MA: 18, PS: 19, PP: 17, PE: 18, PB: 20 };
    const mods = calcModifiers(attrs);
    expect(mods.skillsBonus).toBe(4); // IQ-14
    expect(mods.saveVsInsanity).toBe(1); // ME-16
    expect(mods.trustIntimidate).toBe(2); // MA-16
    expect(mods.handToHandDamage).toBe(2); // floor((19-15)/2)
    expect(mods.dodgeParryStrike).toBe(0); // floor((17-16)/2)=0
    expect(mods.saveComaDeath).toBe(4); // (18-16)*2
    expect(mods.charmImpress).toBe(20); // (20-16)*5
  });
});
