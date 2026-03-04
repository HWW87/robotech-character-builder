import React from "react";
import PropTypes from "prop-types";
import RetroCard from "./RetroCard";
import alignmentsData from "../data/alignments.json";

/**
 * AlignmentView - Presentational component for alignment selection
 * Per CHARACTER_CREATION_SPEC: Screen G (optional but recommended)
 */
export default function AlignmentView({ selectedAlignment, onSelect }) {
  // Group alignments by moral alignment (Good/Selfish/Evil)
  const goodAlignments = alignmentsData.alignments.filter(a => a.es_bueno);
  const selfishAlignments = alignmentsData.alignments.filter(
    a => !a.es_bueno && !a.es_malvado
  );
  const evilAlignments = alignmentsData.alignments.filter(a => a.es_malvado);

  const renderAlignmentCard = (alignment) => {
    const isSelected = selectedAlignment?.id === alignment.id;
    return (
      <div
        key={alignment.id}
        onClick={() => onSelect(alignment)}
        className={`p-4 rounded border-2 cursor-pointer transition transform hover:scale-105 
          ${
            isSelected
              ? "border-retroblue bg-retroblue bg-opacity-20"
              : "border-gray-400 hover:border-retroblue"
          }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-bold text-sm">{alignment.name_en}</h4>
            <p className="text-xs text-gray-600 italic">{alignment.name_es}</p>
          </div>
          {isSelected && <span className="text-xl">✓</span>}
        </div>
        <p className="text-xs mb-2">{alignment.descripcion_es}</p>
        <div className="text-xs text-gray-600 border-t pt-2 mt-2">
          <p>
            <strong>Filosofía:</strong> {alignment.filosofia_es}
          </p>
          <p className="mt-1">
            <strong>Táctica:</strong> {alignment.comportamiento_tactico_es}
          </p>
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {alignment.etiquetas?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-300 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-retroblue uppercase tracking-widest">
        Step 5: Alignment
      </h2>

      <p className="text-sm text-gray-600 max-w-2xl">
        Your character's moral alignment shapes their decision-making, priorities, and how they interact
        with the world. Choose wisely—alignment can affect your options and relationships within the RDF.
      </p>

      {/* Good Alignments */}
      <RetroCard title="Good Alignments (Heroes & Protectors)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goodAlignments.map(renderAlignmentCard)}
        </div>
      </RetroCard>

      {/* Selfish/Neutral Alignments */}
      <RetroCard title="Selfish/Neutral Alignments (Pragmatists & Mavericks)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selfishAlignments.map(renderAlignmentCard)}
        </div>
      </RetroCard>

      {/* Evil Alignments */}
      <RetroCard title="Evil Alignments (Villains & Destructive Forces)">
        <p className="text-sm text-red-600 mb-4">
          ⚠️ <strong>Warning:</strong> Evil alignments may restrict your options in a military organization.
          Consult your GM before choosing an evil alignment.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evilAlignments.map(renderAlignmentCard)}
        </div>
      </RetroCard>

      {/* Selected Alignment Summary */}
      {selectedAlignment && (
        <div className="bg-retroblue bg-opacity-10 border-2 border-retroblue p-6 rounded">
          <h3 className="font-bold text-lg mb-3 text-retroblue">
            Selected Alignment: {selectedAlignment.name_en}
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Description:</strong> {selectedAlignment.descripcion_es}
            </p>
            <p>
              <strong>Philosophy:</strong> {selectedAlignment.filosofia_es}
            </p>
            <p>
              <strong>Group:</strong>{" "}
              {selectedAlignment.es_bueno
                ? "Good"
                : selectedAlignment.es_malvado
                  ? "Evil"
                  : "Selfish/Neutral"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

AlignmentView.propTypes = {
  selectedAlignment: PropTypes.shape({
    id: PropTypes.string,
    name_en: PropTypes.string,
    name_es: PropTypes.string,
    descripcion_es: PropTypes.string,
    filosofia_es: PropTypes.string,
    comportamiento_tactico_es: PropTypes.string,
    es_bueno: PropTypes.bool,
    es_malvado: PropTypes.bool,
    etiquetas: PropTypes.arrayOf(PropTypes.string),
  }),
  onSelect: PropTypes.func.isRequired,
};
