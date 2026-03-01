import React from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterData } from "../hooks/useCharacterData";
import MechaSelector from "../components/MechaSelector";
import mechaData, { getMechaByName } from "../utils/mechaStats";
import RetroCard from "../components/RetroCard";

export default function MechaPage() {
  const { character, update } = useCharacterData();
  const navigate = useNavigate();

  const selected = getMechaByName(character.mecha);

  return (
    <div>
      <MechaSelector
        faction={character.faction}
        mecha={character.mecha}
        onSelect={(val) => update("mecha", val)}
      />

      {selected && (
        <>
          <RetroCard title={selected.name_es}>
            <p className="mb-2 text-sm">{selected.description_es}</p>
            
            {selected.variants_es && (
              <div className="mb-3">
                <h3 className="font-semibold text-xs mb-1">Variants:</h3>
                <ul className="text-xs list-disc pl-4">
                  {selected.variants_es.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-3">
              <h3 className="font-semibold text-xs mb-1">Stats:</h3>
              <ul className="text-xs space-y-1">
                {selected.stats &&
                  Object.entries(selected.stats).map(([k, v]) => {
                    if (typeof v === "object") return null;
                    return (
                      <li key={k}>
                        <strong>{k.replace(/_/g, " ")}:</strong> {String(v)}
                      </li>
                    );
                  })}
              </ul>
            </div>

            {selected.mdc_by_location && (
              <div>
                <h3 className="font-semibold text-xs mb-1">M.D.C. by Location:</h3>
                <div className="text-xs max-h-40 overflow-y-auto border p-2 rounded">
                  <ul className="space-y-1">
                    {Object.entries(selected.mdc_by_location).map(([loc, data]) => (
                      <li key={loc}>
                        <strong>{loc}:</strong> {data.value}
                        {data.each ? " (each)" : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </RetroCard>
        </>
      )}

      <div className="mt-4">
        <button onClick={() => navigate("/summary")}>Next → Summary</button>
      </div>
    </div>
  );
}
