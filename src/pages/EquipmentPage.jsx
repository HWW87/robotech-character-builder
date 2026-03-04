import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EquipmentView from "../components/EquipmentView";
import { useCharacterData } from "../hooks/useCharacterData";
import { buildEquipmentData, generatePersonalSavings } from "../domain/equipment/equipment";

/**
 * EquipmentPage - Step 4: Equipment & Credits
 * Position in flow: After Skills, before Mecha (or before Summary)
 * 
 * Per CHARACTER_CREATION_SPEC Screen F:
 * - Display standard equipment by OCC
 * - Calculate monthly wages based on level
 * - Roll personal savings (2d6 × 100)
 */
export default function EquipmentPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();

  // Extract character data (new structure per PR#1)
  const occId = character.occ?.occId || "";
  const level = character.level?.currentLevel || 1;
  const currentEquipment = character.equipment;

  // Auto-generate equipment data on first visit if not already set
  useEffect(() => {
    if (occId && (!currentEquipment || !currentEquipment.standardEquipment?.length)) {
      const equipmentData = buildEquipmentData(occId, level);
      update("equipment", equipmentData);
    }
  }, [occId, level, currentEquipment, update]);

  // Handle re-roll of personal savings
  const handleRerollSavings = () => {
    const newSavings = generatePersonalSavings(occId);
    update("equipment", {
      ...currentEquipment,
      personalSavings: newSavings,
    });
  };

  // Navigation
  const handleNext = () => {
    navigate("/mecha");
  };

  const handlePrev = () => {
    navigate("/skills");
  };

  return (
    <>
      <EquipmentView
        standardEquipment={currentEquipment?.standardEquipment || []}
        wages={currentEquipment?.wages}
        personalSavings={currentEquipment?.personalSavings}
        onRerollSavings={handleRerollSavings}
      />

      {/* Navigation */}
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={handlePrev}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded border border-retrotext"
        >
          ← Previous (Skills)
        </button>
        <button
          onClick={handleNext}
          className="bg-retrogreen hover:bg-green-900 text-white font-bold py-2 px-6 rounded border border-retrotext"
        >
          Next (Mecha) →
        </button>
      </div>
    </>
  );
}
