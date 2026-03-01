import React, { useEffect, useState } from "react";
import RetroCard from "./RetroCard";
import {
  getAllowedSecondarySkills,
  getOtherSkillLimit,
  getAllSkillNames,
} from "../utils/occRules";

export default function SkillManager({ faction, occ, skills, onChange }) {
  const [available, setAvailable] = useState([]);
  const [selected, setSelected] = useState(skills || []);

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

  const addSkill = (s) => {
    if (selected.includes(s)) return;
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

  return (
    <RetroCard title="Skill Selection">
      <div className="flex gap-4">
        <div className="w-1/2">
          <h3 className="font-semibold mb-2">Available Skills</h3>
          <ul className="h-64 overflow-y-auto border p-2 rounded">
            {available.map((s, i) => (
              <li key={i} className="cursor-pointer hover:bg-retrogray p-1"
                  onClick={() => addSkill(s)}>
                {s}
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
          {limit !== Infinity && (
            <p className="mt-2 text-sm">
              Remaining slots: {limit - selected.length} / {limit}
            </p>
          )}
        </div>
      </div>
    </RetroCard>
  );
}

import PropTypes from "prop-types";

SkillManager.propTypes = {
  faction: PropTypes.string,
  skills: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

