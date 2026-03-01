import React from "react";
import RetroCard from "./RetroCard";

/**
 * Componente presentacional puro para selección de facción.
 * Solo recibe props, sin lógica de estado o navegación.
 */
export default function FactionView({ onSelectFaction }) {
  const factions = [
    { key: "RDF", label: "RDF - Robotech Defense Force" },
    { key: "Southern Cross", label: "Southern Cross Army" },
    { key: "Zentraedi", label: "Zentraedi Regime" },
    { key: "Invid", label: "Invid Collective" },
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

