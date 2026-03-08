import React from "react";
import RetroCard from "./RetroCard";
import { getAllFactions } from "../data/factions";

/**
 * Componente presentacional puro para selección de facción.
 * Solo recibe props, sin lógica de estado o navegación.
 * Renders faction cards with images from centralized FACTIONS configuration.
 */
export default function FactionView({ onSelectFaction }) {
  const factions = getAllFactions();

  return (
    <RetroCard title="Select Faction">
      <p className="mb-4">Choose your military organization:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {factions.map((faction) => (
          <div
            key={faction.id}
            className="p-3 border rounded cursor-pointer hover:shadow-lg transition bg-slate-50 hover:bg-slate-100"
            onClick={() => onSelectFaction(faction.id)}
          >
            <div className="mb-3 h-32 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
              <img
                src={faction.image}
                alt={faction.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-sm">{faction.name}</h3>
            {faction.description && (
              <p className="text-xs text-gray-600 mt-1">{faction.description}</p>
            )}
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

