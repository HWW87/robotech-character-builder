import React from "react";
import RetroCard from "./RetroCard";
import PropTypes from "prop-types";
import mechaData from "../utils/mechaStats";

export default function MechaSelector({ faction, mecha, onSelect }) {
  // Filter mechas by faction (simple era-based mapping)
  const available = mechaData.mecha.filter((m) => {
    if (faction === "RDF") return m.era === "Macross";
    if (faction === "Southern Cross") return m.category === "destroid";
    return true;
  });

  // Find selected mecha details
  const selectedMecha = available.find((m) => m.name_es === mecha);

  return (
    <RetroCard title="Mecha Assignment">
      <div className="space-y-4">
        <select 
          value={mecha} 
          onChange={(e) => onSelect(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Mecha</option>
          {available.map((m) => (
            <option key={m.id} value={m.name_es}>
              {m.name_es}
            </option>
          ))}
        </select>
        
        {selectedMecha && (
          <div className="p-4 bg-gray-100 rounded border border-gray-300">
            <h3 className="font-bold text-lg mb-2">{selectedMecha.name_es}</h3>
            <p className="text-sm text-gray-700 mb-3">
              {selectedMecha.description_es || selectedMecha.description || 'No description available'}
            </p>
            {selectedMecha.stats && (
              <div className="text-xs space-y-1">
                {selectedMecha.stats.crew && (
                  <p><span className="font-semibold">Crew:</span> {selectedMecha.stats.crew}</p>
                )}
                {selectedMecha.stats.speed && (
                  <p><span className="font-semibold">Speed:</span> {selectedMecha.stats.speed}</p>
                )}
                {selectedMecha.stats.armament && (
                  <p><span className="font-semibold">Armament:</span> {selectedMecha.stats.armament}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </RetroCard>
  );
}

MechaSelector.propTypes = {
  faction: PropTypes.string,
  mecha: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

