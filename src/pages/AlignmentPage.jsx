import React from "react";
import { useNavigate } from "react-router-dom";
import AlignmentView from "../components/AlignmentView";
import { useCharacterData } from "../hooks/useCharacterData";
import alignmentsData from "../data/alignments.json";

/**
 * AlignmentPage - Step 5: Alignment Selection (Optional)
 * Position in flow: After Mecha, before Summary
 * 
 * Per CHARACTER_CREATION_SPEC Screen G:
 * - User selects alignment from 9 Palladium alignments
 * - Affects character behavior, decisions, and reactions
 */
export default function AlignmentPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();

  // Extract current alignment (new structure per PR#1)
  const currentAlignmentId = character.alignment?.alignmentId;
  const selectedAlignment = alignmentsData.alignments.find(
    (a) => a.id === currentAlignmentId
  );

  // Handle alignment selection
  const handleSelect = (alignment) => {
    // Map alignment es_bueno/es_malvado to AlignmentGroup
    const alignmentGroup = alignment.es_bueno
      ? "Good"
      : alignment.es_malvado
        ? "Evil"
        : "Selfish";

    update("alignment", {
      alignmentId: alignment.id,
      alignmentName: alignment.name_en,
      alignmentGroup,
    });
  };

  // Navigation
  const handleNext = () => {
    navigate("/summary");
  };

  const handlePrev = () => {
    navigate("/mecha");
  };

  return (
    <>
      <AlignmentView selectedAlignment={selectedAlignment} onSelect={handleSelect} />

      {/* Navigation */}
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={handlePrev}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded border border-retrotext"
        >
          ← Previous (Mecha)
        </button>
        <button
          onClick={handleNext}
          className="bg-retrogreen hover:bg-green-900 text-white font-bold py-2 px-6 rounded border border-retrotext"
        >
          Next (Summary) →
        </button>
      </div>
    </>
  );
}
