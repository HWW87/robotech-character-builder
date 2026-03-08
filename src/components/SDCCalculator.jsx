import React, { useState } from "react";
import RetroCard from "./RetroCard";
import { getSDCBaseByOcc } from "../domain/vitality/vitality";

/**
 * SDCCalculator - Widget para calcular y mostrar S.D.C.
 * Per CHARACTER_CREATION_SPEC: S.D.C. = Base (by OCC) + Skills bonuses
 */
export default function SDCCalculator({ occId, occName, onSDCChange }) {
  const [skillBonuses, setSkillBonuses] = useState(0);

  // Get base S.D.C. for OCC
  const baseByOcc = getSDCBaseByOcc(occId);
  const totalSDC = baseByOcc + skillBonuses;

  // Handle skill bonus change (e.g., from Boxing)
  const handleSkillBonus = (e) => {
    const bonus = parseInt(e.target.value) || 0;
    setSkillBonuses(Math.max(0, bonus));
    onSDCChange({
      baseByOcc,
      fromSkills: bonus > 0 ? bonus : undefined,
      total: baseByOcc + bonus,
    });
  };

  return (
    <RetroCard title="S.D.C. (Structural Damage Capacity)">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">OCC Base</div>
            <div className="text-2xl font-bold text-retroblue">{baseByOcc}</div>
            <div className="text-xs text-gray-500 mt-1">{occName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Skills</div>
            <input
              type="number"
              value={skillBonuses}
              onChange={handleSkillBonus}
              min="0"
              max="50"
              className="w-16 mx-auto text-center text-xl font-bold bg-retrotext text-retroblue"
            />
          </div>
          <div>
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-retrogreen">{totalSDC}</div>
          </div>
        </div>

        <p className="text-xs text-gray-600 text-center">
          S.D.C. = O.C.C. Base + Skill Bonuses (e.g., Hand to Hand Combat +5)
        </p>

        <div className="bg-retroblue bg-opacity-10 border-l-4 border-retroblue p-2 text-xs">
          💡 <strong>Skill Sources:</strong> Boxing (+2), Martial Arts (+3), etc.
        </div>
      </div>
    </RetroCard>
  );
}
