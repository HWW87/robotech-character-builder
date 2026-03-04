import React, { useMemo } from "react";
import SummaryView from "../components/SummaryView";
import { exportCharacter, importCharacter } from "../utils/exportImport";
import { calculateSkills } from "../utils/skillCalculator";
import { useCharacterData } from "../hooks/useCharacterData";

/**
 * Container component para Summary Page.
 * Gestiona lógica: hooks, cálculos, import/export.
 * Delega presentación a SummaryView (presentacional).
 */
export default function SummaryPage() {
  const { character, update, reset } = useCharacterData();

  const [importError, setImportError] = React.useState("");

  const handleImport = (e) => {
    const file = e.target.files[0];
    importCharacter(file, (data, err) => {
      if (err) {
        setImportError("Failed to parse JSON: " + err.message);
      } else {
        setImportError("");
        update(null, data);
      }
    });
  };

  // Extract from new CharacterState structure (per PR#1)
  const level = character.level?.currentLevel || 1;
  const occSkills = character.occ?.occSkills || [];
  const otherSkillsChosen = character.occ?.otherSkillsChosen || [];
  const secondarySkills = []; // Legacy field, now empty
  const extraBonuses = character.extraBonuses || {};

  const calculated = useMemo(
    () => calculateSkills(occSkills, secondarySkills, level, extraBonuses),
    [occSkills, secondarySkills, level, JSON.stringify(extraBonuses)]
  );

  return (
    <>
      {importError && (
        <p className="text-red-500 text-center mb-2">{importError}</p>
      )}
      <SummaryView
        character={character}
        level={level}
        calculated={calculated}
        extraBonuses={extraBonuses}
        onExtraChange={(skill, bonus) =>
          update("extraBonuses", { ...extraBonuses, [skill]: bonus })
        }
        onExport={() => exportCharacter(character)}
        onImport={handleImport}
        onReset={reset}
      />
    </>
  );
}
