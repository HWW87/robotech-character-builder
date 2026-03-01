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

  return (
    <RetroCard title="Mecha Assignment">
      <select value={mecha} onChange={(e) => onSelect(e.target.value)}>
        <option value="">Select Mecha</option>
        {available.map((m) => (
          <option key={m.id} value={m.name_es}>
            {m.name_es}
          </option>
        ))}
      </select>
    </RetroCard>
  );
}

MechaSelector.propTypes = {
  faction: PropTypes.string,
  mecha: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

