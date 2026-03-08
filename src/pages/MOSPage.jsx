import React from "react";
import { useNavigate } from "react-router-dom";
import RetroCard from "../components/RetroCard";
import { useCharacterData } from "../hooks/useCharacterData";
import {
  getMosForOcc,
  getMosById,
  extractOccSkillNames,
  isSouthernCrossModule,
} from "../utils/southernCrossRules";

export default function MOSPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();

  const moduleId = character.moduleId || "macross_book1";
  const occId = character.occ?.occId || "";
  const occSkills = extractOccSkillNames(character.occ?.occSkills || []);
  const mosList = React.useMemo(() => getMosForOcc(occId), [occId]);
  const currentMosId = character.southernCross?.mosId || "";
  const mosSkills = character.southernCross?.mosSkills || [];

  React.useEffect(() => {
    if (!isSouthernCrossModule(moduleId)) {
      navigate("/skills");
    }
  }, [moduleId, navigate]);

  const selectedMos = React.useMemo(() => getMosById(currentMosId), [currentMosId]);

  const handleChooseMos = (mosId) => {
    const mos = getMosById(mosId);
    update("southernCross", {
      ...(character.southernCross || {}),
      mosId,
      mosName: mos?.name || "",
      mosBonusPercent: Number(mos?.bonus_percent || 0),
      mosSkills: [],
    });
  };

  const toggleSkill = (skillName) => {
    if (!selectedMos) return;
    if (occSkills.includes(skillName)) return;

    const current = new Set(mosSkills);
    if (current.has(skillName)) {
      current.delete(skillName);
    } else {
      const pickLimit = Number(selectedMos.selection_rules?.pick || selectedMos.skills?.length || 0);
      if (current.size >= pickLimit) return;
      current.add(skillName);
    }

    update("southernCross", {
      ...(character.southernCross || {}),
      mosId: selectedMos.id,
      mosName: selectedMos.name,
      mosBonusPercent: Number(selectedMos.bonus_percent || 0),
      mosSkills: Array.from(current),
    });
  };

  const canContinue = !selectedMos
    ? false
    : mosSkills.length === Number(selectedMos.selection_rules?.pick || 0);

  return (
    <RetroCard title="Southern Cross MOS Selection">
      <div className="space-y-4">
        <select
          className="w-full p-2 border rounded"
          value={currentMosId}
          onChange={(e) => handleChooseMos(e.target.value)}
        >
          <option value="">Select MOS</option>
          {mosList.map((mos) => (
            <option key={mos.id} value={mos.id}>
              {mos.name} (+{mos.bonus_percent}% MOS)
            </option>
          ))}
        </select>

        {selectedMos && (
          <div>
            <p className="text-sm mb-2">
              Pick {selectedMos.selection_rules?.pick || 0} MOS skills. MOS bonus applies only to these skills.
            </p>
            <ul className="border rounded p-2 space-y-1">
              {(selectedMos.selection_rules?.from || []).map((skill) => {
                const blocked = occSkills.includes(skill);
                const active = mosSkills.includes(skill);
                return (
                  <li
                    key={skill}
                    className={`p-2 rounded ${blocked ? "bg-gray-200 text-gray-500" : "cursor-pointer hover:bg-retrogray"} ${active ? "bg-blue-100" : ""}`}
                    onClick={() => !blocked && toggleSkill(skill)}
                  >
                    {skill} {blocked ? "(already in OCC)" : ""}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => navigate("/occ")}>← Previous</button>
          <button
            onClick={() => navigate("/skills")}
            disabled={!canContinue}
            className="disabled:opacity-50"
          >
            Next → Skills
          </button>
        </div>
      </div>
    </RetroCard>
  );
}
