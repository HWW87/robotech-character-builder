import React, { useEffect, useState } from "react";
import RetroCard from "./RetroCard";
import {
  getAllowedSecondarySkills,
  getOtherSkillLimit,
  getAllSkillNames,
} from "../utils/occRules";

export default function SkillManager({ faction, occ, skills, blockedSkills = [], onChange }) {
  const [available, setAvailable] = useState([]);
  const [selected, setSelected] = useState(skills || []);

  useEffect(() => {
    setSelected(skills || []);
  }, [skills]);

  useEffect(() => {
    // compute available list any time occupation or faction changes
    if (occ) {
      setAvailable(getAllowedSecondarySkills(occ));
    } else if (faction) {
      // fallback to all skills when OCC not chosen yet
      setAvailable(getAllSkillNames());
    } else {
      setAvailable([]);
    }
  }, [faction, occ]);

  const limit = occ ? getOtherSkillLimit(occ) : Infinity;
  const blockedSet = new Set(blockedSkills || []);

  const addSkill = (s) => {
    if (selected.includes(s)) return;
    if (blockedSet.has(s)) return;
    if (selected.length >= limit) return; // prevent adding beyond limit
    const updated = [...selected, s];
    setSelected(updated);
    onChange(updated);
  };

  const removeSkill = (s) => {
    const updated = selected.filter(x => x !== s);
    setSelected(updated);
    onChange(updated);
  };

  const autoFillSkills = () => {
    // Auto-seleccionar las primeras skills hasta el límite
    const filteredAvailable = available.filter((s) => !blockedSet.has(s));
    const autoSelected = filteredAvailable.slice(0, Math.min(limit, filteredAvailable.length));
    setSelected(autoSelected);
    onChange(autoSelected);
  };

  const clearSkills = () => {
    setSelected([]);
    onChange([]);
  };

  const remaining = Math.max(0, limit - selected.length);

  return (
    <RetroCard title="Skill Selection">
      <div className="mb-4 flex gap-2">
        <button 
          onClick={autoFillSkills}
          disabled={!occ || limit === Infinity}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ⚡ Auto-Fill Skills
        </button>
        <button 
          onClick={clearSkills}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          🗑️ Clear All
        </button>
        {limit !== Infinity && (
          <span className="ml-auto self-center text-sm font-semibold">
            Remaining slots: {remaining} / {limit}
          </span>
        )}
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <h3 className="font-semibold mb-2">Available Skills</h3>
          <ul className="h-64 overflow-y-auto border p-2 rounded">
            {available.map((s, i) => (
              <li key={i} className={`p-1 ${blockedSet.has(s) ? "text-gray-400 cursor-not-allowed" : "cursor-pointer hover:bg-retrogray"}`}
                  onClick={() => addSkill(s)}>
                {s} {blockedSet.has(s) ? "(locked by OCC/MOS)" : ""}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2">
          <h3 className="font-semibold mb-2">Selected Skills</h3>
          <ul className="h-64 overflow-y-auto border p-2 rounded">
            {selected.map((s, i) => (
              <li key={i} className="cursor-pointer hover:bg-red-200 p-1"
                  onClick={() => removeSkill(s)}>
                {s}
              </li>
            ))}
          </ul>

        </div>
      </div>
    </RetroCard>
  );
}

import PropTypes from "prop-types";

SkillManager.propTypes = {
  faction: PropTypes.string,
  skills: PropTypes.array,
  blockedSkills: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

