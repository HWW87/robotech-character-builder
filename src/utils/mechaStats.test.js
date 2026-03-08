import { describe, it, expect } from 'vitest';
import { getMechaByName } from './mechaStats';

describe('getMechaByName', () => {
  it('returns null for empty name to avoid phantom selection', () => {
    expect(getMechaByName('')).toBeNull();
    expect(getMechaByName('   ')).toBeNull();
    expect(getMechaByName(null)).toBeNull();
    expect(getMechaByName(undefined)).toBeNull();
  });

  it('returns a mecha for valid names', () => {
    const mecha = getMechaByName('Veritech');
    expect(mecha).toBeTruthy();
  });
});
