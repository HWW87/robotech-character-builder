import { useState, useEffect } from "react";

export const useCharacterData = () => {
  const [character, setCharacter] = useState(() => {
    const saved = localStorage.getItem("robotech_character");
    return saved ? JSON.parse(saved) : {
      name: "",
      faction: "",
      attributes: {
        IQ: 0, ME: 0, MA: 0, PS: 0, PP: 0, PE: 0, PB: 0, Spd: 0
      },
      occ: "",
      skills: [],
      mecha: "",
      modifiers: {}
    };
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
      setCharacter(prev => ({ ...prev, [field]: value }));
    }
  };

  const reset = () => {
    localStorage.removeItem("robotech_character");
    setCharacter({
      name: "",
      faction: "",
      attributes: { IQ: 0, ME: 0, MA: 0, PS: 0, PP: 0, PE: 0, PB: 0, Spd: 0 },
      occ: "",
      skills: [],
      mecha: "",
      modifiers: {}
    });
  };

  return { character, update, reset };
};
