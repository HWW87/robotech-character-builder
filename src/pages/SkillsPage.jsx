import React from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterData } from "../hooks/useCharacterData";
import SkillManager from "../components/SkillManager";
import { getOtherSkillLimit } from "../utils/occRules";
import { extractOccSkillNames } from "../utils/southernCrossRules";

export default function SkillsPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  // Extract data from new CharacterState structure (per PR#1)
  const faction = character.personal?.faction || "";
  const occName = character.occ?.occName || "";
  const moduleId = character.moduleId || "macross_book1";
  const otherSkillsChosen = character.occ?.otherSkillsChosen || [];
  const occSkillNames = extractOccSkillNames(character.occ?.occSkills || []);
  const mosSkillNames = character.southernCross?.mosSkills || [];
  const blockedSkills = moduleId === "southern_cross_book4"
    ? [...occSkillNames, ...mosSkillNames]
    : occSkillNames;

  const handleSkills = (val) => {
    const sanitized = (val || []).filter((s) => !blockedSkills.includes(s));
    let msg = "";
    if (!sanitized || sanitized.length === 0) {
      msg = "At least one skill should be chosen";
    } else if (occName) {
      const limit = getOtherSkillLimit(occName);
      if (sanitized.length > limit) {
        msg = `You may only pick up to ${limit} other skills for this OCC`;
      }
    }
    setError(msg);
    
    // Update character.occ.otherSkillsChosen (new structure per PR#1)
    update("occ", {
      ...character.occ,
      otherSkillsChosen: sanitized,
    });
  };

  const handleNext = () => {
    if (!otherSkillsChosen || otherSkillsChosen.length === 0) {
      setError("At least one skill should be chosen");
      return;
    }
    navigate("/equipment");
  };

  return (
    <>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <SkillManager
        faction={faction}
        occ={occName}
        skills={otherSkillsChosen}
        blockedSkills={blockedSkills}
        onChange={handleSkills}
      />
      <button onClick={handleNext}>Next → Equipment</button>
    </>
  );
}
