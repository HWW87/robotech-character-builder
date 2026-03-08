import React from "react";
import RetroCard from "./RetroCard";

export default function AttributeForm({ attributes, onChange }) {
  const handleChange = (key, val) => {
    const value = parseInt(val) || 0;
    onChange({ ...attributes, [key]: value });
  };

  /**
   * Roll 3d6. If result is 16-18, add 1d6 (exceptional attribute per Robotech spec)
   */
  const roll3d6WithExceptional = () => {
    const base = Math.floor(Math.random() * 6 + 1) +
                 Math.floor(Math.random() * 6 + 1) +
                 Math.floor(Math.random() * 6 + 1);
    
    if (base >= 16 && base <= 18) {
      const bonus = Math.floor(Math.random() * 6 + 1);
      return base + bonus;
    }
    return base;
  };

  const rollAll = () => {
    const newAttrs = {};
    Object.keys(attributes).forEach(k => newAttrs[k] = roll3d6WithExceptional());
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
      <button onClick={rollAll}>🎲 Roll All (3D6 + Exceptional)</button>
    </RetroCard>
  );
}

import PropTypes from "prop-types";

AttributeForm.propTypes = {
  attributes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

