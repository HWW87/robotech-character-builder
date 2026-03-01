import React, { useState, useMemo } from "react";
import manualsData from "../data/manuals_parsed.json";

export default function ManualsPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return Object.entries(manualsData)
      .map(([name, doc]) => {
        const matches = doc.pages
          .map((txt, i) => {
            if (txt && txt.toLowerCase().includes(q)) {
              return { page: i, text: txt };
            }
            return null;
          })
          .filter(Boolean);
        if (matches.length) {
          return { name, matches };
        }
        return null;
      })
      .filter(Boolean);
  }, [query]);

  // process OCC info for export
  const occData = useMemo(() => {
    const factions = ['RDF', 'Southern Cross', 'Zentraedi', 'Invid'];
    const out = [];
    Object.values(manualsData).forEach(doc => {
      let current = null;
      doc.pages.forEach(txt => {
        if (!txt) return;
        const headingMatch = txt.match(/^(.*?)\s+O\.C\.C\./i);
        if (headingMatch) {
          if (current) out.push(current);
          current = { name: headingMatch[1].trim(), description: '', skills: [], faction: '' };
        } else if (current) {
          // accumulate description until blank line
          if (txt.trim() === '') {
            // skip
          } else {
            current.description += txt + ' ';
            // look for skill bonuses inside
            const bonusRegex = /([A-Za-z0-9:\- ]+?)\s*\(\s*\+?(\d+)%\s*\)/g;
            let m;
            while ((m = bonusRegex.exec(txt))) {
              current.skills.push({ name: m[1].trim(), bonus: Number(m[2]) });
            }
            // detect faction by keyword
            factions.forEach(f => {
              if (txt.includes(f) && !current.faction) current.faction = f;
            });
          }
        }
      });
      if (current) out.push(current);
    });
    return out;
  }, []);

  // extract specific page ranges for hand-to-hand and mecha
  const handToHandData = useMemo(() => {
    const out = {};
    Object.entries(manualsData).forEach(([name, doc]) => {
      const slice = doc.pages.slice(31, 34); // 31-33 inclusive
      if (slice.some(p => p && p.trim())) {
        out[name] = slice;
      }
    });
    return out;
  }, []);

  const mechaCombatData = useMemo(() => {
    const out = {};
    Object.entries(manualsData).forEach(([name, doc]) => {
      const slice = doc.pages.slice(41); // from 41 onwards
      if (slice.some(p => p && p.trim())) {
        out[name] = slice;
      }
    });
    return out;
  }, []);



  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manuals lookup</h2>
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-retrogray rounded"
          placeholder="Buscar texto en los manuales..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {results === null ? (
        <p className="text-sm text-retrogray">Escribe algo para buscar.</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-red-500">No se encontró nada.</p>
      ) : (
        <div className="space-y-6">
          {results.map((doc, di) => (
            <div key={di}>
              <h3 className="font-semibold underline">{doc.name}</h3>
              <ul className="list-disc pl-5">
                {doc.matches.map((m, mi) => (
                  <li key={mi}>
                    <strong>Página {m.page}:</strong> {m.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <hr className="my-8" />
      <h2 className="text-xl font-bold mb-4">Procesar O.C.C.</h2>
      <p className="mb-2 text-sm text-retrogray">
        Extrae O.C.C. desde los manuales y descarga el JSON resultante.
      </p>
      <button
        className="px-4 py-2 bg-retroblue text-white rounded"
        onClick={() => {
          const blob = new Blob([JSON.stringify(occData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'occ_data.json';
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Descargar O.C.C. JSON
      </button>

      <div className="mt-4 space-x-2">
        <button
          className="px-4 py-2 bg-retrogreen text-white rounded"
          onClick={() => {
            const blob = new Blob([JSON.stringify(handToHandData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'hand_combat_pages.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Exportar páginas 31‑33 (Hand-to-Hand)
        </button>
        <button
          className="px-4 py-2 bg-retrogreen text-white rounded"
          onClick={() => {
            const blob = new Blob([JSON.stringify(mechaCombatData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mecha_combat_pages.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Exportar páginas ≥41 (Mecha)
        </button>
      </div>

      {occData.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Vista previa O.C.C.</h3>
          <pre className="max-h-64 overflow-auto text-xs bg-black text-white p-2">
            {JSON.stringify(occData.slice(0, 5), null, 2)}
          </pre>
        </div>
      )}

      {Object.keys(handToHandData).length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Preview Hand-to-Hand (págs 31‑33)</h3>
          <pre className="max-h-64 overflow-auto text-xs bg-black text-white p-2">
            {JSON.stringify(Object.fromEntries(Object.entries(handToHandData).slice(0,2)), null, 2)}
          </pre>
        </div>
      )}

      {Object.keys(mechaCombatData).length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Preview Mecha (pág ≥41)</h3>
          <pre className="max-h-64 overflow-auto text-xs bg-black text-white p-2">
            {JSON.stringify(Object.fromEntries(Object.entries(mechaCombatData).slice(0,2)), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
