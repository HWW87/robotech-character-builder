import React from "react";
import { useNavigate } from "react-router-dom";
import FactionView from "../components/FactionView";
import { useCharacterData } from "../hooks/useCharacterData";

/**
 * Container component para Faction Page.
 * Gestiona lógica: hooks, navegación.
 * Delega presentación a FactionView (presentacional).
 */
export default function FactionPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();

  const selectFaction = (f) => {
    // Update character.personal.faction (per PR#1 structure)
    update("personal", {
      ...character.personal,
      faction: f,
    });
    navigate("/attributes");
  };

  return <FactionView onSelectFaction={selectFaction} />;
}
