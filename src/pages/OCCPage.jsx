import React from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterData } from "../hooks/useCharacterData";
import OCCSelector from "../components/OCCSelector";
import { getOccDetails } from "../utils/occRules";
import { validateOccAttributeRequirements } from "../domain/occ/occ";

export default function OCCPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const [validationWarnings, setValidationWarnings] = React.useState([]);

  // Extract from new CharacterState structure (per PR#1)
  const faction = character.personal?.faction || "";
  const occName = character.occ?.occName || "";
  const attributes = character.attributes || {};

  const handleSelect = (val) => {
    setError(val ? "" : "Occupation must be selected");
    setValidationWarnings([]);
    
    if (val) {
      // PR#7: Validate attribute requirements when OCC is selected
      const selectedOcc = getOccDetails(val);
      if (selectedOcc?.attribute_requirements) {
        const validation = validateOccAttributeRequirements(
          selectedOcc,
          attributes
        );
        
        if (!validation.isValid) {
          // Show error for unmet required attributes
          const unmet = validation.unmetMinimums
            .map(u => `${u.attribute}: needs ${u.required}, have ${u.actual}`)
            .join("; ");
          setError(`Attribute requirements not met: ${unmet}`);
          setValidationWarnings([]);
          return;
        }
        
        // Show warnings for preferred (non-blocking) attributes
        if (validation.warnings.length > 0) {
          setValidationWarnings(validation.warnings);
        } else {
          setValidationWarnings([]);
        }
      }
    }
    
    // Update entire occ object with new occName
    update("occ", {
      ...character.occ,
      occName: val,
      occId: val, // TODO: map to proper occId from repository
    });
  };

  const handleNext = () => {
    if (!occName) {
      setError("Occupation must be selected");
      return;
    }
    navigate("/skills");
  };

  const selectedDetails = React.useMemo(() => {
    return occName ? getOccDetails(occName) : null;
  }, [occName]);

  return (
    <>
      {error && <p className="text-red-500 mb-2 font-semibold">{error}</p>}
      {validationWarnings.length > 0 && (
        <div className="mb-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-sm">
          <strong>Preferred attributes:</strong>
          <ul className="list-disc list-inside ml-2">
            {validationWarnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      <OCCSelector
        faction={faction}
        occ={occName}
        onSelect={handleSelect}
      />
      {selectedDetails && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-2">
            {selectedDetails.name_en}
          </h3>
          <p className="mb-2">{selectedDetails.description_es}</p>
          
          {/* PR#7: Show attribute requirements if present */}
          {selectedDetails.attribute_requirements && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
              <strong>Attribute Requirements:</strong>
              {selectedDetails.attribute_requirements.minimums && (
                <ul className="list-disc list-inside ml-2">
                  {Object.entries(selectedDetails.attribute_requirements.minimums).map(
                    ([attr, min]) => {
                      const actual = attributes[attr] || 0;
                      const met = actual >= min ? "✓" : "✗";
                      return (
                        <li key={attr}>
                          {attr}: {min}+ (you have {actual}) {met}
                        </li>
                      );
                    }
                  )}
                </ul>
              )}
              {selectedDetails.attribute_requirements.notes && (
                <p className="mt-1 italic text-xs">
                  {selectedDetails.attribute_requirements.notes}
                </p>
              )}
            </div>
          )}
          
          {selectedDetails.occ_skills && (
            <>
              <strong>Pre‑paid skills:</strong>
              <ul className="list-disc list-inside">
                {selectedDetails.occ_skills.map((s, idx) => (
                  <li key={idx}>{s.skill}</li>
                ))}
              </ul>
            </>
          )}
          {selectedDetails.other_skills && (
            <p className="mt-2 italic text-sm">
              Select {selectedDetails.other_skills.select_count} other skills
              {selectedDetails.other_skills.notes
                ? ` (${selectedDetails.other_skills.notes})`
                : ""}
            </p>
          )}
        </div>
      )}
      <button className="mt-4" onClick={handleNext}>Next → Skills</button>
    </>
  );
}
