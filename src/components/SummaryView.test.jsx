// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SummaryView from './SummaryView';

// Updated to match new CharacterState structure (per PR#1)
const sampleChar = { 
  personal: { name: 'Test', faction: 'RDF' },
  occ: { occName: 'Destroid Pilot' },
  mecha: { mechaName: 'VF-1A Valkyrie' }
};
const calculated = [
  { name: 'Pilot Jet', type: 'OCC', total: 80, base: 60, bonus: 20, perLevel: 3 },
];

describe('SummaryView', () => {
  it('renders summary and allows adjusting extra bonus', () => {
    const handleExtra = vi.fn();
    render(
      <SummaryView
        character={sampleChar}
        level={1}
        calculated={calculated}
        extraBonuses={{ 'Pilot Jet': 0 }}
        onExtraChange={handleExtra}
        onExport={() => {}}
        onImport={() => {}}
        onReset={() => {}}
      />
    );

    expect(screen.getByText('Test')).toBeTruthy();
    const input = screen.getByTitle('Additional bonus');
    expect(input).toBeTruthy();
    fireEvent.change(input, { target: { value: '5' } });
    expect(handleExtra).toHaveBeenCalledWith('Pilot Jet', 5);
  });
});
