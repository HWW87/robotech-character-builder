import React from "react";
import { useNavigate } from "react-router-dom";
import FactionView from "../components/FactionView";
import { useCharacterData } from "../hooks/useCharacterData";
import { getModuleIdByFaction } from "../utils/southernCrossRules";

/**
 * Container component para Faction Page.
 * Gestiona lógica: hooks, navegación.
 * Delega presentación a FactionView (presentacional).
 */
export default function FactionPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();

  const selectFaction = (f) => {
    const moduleId = getModuleIdByFaction(f);

    // Update character.personal.faction (per PR#1 structure)
    update("personal", {
      ...character.personal,
      faction: f,
    });
    update("moduleId", moduleId);

    if (moduleId === "southern_cross_book4") {
      navigate("/army");
      return;
    }

    navigate("/attributes");
  };

  return <FactionView onSelectFaction={selectFaction} />;
}
