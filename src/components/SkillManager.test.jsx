// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SkillManager from './SkillManager';

// smoke test ensuring OCC filtering works in the component

describe('SkillManager component', () => {
  it('shows remaining slots and excludes primary occ skills', () => {
    const handleChange = vi.fn();
    render(
      <SkillManager
        faction="RDF"
        occ="Destroid Pilot"
        skills={[]}
        onChange={handleChange}
      />
    );

    // remaining slots message
    expect(screen.getByText(/Remaining slots:/)).toBeTruthy();
    expect(screen.getByText(/14/)).toBeTruthy();

    // primary skill should not appear in available list (normalized)
    expect(screen.queryByText('Automobile')).toBeNull();

    // click an available skill and ensure onChange called; pick a pilot
    const someSkill = screen.getByText('Jet');
    fireEvent.click(someSkill);
    expect(handleChange).toHaveBeenCalledWith(['Jet']);
  });
});
