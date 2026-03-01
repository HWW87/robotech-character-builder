import React from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterData } from "../hooks/useCharacterData";
import PersonalDataForm from "../components/PersonalDataForm";

export default function PersonalDataPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();

  const handleDataChange = (field, value) => {
    update(field, value);
  };

  const handleNext = () => {
    navigate("/faction");
  };

  return (
    <PersonalDataForm
      characterData={character}
      onDataChange={handleDataChange}
      onNext={handleNext}
    />
  );
}
