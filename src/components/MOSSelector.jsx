import React from "react";
import PropTypes from "prop-types";
import RetroCard from "./RetroCard";

export default function MOSSelector({ mosList, selectedMosId, onSelect }) {
  return (
    <RetroCard title="MOS">
      <select
        className="w-full p-2 border rounded"
        value={selectedMosId}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select MOS</option>
        {mosList.map((mos) => (
          <option key={mos.id} value={mos.id}>
            {mos.name}
          </option>
        ))}
      </select>
    </RetroCard>
  );
}

MOSSelector.propTypes = {
  mosList: PropTypes.array.isRequired,
  selectedMosId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};
