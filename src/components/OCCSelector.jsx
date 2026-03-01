import React, { useState, useEffect } from "react";
import RetroCard from "./RetroCard";
import { getOccByFaction, getOccDetails } from "../utils/occRules";

export default function OCCSelector({ faction, occ, onSelect }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    // always load all OCCs; faction parameter is currently unused but kept
    setList(getOccByFaction(faction));
  }, [faction]);

  return (
    <RetroCard title="Occupational Character Class (O.C.C.)">
      {list.length === 0 ? (
        <p className="italic">No occupational classes defined.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((name) => {
            const det = getOccDetails(name);
            return (
              <div
                key={name}
                className={`p-3 border rounded cursor-pointer transition 
                  ${occ === name ? "border-retroblue bg-retrogray/20" : "hover:shadow-lg"}`}
                onClick={() => onSelect(name)}
              >
                <h4 className="font-semibold mb-1">{det?.name_en || name}</h4>
                <p className="text-sm text-gray-600">
                  {det?.description_es || "(no description)"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </RetroCard>
  );
}

import PropTypes from "prop-types";

OCCSelector.propTypes = {
  faction: PropTypes.string,
  occ: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

