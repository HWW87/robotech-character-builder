// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import MechaSelector from "./MechaSelector";

afterEach(() => {
  cleanup();
});

describe("MechaSelector Southern Cross filters", () => {
  it("filters to veritech for ATAC OCC", () => {
    const onSelect = vi.fn();

    render(
      <MechaSelector
        faction="southern_cross"
        moduleId="southern_cross_book4"
        occName="ATAC Pilot"
        mecha=""
        onSelect={onSelect}
      />
    );

    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map((o) => o.textContent);

    expect(options.some((name) => name.includes("Veritech"))).toBe(true);
    expect(options.some((name) => name.includes("Destroid"))).toBe(false);
  });

  it("filters to destroid for TASC OCC", () => {
    const onSelect = vi.fn();

    render(
      <MechaSelector
        faction="southern_cross"
        moduleId="southern_cross_book4"
        occName="TASC Operator"
        mecha=""
        onSelect={onSelect}
      />
    );

    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map((o) => o.textContent);

    expect(options.some((name) => name.includes("Destroid"))).toBe(true);
    expect(options.some((name) => name.includes("Veritech"))).toBe(false);
  });
});
