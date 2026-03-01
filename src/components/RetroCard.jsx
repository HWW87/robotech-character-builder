import React from "react";

/**
 * RetroCard — contenedor estilizado tipo 80's panel
 */
export default function RetroCard({ title, children }) {
  return (
    <div className="bg-retrogray/40 border-2 border-retroblue rounded-2xl p-4 shadow-md mb-6 backdrop-blur-sm">
      {title && (
        <div className="border-b-2 border-retroblue mb-4 pb-1">
          <h2 className="text-retroblue font-bold text-xl uppercase tracking-wider">
            {title}
          </h2>
        </div>
      )}
      <div className="text-retrotext font-mono">{children}</div>
    </div>
  );
}
