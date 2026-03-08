import React from "react";
import RetroCard from "./RetroCard";
import southernCrossLogo from "../assets/factions/southern_cross_logo.svg";

/**
 * Componente presentacional puro para selección de facción.
 * Solo recibe props, sin lógica de estado o navegación.
 */
export default function FactionView({ onSelectFaction }) {
  const factions = [
    { key: "RDF", label: "RDF - Robotech Defense Force" },
    {
      key: "southern_cross",
      label: "Southern Cross Army",
      logo: southernCrossLogo,
    },
    { key: "zentraedi", label: "Zentraedi Regime" },
    { key: "invid", label: "Invid Collective" },
  ];
  return (
    <RetroCard title="Select Faction">
      <p className="mb-4">Choose your military organization:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {factions.map((f) => (
          <div
            key={f.key}
            className="p-3 border rounded cursor-pointer hover:shadow-lg transition"
            onClick={() => onSelectFaction(f.key)}
          >
            {f.logo && (
              <img
                src={f.logo}
                alt={`${f.label} logo`}
                className="w-12 h-12 object-contain mb-2"
              />
            )}
            {f.label}
          </div>
        ))}
      </div>
    </RetroCard>
  );
}

import PropTypes from "prop-types";

FactionView.propTypes = {
  onSelectFaction: PropTypes.func.isRequired,
};

