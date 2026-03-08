import React from "react";
import RetroCard from "./RetroCard";

/**
 * Componente presentacional puro para mostrar resumen de personaje.
 * Solo recibe props, sin dependencias de hooks de negocio.
 * Fácil de testear y reutilizar.
 */
export default function SummaryView({
  character,
  level,
  calculated,
  extraBonuses = {},
  onExtraChange = () => {},
  onExport,
  onImport,
  onReset,
}) {
  const levelDelta = Math.max(0, (level || 1) - 1);

  const formatBreakdown = (skill) => {
    if (skill.missingInCatalog) {
      return "Missing in catalog";
    }

    const parts = [`base ${skill.base}`, `bonus ${skill.bonus}`];
    if (
      skill.hasPerLevelTerm !== false &&
      typeof skill.perLevel !== "undefined" &&
      skill.perLevel !== null &&
      skill.perLevel > 0
    ) {
      parts.push(`lvl${levelDelta}*${skill.perLevel}`);
    }
    return `(${parts.join(" + ")})`;
  };

  return (
    <div className="p-6">
      <RetroCard title="Character Summary">
        <div className="bg-white p-6 rounded-xl shadow-lg text-sm">
          <div className="grid grid-cols-2 mb-4">
            <div>
              <p>
                <strong>Name:</strong> {character.personal?.name || "—"}
              </p>
              <p>
                <strong>Faction:</strong> {character.personal?.faction || "—"}
              </p>
              <p>
                <strong>O.C.C.:</strong> {character.occ?.occName || "—"}
              </p>
            </div>
            <div>
              <p>
                <strong>Level:</strong> {level}
              </p>
              <p>
                <strong>Mecha:</strong> {character.mecha?.mechaName || "—"}
              </p>
            </div>
          </div>

          <div className="border-t border-b border-gray-300 py-4 mb-4">
            <h3 className="font-semibold text-lg mb-2 text-retroblue">
              Final Skills
            </h3>
            {calculated.length > 0 ? (
              calculated.map((s, i) => {
                const skillKey = s.skill_id ?? s.name;
                const extra = extraBonuses[skillKey] || 0;
                return (
                  <div
                    key={i}
                    className="flex justify-between border-b border-gray-200 py-1 items-center"
                  >
                    <span>
                      {s.name} ({s.type})
                      {s.missingInCatalog && (
                        <span className="ml-2 text-xs text-red-600 font-semibold">
                          Missing in catalog
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-2">
                      <span>
                        {s.total !== null && typeof s.total !== "undefined" ? `${s.total}%` : "—"}{" "}
                        <span className="text-xs text-gray-400">
                          {formatBreakdown(s)}
                        </span>
                      </span>
                      <input
                        type="number"
                        className="w-12 text-xs border rounded p-1"
                        value={extra}
                        onChange={(e) =>
                          onExtraChange(skillKey, Number(e.target.value) || 0)
                        }
                        title="Additional bonus"
                      />
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="italic text-gray-500 text-center">
                No skills loaded.
              </p>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <button onClick={onExport}>💾 Export JSON</button>
            <label className="cursor-pointer">
              📂 Import
              <input
                type="file"
                className="hidden"
                onChange={onImport}
                accept=".json"
              />
            </label>
            <button onClick={onReset}>🔁 Reset</button>
          </div>
        </div>
      </RetroCard>
    </div>
  );
}

import PropTypes from "prop-types";

SummaryView.propTypes = {
  character: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  calculated: PropTypes.array.isRequired,
  extraBonuses: PropTypes.object,
  onExtraChange: PropTypes.func,
  onExport: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

