import { useState, useEffect } from "react";

/**
 * Default CharacterState per CHARACTER_CREATION_SPEC
 * Estructura jerárquica completa con todas las secciones del spec
 */
const DEFAULT_CHARACTER_STATE = {
  personal: {
    name: "",
    age: undefined,
    rank: undefined,
    faction: "",
    photoBase64: "", // Character portrait as base64 data URL
  },
  level: {
    currentLevel: 1,
  },
  attributes: {
    IQ: 0,
    ME: 0,
    MA: 0,
    PS: 0,
    PP: 0,
    PE: 0,
    PB: 0,
    Spd: 0,
  },
  attributeBonuses: {
    iqBonusPercent: undefined,
  },
  vitality: {
    hitPoints: {
      base: 0, // PE value
      initialRoll: 0, // 1d6
      totalAtLevel1: 0,
    },
    sdc: {
      baseByOcc: 0,
      fromSkills: 0,
      total: 0,
    },
  },
  occ: {
    occId: "",
    occName: "",
    occSkills: [],
    otherSkillsChosen: [],
  },
  skills: {
    calculatedSkills: [],
    globalSkillBonuses: {
      iqBonusPercent: undefined,
    },
  },
  equipment: {
    standardEquipment: [],
    wages: undefined,
    personalSavings: undefined,
  },
  alignment: undefined, // Optional, filled in step 5
  mecha: undefined, // Optional, filled in step 6
};

export const useCharacterData = () => {
  const [character, setCharacter] = useState(() => {
    const saved = localStorage.getItem("robotech_character");
    if (!saved) {
      return { ...DEFAULT_CHARACTER_STATE };
    }

    try {
      const parsed = JSON.parse(saved);
      // Migrate legacy format if needed (for backward compatibility)
      return migrateCharacter(parsed);
    } catch (e) {
      console.error("Failed to parse saved character", e);
      return { ...DEFAULT_CHARACTER_STATE };
    }
  });

  // Debounced persist to localStorage to reduce write frequency
  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem("robotech_character", JSON.stringify(character));
    }, 400);

    return () => clearTimeout(id);
  }, [character]);

  // Ensure latest state is flushed when the page/tab is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem("robotech_character", JSON.stringify(character));
      } catch (e) {
        /* ignore */
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [character]);

  const update = (field, value) => {
    // if field is null or undefined, replace the whole character object
    if (field === null || typeof field === "undefined") {
      setCharacter(value);
    } else {
      setCharacter((prev) => ({ ...prev, [field]: value }));
    }
  };

  const reset = () => {
    localStorage.removeItem("robotech_character");
    setCharacter({ ...DEFAULT_CHARACTER_STATE });
  };

  return { character, update, reset };
};

/**
 * Migrate legacy character format to new CharacterState shape
 * Called on load if localStorage has old format
 */
function migrateCharacter(legacy) {
  // If already in new format, check if faction needs to be migrated
  if (legacy.personal && legacy.vitality && legacy.equipment) {
    // Ensure faction is in personal object (may be missing in some versions)
    if (!legacy.personal.faction && legacy.faction) {
      legacy.personal.faction = legacy.faction;
    }
    return legacy;
  }

  // Otherwise, map legacy fields to new structure
  return {
    personal: {
      name: legacy.name || "",
      age: legacy.age,
      rank: legacy.rank,
      faction: legacy.faction || legacy.personal?.faction || "",
    },
    level: {
      currentLevel: legacy.level || 1,
    },
    attributes: legacy.attributes || {
      IQ: 0,
      ME: 0,
      MA: 0,
      PS: 0,
      PP: 0,
      PE: 0,
      PB: 0,
      Spd: 0,
    },
    attributeBonuses: legacy.attributeBonuses || { iqBonusPercent: undefined },
    vitality: legacy.vitality || { hitPoints: { base: 0, initialRoll: 0, totalAtLevel1: 0 }, sdc: { baseByOcc: 0, fromSkills: 0, total: 0 } },
    occ: legacy.occ || {
      occId: "",
      occName: legacy.occName || "",
      occSkills: [],
      otherSkillsChosen: legacy.skills || [],
    },
    skills: legacy.skills_data || {
      calculatedSkills: [],
      globalSkillBonuses: { iqBonusPercent: undefined },
    },
    equipment: legacy.equipment || {
      standardEquipment: [],
      wages: undefined,
      personalSavings: undefined,
    },
    alignment: legacy.alignment,
    mecha: legacy.mecha,
  };
}
