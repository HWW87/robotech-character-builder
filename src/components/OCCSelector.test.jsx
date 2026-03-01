// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OCCSelector from './OCCSelector';

// Simple smoke test ensuring selectors list values from occ_rdf.json

describe('OCCSelector', () => {
  it('renders cards for each OCC and allows selection', () => {
    const handle = vi.fn();
    render(<OCCSelector faction="RDF" occ="" onSelect={handle} />);

    // expect at least one of the known occ names appears
    expect(screen.getByText('Destroid Pilot')).toBeTruthy();

    // click that card and verify callback
    fireEvent.click(screen.getByText('Destroid Pilot'));
    expect(handle).toHaveBeenCalledWith('Destroid Pilot');
  });
});
