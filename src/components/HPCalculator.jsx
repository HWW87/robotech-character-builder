import React, { useState } from "react";
import RetroCard from "./RetroCard";

/**
 * HPCalculator - Widget para calcular y mostrar Hit Points
 * Per CHARACTER_CREATION_SPEC: HP = PE + 1d6 (at creation)
 */
export default function HPCalculator({ pe, onHPChange }) {
  const [initialRoll, setInitialRoll] = useState(0);

  // Roll 1d6
  const rollHP = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setInitialRoll(roll);
    const total = pe + roll;
    onHPChange({
      base: pe,
      initialRoll: roll,
      totalAtLevel1: total,
    });
  };

  const totalHP = pe + initialRoll;

  return (
    <RetroCard title="Hit Points">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">PE (Base)</div>
            <div className="text-2xl font-bold text-retroblue">{pe}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">1d6 Roll</div>
            <div className="text-2xl font-bold text-retroyellow">{initialRoll || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-retrogreen">{totalHP || "-"}</div>
          </div>
        </div>

        <p className="text-xs text-gray-600 text-center">
          Hit Points = Physical Endurance + 1d6 roll
        </p>

        <button
          onClick={rollHP}
          className="w-full bg-retroblue hover:bg-blue-900 text-white font-bold py-2 px-4 rounded border border-retrotext"
        >
          🎲 Roll HP (1d6)
        </button>
      </div>
    </RetroCard>
  );
}
