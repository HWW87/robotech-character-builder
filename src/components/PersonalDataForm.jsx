import React, { useState } from "react";
import PropTypes from "prop-types";
import RetroCard from "./RetroCard";
import alignmentsData from "../data/alignments.json";

export default function PersonalDataForm({
  characterData,
  onDataChange,
  onNext,
}) {
  const [previewUrl, setPreviewUrl] = useState(characterData?.photo || "");
  const [errors, setErrors] = useState({});

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png|bmp|webp)/)) {
      setErrors((prev) => ({
        ...prev,
        photo: "Solo se permiten: JPG, PNG, BMP, WebP",
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: "La imagen no puede exceder 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setPreviewUrl(base64);
      onDataChange("photo", base64);
      setErrors((prev) => {
        const { photo, ...rest } = prev;
        return rest;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field, value) => {
    onDataChange(field, value);
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!characterData?.name?.trim()) newErrors.name = "Nombre requerido";
    if (!characterData?.alignment) newErrors.alignment = "Alineamiento requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext?.();
    }
  };

  const selectedAlignment = alignmentsData.alignments.find(
    (a) => a.id === characterData?.alignment
  );

  return (
    <div className="w-full">
      <RetroCard title="Datos Personales del Personaje">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Foto Section - Top Right */}
          <div className="lg:col-span-1 flex flex-col items-center gap-2">
            <div className="w-32 h-40 border-2 border-retrogray bg-retrobg flex items-center justify-center rounded overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-xs text-gray-500 p-2">
                  Sin foto
                </div>
              )}
            </div>
            <label className="text-xs cursor-pointer hover:text-retroblue">
              <span className="underline">Subir foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            {errors.photo && (
              <p className="text-xs text-red-500">{errors.photo}</p>
            )}
          </div>

          {/* Form Fields - Left */}
          <div className="lg:col-span-3 space-y-3">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={characterData?.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Max Sterling"
                className={`w-full px-2 py-1 bg-retrotext text-retrobg border border-retrogray rounded text-sm ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Apodo */}
            <div>
              <label className="block text-xs font-semibold mb-1">Apodo</label>
              <input
                type="text"
                value={characterData?.nickname || ""}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                placeholder="Ej: Ace"
                className="w-full px-2 py-1 bg-retrotext text-retrobg border border-retrogray rounded text-sm"
              />
            </div>

            {/* Orden de Nacimiento */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Orden de Nacimiento
                </label>
                <select
                  value={characterData?.birthOrder || ""}
                  onChange={(e) => handleInputChange("birthOrder", e.target.value)}
                  className="w-full px-2 py-1 bg-retrotext text-retrobg border border-retrogray rounded text-sm"
                >
                  <option value="">Seleccionar</option>
                  <option value="primogenito">Primogénito</option>
                  <option value="segundogenito">Segundogénito</option>
                  <option value="benjamín">Benjamín</option>
                  <option value="unico">Único</option>
                </select>
              </div>

              {/* Edad */}
              <div>
                <label className="block text-xs font-semibold mb-1">Edad</label>
                <input
                  type="number"
                  value={characterData?.age || ""}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  min="15"
                  max="80"
                  placeholder="Ej: 25"
                  className="w-full px-2 py-1 bg-retrotext text-retrobg border border-retrogray rounded text-sm"
                />
              </div>
            </div>

            {/* Alineamiento */}
            <div>
              <label className="block text-xs font-semibold mb-1">
                Alineamiento *
              </label>
              <select
                value={characterData?.alignment || ""}
                onChange={(e) => handleInputChange("alignment", e.target.value)}
                className={`w-full px-2 py-1 bg-retrotext text-retrobg border border-retrogray rounded text-sm ${
                  errors.alignment ? "border-red-500" : ""
                }`}
              >
                <option value="">Seleccionar alineamiento</option>
                {alignmentsData.alignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name_es}
                  </option>
                ))}
              </select>
              {errors.alignment && (
                <p className="text-xs text-red-500 mt-1">{errors.alignment}</p>
              )}
            </div>

            {/* Alignment Description */}
            {selectedAlignment && (
              <div className="bg-gray-900 border border-retrogray p-2 rounded text-xs space-y-1">
                <p>
                  <strong>Filosofía:</strong> {selectedAlignment.filosofia_es}
                </p>
                <p>
                  <strong>Comportamiento:</strong>{" "}
                  {selectedAlignment.comportamiento_tactico_es}
                </p>
              </div>
            )}

            {/* Nota Sobresaliente */}
            <div>
              <label className="block text-xs font-semibold mb-1">
                Nota Sobresaliente
              </label>
              <textarea
                value={characterData?.outstandingNote || ""}
                onChange={(e) => handleInputChange("outstandingNote", e.target.value)}
                placeholder="Ej: Excelente piloto, muy leal a sus compañeros..."
                rows={3}
                className="w-full px-2 py-1 bg-retrotext text-retrobg border border-retrogray rounded text-xs resize-none"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-retroblue text-retrobg font-semibold hover:bg-retrotext hover:text-retroblue border border-retroblue rounded"
          >
            Siguiente → {" "}
          </button>
        </div>
      </RetroCard>
    </div>
  );
}

PersonalDataForm.propTypes = {
  characterData: PropTypes.shape({
    name: PropTypes.string,
    nickname: PropTypes.string,
    birthOrder: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    alignment: PropTypes.string,
    outstandingNote: PropTypes.string,
    photo: PropTypes.string,
  }),
  onDataChange: PropTypes.func.isRequired,
  onNext: PropTypes.func,
};
