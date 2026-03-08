import React from "react";
import { useNavigate } from "react-router-dom";
import RetroCard from "../components/RetroCard";
import { useCharacterData } from "../hooks/useCharacterData";
import { getSouthernCrossArmies, isSouthernCrossModule } from "../utils/southernCrossRules";

export default function ArmyPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();
  const armies = getSouthernCrossArmies();

  const moduleId = character.moduleId || "macross_book1";
  const currentArmyId = character.southernCross?.armyId || "";

  React.useEffect(() => {
    if (!isSouthernCrossModule(moduleId)) {
      navigate("/attributes");
    }
  }, [moduleId, navigate]);

  const handleSelect = (armyId) => {
    const army = armies.find((a) => a.id === armyId);
    update("southernCross", {
      ...(character.southernCross || {}),
      armyId,
      armyName: army?.name || "",
    });
  };

  return (
    <RetroCard title="Southern Cross Army Selection">
      <div className="space-y-4">
        <p className="text-sm">Select one of the 15 Armies of the Southern Cross.</p>
        <select
          className="w-full p-2 border rounded"
          value={currentArmyId}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">Select Army</option>
          {armies.map((army) => (
            <option key={army.id} value={army.id}>
              {army.name}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button onClick={() => navigate("/faction")}>← Previous</button>
          <button
            onClick={() => navigate("/attributes")}
            disabled={!currentArmyId}
            className="disabled:opacity-50"
          >
            Next → Attributes
          </button>
        </div>
      </div>
    </RetroCard>
  );
}
