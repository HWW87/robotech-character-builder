import React from "react";
import RetroCard from "./RetroCard";
import { getFactionById } from "../data/factions";
import portraitPlaceholder from "../assets/portrait_placeholder.png";

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
  onExit,
}) {
  const levelDelta = Math.max(0, (level || 1) - 1);

  // Helper to get initials from name for fallback portrait
  const getInitials = (name) => {
    if (!name || name === "—") return "??";
    return name
      .split(" ")
      .map((word) => word[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Get portrait: prioritize photoBase64, fallback to photo, then placeholder
  const getPortraitSrc = () => {
    const photoBase64 = character.personal?.photoBase64;
    const photo = character.personal?.photo;
    
    if (photoBase64 && photoBase64.startsWith("data:image")) {
      return photoBase64;
    }
    if (photo && photo.startsWith("data:image")) {
      return photo;
    }
    return portraitPlaceholder;
  };

  // Check if we have a real portrait or should show initials
  const hasRealPortrait = () => {
    const photoBase64 = character.personal?.photoBase64;
    const photo = character.personal?.photo;
    return (
      (photoBase64 && photoBase64.startsWith("data:image")) ||
      (photo && photo.startsWith("data:image"))
    );
  };

  const formatBreakdown = (skill, baseWithoutExtra) => {
    if (skill.missingInCatalog) {
      return "Missing in catalog";
    }

    const parts = [`base ${skill.base}`, `bonus ${baseWithoutExtra}`];
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

  // Get faction config once to avoid multiple calls
  const factionConfig = React.useMemo(() => {
    return character.personal?.faction 
      ? getFactionById(character.personal.faction) 
      : null;
  }, [character.personal?.faction]);

  return (
    <div className="p-6">
      <RetroCard title="Character Summary">
        <div className="bg-white p-6 rounded-xl shadow-lg text-sm relative">
          {/* Mobile-only Exit Button */}
          {onExit && (
            <button
              onClick={onExit}
              className="sm:hidden absolute top-4 right-4 px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-sm"
              aria-label="Salir"
            >
              Salir
            </button>
          )}
          
          {/* Character Sheet Header: Portrait + Info + Faction Emblem */}
          <div className="flex items-start gap-4 mb-6 pb-4 border-b-2 border-gray-300">
            {/* Left: Character Portrait */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 rounded-lg border-2 border-gray-400 overflow-hidden bg-gray-100">
                {hasRealPortrait() ? (
                  <img
                    src={getPortraitSrc()}
                    alt={`${character.personal?.name || "Character"} portrait`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 font-bold text-xl">
                    {getInitials(character.personal?.name)}
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Character Info */}
            <div className="flex-grow">
              <h2 className="text-lg font-bold mb-1">
                {character.personal?.name || "Unnamed Character"}
              </h2>
              <div className="grid grid-cols-2 gap-x-4 text-xs">
                <div>
                  <p>
                    <strong>Level:</strong> {level || 1}
                  </p>
                  <p>
                    <strong>O.C.C.:</strong> {character.occ?.occName || "—"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Alignment:</strong>{" "}
                    {character.alignment?.alignmentName || character.alignment || "—"}
                  </p>
                  <p>
                    <strong>Faction:</strong>{" "}
                    {factionConfig?.name || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Faction Emblem */}
            {factionConfig && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded border-2 border-gray-400 overflow-hidden bg-white p-1">
                  <img
                    src={factionConfig.image}
                    alt={`${factionConfig.name} emblem`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Previous character details section - now secondary */}
          <div className="grid grid-cols-2 mb-4 text-xs">
            <div>
              <p>
                <strong>Age:</strong> {character.personal?.age || "—"}
              </p>
              <p>
                <strong>Rank:</strong> {character.personal?.rank || "—"}
              </p>
            </div>
            <div>
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
                const skillKey = s.skillId ?? s.skill_id ?? s.name;
                const extra = extraBonuses[skillKey] || 0;
                const baseWithoutExtra = s.bonus - extra;
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
                          {formatBreakdown(s, baseWithoutExtra)}
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
  onExit: PropTypes.func,
};

