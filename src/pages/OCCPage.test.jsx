// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

const mockUpdate = vi.fn();
const mockNavigate = vi.fn();
const mockUseCharacterData = vi.fn();
const mockGetOccDetails = vi.fn();

vi.mock("../hooks/useCharacterData", () => ({
  useCharacterData: () => mockUseCharacterData(),
}));

vi.mock("../utils/occRules", () => ({
  getOccDetails: (...args) => mockGetOccDetails(...args),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../components/OCCSelector", () => ({
  default: ({ onSelect }) => (
    <div>
      <button onClick={() => onSelect("Veritech Fighter Pilot")}>Pick Veritech</button>
    </div>
  ),
}));

describe("OCCPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("blocks OCC selection when minimum attributes are not met", async () => {
    const { default: OCCPage } = await import("./OCCPage");

    mockUseCharacterData.mockReturnValue({
      character: {
        personal: { faction: "RDF" },
        occ: { occName: "", occId: "" },
        attributes: { IQ: 6, PP: 10 },
      },
      update: mockUpdate,
    });

    mockGetOccDetails.mockReturnValue({
      name_en: "Veritech Fighter Pilot",
      description_es: "desc",
      attribute_requirements: {
        minimums: { IQ: 8 },
      },
      occ_skills: [],
      other_skills: { select_count: 1 },
    });

    render(<OCCPage />);

    fireEvent.click(screen.getAllByText("Pick Veritech")[0]);

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Attribute requirements not met: IQ: needs 8, have 6/i)
    ).toBeTruthy();
  });

  it("allows OCC selection and shows preferred warning when minimums are met", async () => {
    const { default: OCCPage } = await import("./OCCPage");

    mockUseCharacterData.mockReturnValue({
      character: {
        personal: { faction: "RDF" },
        occ: { occName: "", occId: "" },
        attributes: { IQ: 10, PP: 8 },
      },
      update: mockUpdate,
    });

    mockGetOccDetails.mockReturnValue({
      name_en: "Veritech Fighter Pilot",
      description_es: "desc",
      attribute_requirements: {
        minimums: { IQ: 8 },
        preferred: ["P.P. 9+"],
      },
      occ_skills: [],
      other_skills: { select_count: 1 },
    });

    render(<OCCPage />);

    fireEvent.click(screen.getAllByText("Pick Veritech")[0]);

    expect(mockUpdate).toHaveBeenCalledWith("occ", {
      occName: "Veritech Fighter Pilot",
      occId: "Veritech Fighter Pilot",
    });
    expect(screen.getByText(/Preferred attributes:/i)).toBeTruthy();
    expect(screen.getByText(/PP: preferred 9\+ \(you have 8\)/i)).toBeTruthy();
  });
});
