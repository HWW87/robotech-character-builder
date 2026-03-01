import React from "react";
import AttributeForm from "./AttributeForm";

/**
 * Componente presentacional puro para selección de atributos.
 * Solo recibe props, sin lógica de estado o hooks de negocio.
 */
export default function AttributesView({
  attributes,
  onAttributeChange,
  onNext,
}) {
  return (
    <>
      <AttributeForm
        attributes={attributes}
        onChange={onAttributeChange}
      />
      <button onClick={onNext}>Next → OCC</button>
    </>
  );
}

import PropTypes from "prop-types";

AttributesView.propTypes = {
  attributes: PropTypes.object.isRequired,
  onAttributeChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

