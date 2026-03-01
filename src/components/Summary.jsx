import React from "react";
import RetroCard from "./RetroCard";
import { exportCharacter, importCharacter } from "../utils/exportImport";

export default function Summary({ character, reset, update }) {
  const handleImport = (e) => {
    const file = e.target.files[0];
    importCharacter(file, (data) => update(null, data));
  };

  const attr = character.attributes || {};
  const mods = character.modifiers || {};

  return (
    <RetroCard title="Character Sheet">
      <div className="bg-white p-6 rounded-xl shadow-lg text-sm">
        {/* ENCABEZADO */}
        <div className="grid grid-cols-2 mb-6">
          <div>
            <p><strong>Name:</strong> {character.name || "—"}</p>
            <p><strong>Faction:</strong> {character.faction || "—"}</p>
            <p><strong>O.C.C.:</strong> {character.occ || "—"}</p>
          </div>
          <div>
            <p><strong>Mecha:</strong> {character.mecha || "—"}</p>
            <p><strong>Skills:</strong> {character.skills?.length || 0}</p>
          </div>
        </div>

        {/* ATRIBUTOS */}
        <div className="border-t border-b border-gray-300 py-4 mb-6">
          <h3 className="font-semibold text-lg mb-2 text-retroblue">Attributes</h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(attr).map(([key, val]) => (
              <div key={key}>
                <p className="text-xs uppercase">{key}</p>
                <p className="font-mono text-lg">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MODIFICADORES */}
        <div className="border-b border-gray-300 py-4 mb-6">
          <h3 className="font-semibold text-lg mb-2 text-retroblue">Modifiers</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(mods).map(([key, val]) => (
              <div key={key}>
                <p className="text-xs">{key}</p>
                <p className="font-mono">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SKILLS */}
        <div className="py-4">
          <h3 className="font-semibold text-lg mb-2 text-retroblue">Skills</h3>
          <ul className="list-disc pl-6 text-sm space-y-1">
            {character.skills?.length ? (
              character.skills.map((s, i) => <li key={i}>{s}</li>)
            ) : (
              <p>No skills selected.</p>
            )}
          </ul>
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex gap-4 mt-6">
        <button onClick={() => exportCharacter(character)}>💾 Export JSON</button>
        <label className="cursor-pointer">
          📂 Import
          <input type="file" className="hidden" onChange={handleImport} />
        </label>
        <button onClick={reset}>🔁 Reset</button>
      </div>
    </RetroCard>
  );
}
