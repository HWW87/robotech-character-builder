import React, { useMemo } from "react";
import SummaryView from "../components/SummaryView";
import { exportCharacter, importCharacter } from "../utils/exportImport";
import { useCharacterData } from "../hooks/useCharacterData";
import { getSkillSelectionEngine } from "../domain/skills/selection-engine";

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
  const moduleId = character.moduleId || "macross_book1";
  const occSkills = character.occ?.occSkills || [];
  const otherSkillsChosen = character.occ?.otherSkillsChosen || [];
  const mosSkills = character.southernCross?.mosSkills || [];
  const mosBonusPercent = character.southernCross?.mosBonusPercent || 0;
  const extraBonuses = character.extraBonuses || {};
  const iqBonusPercent = character.attributeBonuses?.iqBonusPercent; // Per PR#6: pass IQ bonus to skill calc

  const skillEngine = useMemo(() => getSkillSelectionEngine(moduleId), [moduleId]);

  const calculated = useMemo(
    () =>
      skillEngine.selectAndCalculate({
        occSkills,
        secondarySkills: otherSkillsChosen,
        mosSkills,
        mosBonusPercent,
        level,
        extraBonuses,
        iqBonusPercent,
      }),
    [
      skillEngine,
      occSkills,
      otherSkillsChosen,
      mosSkills,
      mosBonusPercent,
      level,
      JSON.stringify(extraBonuses),
      iqBonusPercent,
    ]
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
