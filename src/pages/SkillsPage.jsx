import React from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterData } from "../hooks/useCharacterData";
import SkillManager from "../components/SkillManager";
import { getOtherSkillLimit } from "../utils/occRules";

export default function SkillsPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const handleSkills = (val) => {
    let msg = "";
    if (!val || val.length === 0) {
      msg = "At least one skill should be chosen";
    } else if (character.occ) {
      const limit = getOtherSkillLimit(character.occ);
      if (val.length > limit) {
        msg = `You may only pick up to ${limit} other skills for this OCC`;
      }
    }
    setError(msg);
    update("skills", val);
  };

  const handleNext = () => {
    if (!character.skills || character.skills.length === 0) {
      setError("At least one skill should be chosen");
      return;
    }
    navigate("/mecha");
  };

  return (
    <>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <SkillManager
        faction={character.faction}
        occ={character.occ}
        skills={character.skills}
        onChange={handleSkills}
      />
      <button onClick={handleNext}>Next → Mecha</button>
    </>
  );
}
