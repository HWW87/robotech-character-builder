import React from "react";
import { useNavigate } from "react-router-dom";
import HPCalculator from "../components/HPCalculator";
import SDCCalculator from "../components/SDCCalculator";
import { useCharacterData } from "../hooks/useCharacterData";

/**
 * VitalityPage - Step 3: HP + S.D.C. Calculation
 * Posición en flujo: Después de Attributes, antes de OCC Selection
 * 
 * Per CHARACTER_CREATION_SPEC Screen C:
 * - User rolls 1d6 for HP (added to PE)
 * - System calculates S.D.C. based on OCC
 * - User can add skill bonuses (e.g., from Boxing)
 */
export default function VitalityPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();

  // Current character data
  const pe = character.attributes?.PE || 10;
  const occId = character.occ?.occId || "";
  const occName = character.occ?.occName || "Unknown O.C.C.";
  const currentVitality = character.vitality || {};

  // Handle HP change
  const handleHPChange = (hitPoints) => {
    update("vitality", {
      ...currentVitality,
      hitPoints,
    });
  };

  // Handle S.D.C. change
  const handleSDCChange = (sdc) => {
    update("vitality", {
      ...currentVitality,
      sdc,
    });
  };

  // Navigation
  const handleNext = () => {
    // Validate that HP and S.D.C. have been rolled/set
    if (!currentVitality.hitPoints?.totalAtLevel1 || !currentVitality.sdc?.total) {
      alert("Please roll HP and set S.D.C. before continuing.");
      return;
    }
    navigate("/occ");
  };

  const handlePrev = () => {
    navigate("/attributes");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-retroblue uppercase tracking-widest">
        Step 3: Vitality
      </h2>

      <HPCalculator pe={pe} onHPChange={handleHPChange} />

      <SDCCalculator occId={occId} occName={occName} onSDCChange={handleSDCChange} />

      {/* Summary */}
      <div className="bg-retroblue bg-opacity-10 border border-retroblue p-4 rounded">
        <h3 className="font-bold mb-2">Vitality Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Hit Points</div>
            <div className="text-lg font-bold">
              {currentVitality.hitPoints?.totalAtLevel1 || "—"}
            </div>
          </div>
          <div>
            <div className="text-gray-600">S.D.C.</div>
            <div className="text-lg font-bold">
              {currentVitality.sdc?.total || "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handlePrev}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded border border-retrotext"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-retrogreen hover:bg-green-900 text-white font-bold py-2 px-6 rounded border border-retrotext"
        >
          Next (O.C.C.) →
        </button>
      </div>
    </div>
  );
}
