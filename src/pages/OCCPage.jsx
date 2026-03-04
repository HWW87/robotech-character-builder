import React from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterData } from "../hooks/useCharacterData";
import OCCSelector from "../components/OCCSelector";
import { getOccDetails } from "../utils/occRules";

export default function OCCPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  // Extract from new CharacterState structure (per PR#1)
  const faction = character.personal?.faction || "";
  const occName = character.occ?.occName || "";

  const handleSelect = (val) => {
    setError(val ? "" : "Occupation must be selected");
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
      {error && <p className="text-red-500 mb-2">{error}</p>}
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
