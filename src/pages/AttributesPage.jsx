import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AttributesView from "../components/AttributesView";
import { useCharacterData } from "../hooks/useCharacterData";
import { calcModifiers } from "../utils/modifiers";

/**
 * Container component para Attributes Page.
 * Gestiona lógica: hooks, memoización, modifiers.
 * Delega presentación a AttributesView (presentacional).
 */
export default function AttributesPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();
  const attrs = character.attributes || {};

  // Memoizar los modificadores para evitar recálculos innecesarios
  const mods = useMemo(() => calcModifiers(attrs), [attrs]);

  const [error, setError] = React.useState("");

  const handleChange = (newAttrs) => {
    // basic validation: all attributes must be positive numbers
    const invalid = Object.values(newAttrs || {}).some(
      (v) => isNaN(v) || Number(v) <= 0
    );
    setError(invalid ? "All attributes must be positive numbers" : "");
    update("attributes", newAttrs);
  };

  // Update modifiers when calculated change
  useEffect(() => {
    if (Object.keys(mods).length > 0) {
      update("modifiers", mods);
    }
  }, [mods, update]);

  const handleNext = () => {
    if (error) return;
    navigate("/occ");
  };

  return (
    <>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <AttributesView
        attributes={character.attributes}
        onAttributeChange={handleChange}
        onNext={handleNext}
      />
    </>
  );
}
