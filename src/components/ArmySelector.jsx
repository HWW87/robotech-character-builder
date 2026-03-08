import React from "react";
import PropTypes from "prop-types";
import RetroCard from "./RetroCard";

export default function ArmySelector({ armies, selectedArmyId, onSelect }) {
  return (
    <RetroCard title="Southern Cross Army">
      <select
        className="w-full p-2 border rounded"
        value={selectedArmyId}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select Army</option>
        {armies.map((army) => (
          <option key={army.id} value={army.id}>
            {army.name}
          </option>
        ))}
      </select>
    </RetroCard>
  );
}

ArmySelector.propTypes = {
  armies: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string.isRequired })
  ).isRequired,
  selectedArmyId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};
