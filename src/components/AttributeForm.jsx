import React from "react";
import RetroCard from "./RetroCard";

export default function AttributeForm({ attributes, onChange }) {
  const handleChange = (key, val) => {
    const value = parseInt(val) || 0;
    onChange({ ...attributes, [key]: value });
  };

  const roll = () => Math.floor(Math.random() * 6 + 1) +
                      Math.floor(Math.random() * 6 + 1) +
                      Math.floor(Math.random() * 6 + 1);

  const rollAll = () => {
    const newAttrs = {};
    Object.keys(attributes).forEach(k => newAttrs[k] = roll());
    onChange(newAttrs);
  };

  return (
    <RetroCard title="Attributes">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(attributes).map((attr) => (
          <div key={attr}>
            <label className="block font-semibold mb-1">{attr}</label>
            <input
              type="number"
              value={attributes[attr]}
              onChange={(e) => handleChange(attr, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button onClick={rollAll}>🎲 Roll All (3D6)</button>
    </RetroCard>
  );
}

import PropTypes from "prop-types";

AttributeForm.propTypes = {
  attributes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

