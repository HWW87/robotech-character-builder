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

  it('shows level-1 breakdown as lvl0*X', () => {
    render(
      <SummaryView
        character={sampleChar}
        level={1}
        calculated={calculated}
        extraBonuses={{ 'Pilot Jet': 0 }}
        onExtraChange={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        onReset={() => {}}
      />
    );

    expect(screen.getAllByText(/lvl0\*3/i).length).toBeGreaterThan(0);
  });

  it('shows level-3 breakdown as lvl2*X', () => {
    render(
      <SummaryView
        character={sampleChar}
        level={3}
        calculated={calculated}
        extraBonuses={{ 'Pilot Jet': 0 }}
        onExtraChange={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        onReset={() => {}}
      />
    );

    expect(screen.getByText(/lvl2\*3/i)).toBeTruthy();
  });

  it('shows missing in catalog indicator for unresolved skills', () => {
    const missingSkill = [
      {
        name: 'Unknown Skill',
        type: 'OCC',
        total: null,
        base: null,
        bonus: 0,
        perLevel: undefined,
        missingInCatalog: true,
      },
    ];

    render(
      <SummaryView
        character={sampleChar}
        level={1}
        calculated={missingSkill}
        extraBonuses={{}}
        onExtraChange={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        onReset={() => {}}
      />
    );

    expect(screen.getAllByText(/Missing in catalog/i).length).toBeGreaterThan(0);
  });

  it('formats breakdown with labeled bonus term', () => {
    const calculatedWithValues = [
      { name: 'Test Skill', type: 'OCC', total: 60, base: 40, bonus: 10, perLevel: 5 },
    ];

    render(
      <SummaryView
        character={sampleChar}
        level={3}
        calculated={calculatedWithValues}
        extraBonuses={{}}
        onExtraChange={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        onReset={() => {}}
      />
    );

    expect(screen.getByText(/\(base 40 \+ bonus 10 \+ lvl2\*5\)/i)).toBeTruthy();
  });

  it('uses skill_id key for manual extra bonus input and keeps value after rerender', () => {
    const handleExtra = vi.fn();
    const withSkillId = [
      {
        name: 'Pilot Jet',
        skill_id: 'PILOT_JET_v1',
        type: 'OCC',
        total: 80,
        base: 60,
        bonus: 20,
        perLevel: 3,
      },
    ];

    const { rerender, container } = render(
      <SummaryView
        character={sampleChar}
        level={1}
        calculated={withSkillId}
        extraBonuses={{ PILOT_JET_v1: 7 }}
        onExtraChange={handleExtra}
        onExport={() => {}}
        onImport={() => {}}
        onReset={() => {}}
      />
    );

    const input = container.querySelector('input[title="Additional bonus"]');
    expect(input).toBeTruthy();
    expect(input.value).toBe('7');

    fireEvent.change(input, { target: { value: '9' } });
    expect(handleExtra).toHaveBeenCalledWith('PILOT_JET_v1', 9);

    rerender(
      <SummaryView
        character={sampleChar}
        level={1}
        calculated={withSkillId}
        extraBonuses={{ PILOT_JET_v1: 9 }}
        onExtraChange={handleExtra}
        onExport={() => {}}
        onImport={() => {}}
        onReset={() => {}}
      />
    );

    const rerenderedInput = container.querySelector('input[title="Additional bonus"]');
    expect(rerenderedInput).toBeTruthy();
    expect(rerenderedInput.value).toBe('9');
  });
});
