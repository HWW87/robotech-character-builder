// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FactionView from './FactionView';

describe('FactionView', () => {
  it('renders faction cards and calls callback on click', () => {
    const handle = vi.fn();
    render(<FactionView onSelectFaction={handle} />);
    const rdfCard = screen.getByText(/RDF - Robotech/);
    expect(rdfCard).toBeTruthy();
    fireEvent.click(rdfCard);
    expect(handle).toHaveBeenCalledWith('RDF');
  });
});
