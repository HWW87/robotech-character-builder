import React from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterData } from "../hooks/useCharacterData";
import PersonalDataForm from "../components/PersonalDataForm";

export default function PersonalDataPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();

  // Update character.personal fields (per PR#1 structure)
  const handleDataChange = (field, value) => {
    update("personal", {
      ...character.personal,
      [field]: value,
    });
  };

  const handleNext = () => {
    navigate("/faction");
  };

  return (
    <PersonalDataForm
      characterData={character.personal || {}}
      onDataChange={handleDataChange}
      onNext={handleNext}
    />
  );
}
